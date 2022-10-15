import { App, Notice, TFile } from "obsidian";
import { createPDFFromURL, getUUIDforItem } from "./devonthink/devonthink-client";
import FileUtil from "./FileUtil";

type SyncFields = {
    title: string
    url: string
    obsidianId: string
    devonthinkId?: string
    tags?: string[]
    highlights?: string[]
}


export default class SyncManager {
    private app: App;
    private fileUtil: FileUtil

    constructor(app: App) {
        this.app = app;
        this.fileUtil = new FileUtil(app);
    }

    public async synchronizeActiveFile(): Promise<void> {
        const activeFile = this.fileUtil.getActiveFile();
        if (!activeFile) {
            new Notice("Unable to sync bookmark without active file", 2500);
            return;
        }

        if (activeFile.path.startsWith('📥 Inbox 📥') || activeFile.path.startsWith("Journal")) {
            new Notice("Synchronization blocked for bookmarks that haven't been filed yet");
            return;
        }

        const rawContents = await this.fileUtil.getFileContents(activeFile.path);
        const splitContents = rawContents.split("\n");
        const obsidianFields = this.getObsidianSyncFields(splitContents, activeFile.basename);
        console.log(obsidianFields);

        if (!obsidianFields.devonthinkId) {
            let syncSuccess = await this.performFirstTimeSync(obsidianFields, activeFile);
            if (syncSuccess) {
                new Notice("Bookmark successfully sent to Devonthink - please verify", 2500);
                return;
            } else {
                new Notice("Bookmark sync failed - check console", 2500);
                return;
            }
        } else {
            const devonthinkSyncFields = await this.getDevonthinkSyncFields(obsidianFields.devonthinkId);
            await this.performBidirectionalSync();
        }
    }

    private getObsidianSyncFields(splitContents: string[], basename: string): SyncFields {
        const getMetadataValue = (str: string, delim: string): string => {
            let parts = str.split(delim);
            if (parts.length !== 2) {
                console.log("Unexpected line format: " + str);
                return "";
            } else {
                return parts[1].trim();
            }
        }

        let url = "", obsidianId = "", devonthinkId;
        let tags: string[] = [];

        for (const line of splitContents) {
            if (line.startsWith("id:")) {
                obsidianId = getMetadataValue(line, ":");
            } else if (line.startsWith("tags:")) {
                let tagString = getMetadataValue(line, ":");
                if (tagString.length > 0) {
                    tags = tagString.split(" ").map(tag => tag.replace('#', '').trim());
                }
            } else if (line.indexOf("CanonicalURL") >= 0) {
                url = getMetadataValue(line, "::");
                url = url.replace('<', '');
                url = url.replace('>', '');
            } else if (line.indexOf("DevonthinkID") >= 0) {
                devonthinkId = getMetadataValue(line, "::");
            }
        }

        return {
            title: basename,
            url: url,
            obsidianId: obsidianId,
            devonthinkId: devonthinkId,
            tags: tags
        }
    }

    private async getDevonthinkSyncFields(devonthinkId: string): Promise<SyncFields> {
        return {
            title: "",
            url: "",
            obsidianId: ""
        }
    }

    private async performFirstTimeSync(values: SyncFields, obsidianFile: TFile): Promise<boolean> {
        let groupName = obsidianFile.parent.name;
        let devonthinkGroupId: string | undefined = await getUUIDforItem({
            name: groupName,
            database: 'Brain',
            kind: 'group'
        })

        if (!devonthinkGroupId) {
            new Notice("Failed to find the relevant devonthink group to sync bookmark to");
            return false;
        }

        let devonthinkId = await createPDFFromURL(
            values.url,
            obsidianFile.basename,
            devonthinkGroupId,
            { mdobsidianlink: this.getObsidianItemURL(values.obsidianId) },
            values.tags
        )

        if (!devonthinkId) {
            new Notice("No devonthink ID was created", 2500);
            return false;
        }

        return this.fileUtil.updateDevonthinkData(obsidianFile.path, devonthinkId, false, true);
    }

    private async performBidirectionalSync() {
        //TODO
    }

    /**
     * 
     * obsidian://advanced-uri?vault=brain&commandid=quickadd%253Achoice%253A93bf0dd3-ff1e-494d-920a-e41c72bf6549&fileId=1094f0c7512c-4375-823d-851206d775b6
     */
    private getObsidianItemURL(obsidianId: string): string {
        let url = "obsidian://advanced-uri?vault=brain&commandid=quickadd%253Achoice%253A93bf0dd3-ff1e-494d-920a-e41c72bf6549";
        url += "&fileId=" + encodeURIComponent(obsidianId);
        return url;
    }
}