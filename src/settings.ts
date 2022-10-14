/**
 * Following the format of one of my favorite plugins, QuickAdd
 * https://github.com/chhoumann/quickadd/blob/master/src/quickAddSettingsTab.ts
 */
import { App, PluginSettingTab, Setting } from "obsidian"
import ObsidianBookmarkManager from "./main"

export interface ObsidianBookmarkManagerSettings {
    testSetting: boolean
}

export const DEFAULT_SETTINGS: ObsidianBookmarkManagerSettings = {
    testSetting: false
}

/**
 * Settings ideas:
 *  - Target directory to add new bookmarks
 *  - A user-agent to use
 *  - A template to use
 */
export class ObsidianBookmarkManagerSettingsTab extends PluginSettingTab {
    public plugin: ObsidianBookmarkManager;

    constructor(app: App, plugin: ObsidianBookmarkManager) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();
        containerEl.createEl('h2', { text: 'Obsidian Bookmark Manager Settings' });

        new Setting(this.containerEl)
            .setName('Test Setting')
            .setDesc('Putting this here to experiment with testing')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.testSetting)
                .setTooltip("Test Setting on or off")
                .onChange(value => {
                    if (value) {
                        this.plugin.settings.testSetting = true;
                    } else {
                        this.plugin.settings.testSetting = false;
                    }
                    this.plugin.saveSettings();
                })
            )
    }

    hide(): any {

    }
}