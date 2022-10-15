import { DateTime } from "luxon";
import { App, Notice, TFile, TFolder } from "obsidian";
import Bookmark from "./Bookmark";

const TARGET_DIR = "📥 Inbox 📥/Bookmarks";

export type Group = {
    uuid: string
    name: string
    children: Group[]
}

export default class FileUtil {
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    private sanitizeFilename(name: string): string {
        return name.replace(/[^a-zA-Z0-9 _-]/g, '')
    }

    public async getFileContents(path: string): Promise<string> {
        return await this.app.vault.adapter.read(path);
    }

    public async updateFile(path: string, newContents: string) {
        return await this.app.vault.adapter.write(path, newContents);
    }

    public getActiveFile(): TFile | null {
        return this.app.workspace.getActiveFile();
    }

    public openFile(file: TFile): void {
        this.app.workspace.getLeaf(false).openFile(file);
    }

    public async getDevonthinkIdFromFile(path: string): Promise<string | undefined> {
        let fileContents = await this.getFileContents(path);
        if (!fileContents) {
            return;
        }
        let splitContents = fileContents.split("\n");
        for (const line of splitContents) {
            if (line.indexOf("DevonthinkID") >= 0) {
                let lineParts = line.split("::");
                if (lineParts.length !== 2) {
                    return;
                } else {
                    return lineParts[1].trim();
                }
            }
        }
    }

    public async markActiveFileVerified(): Promise<void> {
        let currentFile = this.getActiveFile();
        if (!currentFile) {
            return;
        }

        let devonthinkId = await this.getDevonthinkIdFromFile(currentFile.path);

        if (!devonthinkId) {
            return;
        }

        this.updateDevonthinkData(currentFile.path, devonthinkId, true, false);
    }

    public async saveBookmark(bookmark: Bookmark) {
        const { vault } = this.app;
        let fileName = TARGET_DIR + "/" + this.sanitizeFilename(bookmark.getTitle()) + ".md";
        let fileContents = bookmark.convertToMarkdown();
        let alreadyExists = await this.app.vault.adapter.exists(fileName, false);
        if (alreadyExists) {
            throw new Error("Target file for bookmark already exists");
        }
        let newFile = await vault.create(fileName, fileContents);
        if (newFile) {
            this.openFile(newFile);
            return true;
        } else {
            throw new Error("No file was created");
        }
    }

    public async updateDevonthinkData(path: string, devonthinkId: string, verified: boolean, updateTimestamp: boolean): Promise<boolean> {
        let fileContents = await this.getFileContents(path);
        if (!fileContents) {
            new Notice("Unable to load file " + path, 2500);
            return false;
        }

        let splitContents = fileContents.split("\n");
        let updated = false;
        for (let i = 0; i < splitContents.length; i++) {
            let line = splitContents[i];
            let newline = null;
            if (line.indexOf("DevonthinkID") >= 0) {
                newline = `**DevonthinkID**:: ${devonthinkId}`;
            } else if (line.indexOf("DevonthinkLink") >= 0) {
                newline = `**DevonthinkLink**:: [Link](x-devonthink-item://${devonthinkId})`;
            } else if (line.indexOf("DevonthinkSyncTimestamp") >= 0) {
                if (updateTimestamp) {
                    newline = `**DevonthinkSyncTimestamp**:: ${DateTime.now().toISO()}`;
                }
            } else if (line.indexOf("DevonthinkVerified") >= 0) {
                if (verified) {
                    newline = `**DevonthinkVerified**:: 🟩`;
                }
            }

            if (newline !== null) {
                splitContents[i] = newline;
                updated = true;
            }
        }

        if (updated) {
            await this.updateFile(path, splitContents.join("\n"));
            return true;
        } else {
            new Notice("Nothing was updated in " + path, 2500);
            return false;
        }
    }

    public getObsidianJDGroups(): Group {
        let root: Group = {
            uuid: "root",
            name: "root",
            children: []
        }
        let parents = this.getRootJDFolderNames();
        for (const parent of parents) {
            let children = this.getChildJDFolderNames(parent);
            let parentGroup: Group = {
                uuid: parent,
                name: parent,
                children: []
            }

            for (const child of children) {
                parentGroup.children.push({
                    uuid: child,
                    name: child,
                    children: []
                })
            }
            root.children.push(parentGroup);
        }
        return root;
    }

    /**
     * Is one of the top Johnny Decimal categories (e.g. 00-09, 10-19, etc)
     */
    public getRootJDFolderNames(): string[] {
        const foldersToExclude = ['📥 Inbox 📥', 'Journal'];
        const rootDir: TFolder = this.app.vault.getRoot();
        return rootDir.children.filter((child: any) => {
            let isDirectory = !child.extension || !child.basename;
            let isJDFolder = foldersToExclude.indexOf(child.name) < 0;
            return isDirectory && isJDFolder;
        }).map((child) => child.name);
    }

    public getChildJDFolderNames(childRoot: string) {
        const secondLevel: any = app.vault.getRoot().children.find(child => child.name === childRoot);
        if (!secondLevel) {
            new Notice("Unable to retrieve directories for " + childRoot, 2500);
            return false;
        }

        return secondLevel.children.filter((child: any) => {
            let isDirectory = !child.extension || !child.basename;
            return isDirectory;
        }).map((child: any) => child.name);
    }
}