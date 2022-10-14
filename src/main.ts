import { Plugin } from 'obsidian';
import AddBookmarkModal from './AddBookmarkModal';
import { DEFAULT_SETTINGS, ObsidianBookmarkManagerSettings, ObsidianBookmarkManagerSettingsTab } from './settings';


export default class ObsidianBookmarkManager extends Plugin {
	settings: ObsidianBookmarkManagerSettings;

	async onload() {
		await this.loadSettings();

		const ribbonIconEl = this.addRibbonIcon('link', 'Bookmarks', (evt: MouseEvent) => {
			new AddBookmarkModal(this.app).open();
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ObsidianBookmarkManagerSettingsTab(this.app, this));

		this.addCommand({
			id: 'add-bookmark',
			name: 'Add Bookmark',
			callback: () => {
				new AddBookmarkModal(this.app).open();
			}
		});
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
