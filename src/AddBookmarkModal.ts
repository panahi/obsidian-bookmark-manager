import { App, ButtonComponent, DropdownComponent, Modal, Notice, TextComponent } from "obsidian";
import { BookmarkCategory } from "./BookmarkCategory";
import Bookmark from "./Bookmark";
import FileUtil from "./FileUtil";

export default class AddBookmarkModal extends Modal {
    private currentUrl?: string;
    private linkCategory?: BookmarkCategory;
    private inputComponent: TextComponent;
    private fileUtil: FileUtil;


    constructor(app: App) {
        super(app);

        this.fileUtil = new FileUtil(app);

        this.currentUrl = undefined;
        this.linkCategory = undefined;

        this.containerEl.addClass("addBookmarkModal");
        this.display();
        this.open();
    }

    private display() {
        this.renderHeader();
        this.inputComponent = this.renderURLInput();
    }

    private renderHeader() {
        const headerEl: HTMLHeadingElement = this.contentEl.createEl('h2', { cls: "bookmarkModalHeader" });
        headerEl.setText("Add a new bookmark");
    }

    private createButton(container: HTMLElement, text: string, callback: (evt: MouseEvent) => any) {
        const btn = new ButtonComponent(container);
        btn.setButtonText(text)
            .onClick(callback);

        return btn;
    }

    private renderURLInput(): TextComponent {
        const urlInputContainer: HTMLDivElement = this.contentEl.createDiv();
        const textComponent = new TextComponent(urlInputContainer);
        this.renderTypeChooser(urlInputContainer);

        textComponent.inputEl.style.width = "100%";
        textComponent.setPlaceholder("https://google.com")
            .setValue(this.currentUrl ?? "")
            .onChange(value => this.currentUrl = value)
            .inputEl.addEventListener('keydown', console.log);

        const buttonBarContainer: HTMLDivElement = urlInputContainer.createDiv();
        this.createButton(buttonBarContainer, "Ok", this.submitClickCallback)
            .setCta().buttonEl.style.marginRight = '0';
        this.createButton(buttonBarContainer, "Cancel", this.cancelClickCallback);

        buttonBarContainer.style.display = 'flex';
        buttonBarContainer.style.flexDirection = 'row-reverse';
        buttonBarContainer.style.justifyContent = 'flex-start';
        buttonBarContainer.style.marginTop = '1rem';

        return textComponent;
    }

    private renderTypeChooser(container: HTMLDivElement) {
        const dropdown = new DropdownComponent(container);

        //@ts-ignore
        for (const category of Object.keys(BookmarkCategory).filter((val) => isNaN(val))) {
            dropdown.addOption(category, category[0].toUpperCase() + category.substring(1))
        }
        dropdown.onChange((val) => {
            //@ts-ignore
            this.linkCategory = val
        })

        dropdown.selectEl.style.width = "100%";
        dropdown.selectEl.style.marginTop = "10px";
    }

    private submitClickCallback = (evt: MouseEvent) => this.submit();
    private cancelClickCallback = (evt: MouseEvent) => this.cancel();

    private submitEnterCallback = (evt: KeyboardEvent) => {
        if (evt.key === "Enter") {
            evt.preventDefault();
            this.submit();
        }
    }

    private async submit() {
        if (this.currentUrl && this.linkCategory) {
            let bookmark = new Bookmark(this.currentUrl, this.linkCategory);
            try {
                await bookmark.loadContent();
                let fileCreated = await this.fileUtil.saveBookmark(bookmark);
                if (fileCreated) {
                    this.close();
                } else {
                    new Notice("No file was created");
                    this.close();
                }
            } catch (err) {
                console.log(err);
                new Notice(err);
                this.close();
            }
            console.log(bookmark);
        } else {
            new Notice("Please set a URL and choose a category");
        }
    }

    private cancel() {
        this.close();
    }

    private removeInputListener() {
        this.inputComponent.inputEl.removeEventListener('keydown', this.submitEnterCallback)
    }

    reload() {
        this.contentEl.empty();
        this.display();
    }

    onOpen() {
        super.onOpen();

        this.inputComponent.inputEl.focus();
        this.inputComponent.inputEl.select();
    }

    onClose() {
        super.onClose();
        this.removeInputListener();
        this.currentUrl = undefined;
    }
}