import { App } from "obsidian";
import Bookmark from "./Bookmark";

const TARGET_DIR = "📥 Inbox 📥";

export default class FileUtil {
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    private sanitizeFilename(name: string): string {
        return name.replace(/[^a-zA-Z0-9 _-]/g, '')
    }

    public async saveBookmark(bookmark: Bookmark) {
        const { workspace, vault } = this.app;
        let fileName = TARGET_DIR + "/" + this.sanitizeFilename(bookmark.getTitle()) + ".md";
        let fileContents = bookmark.convertToMarkdown();
        let alreadyExists = await this.app.vault.adapter.exists(fileName, false);
        if (alreadyExists) {
            throw new Error("Target file for bookmark already exists");
        }
        let newFile = await vault.create(fileName, fileContents);
        if (newFile) {
            workspace.getLeaf(false).openFile(newFile, { active: true });
            return true;
        } else {
            throw new Error("No file was created");
        }
    }
}