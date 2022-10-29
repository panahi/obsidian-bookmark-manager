import { Notice, Plugin } from 'obsidian';
import AddBookmarkModal from './AddBookmarkModal';
import { DEFAULT_SETTINGS, ObsidianBookmarkManagerSettings, ObsidianBookmarkManagerSettingsTab } from './settings';
import { getJDGroupStructure, getNewDocumentsWithHighlights } from './devonthink/devonthink-client';
import FileUtil, { Group } from './FileUtil';
import SyncManager from './SyncManager';


export default class ObsidianBookmarkManager extends Plugin {
	settings: ObsidianBookmarkManagerSettings;
	fileUtil: FileUtil
	syncManager: SyncManager

	async onload() {
		this.fileUtil = new FileUtil(this.app);
		this.syncManager = new SyncManager(this.app);
		await this.loadSettings();
		const ribbonIconEl = this.addRibbonIcon('link', 'Bookmarks', (evt: MouseEvent) => {
			new AddBookmarkModal(this.app).open();
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ObsidianBookmarkManagerSettingsTab(this.app, this));

		this.addCommand({
			id: 'verify-structure',
			name: 'Verify Devonthink and Obsidian consistency',
			callback: async () => {
				let consistentStructure = await this.verifyJohnnyDecimalConsistency();
				if (!consistentStructure) {
					new Notice("Identified discrepencies between Obsidian and Devonthink");
				}
			}
		})

		this.addCommand({
			id: 'add-bookmark',
			name: 'Add Bookmark',
			callback: () => {
				new AddBookmarkModal(this.app).open();
			}
		});

		this.addCommand({
			id: 'sync-bookmark-to-devonthink',
			name: 'Sync Bookmark (Devonthink)',
			callback: () => {
				this.syncManager.synchronizeActiveFile();
			}
		});

		this.addCommand({
			id: 'verify-bookmark',
			name: 'Verify Bookmark Archive',
			callback: () => {
				this.fileUtil.markActiveFileVerified();
			}
		})

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
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

	async verifyJohnnyDecimalConsistency(): Promise<boolean> {
		const leftMatchesRight = (left: Group, right: Group): boolean => {
			if (left.children.length === 0) {
				if (right.children.length === 0) {
					return true;
				} else {
					console.log(`${left.name} has no children while ${right.name} has ${right.children}`)
					return false;
				}
			} else {
				let allChildrenMatch = true;
				for (const leftChild of left.children) {
					let rightMatch = right.children.find((rightChild: Group) => rightChild.name === leftChild.name);
					if (!rightMatch) {
						console.log(`Unable to find element ${leftChild.name} in other array`);
						allChildrenMatch = false;
					} else {
						allChildrenMatch = allChildrenMatch && leftMatchesRight(leftChild, rightMatch);
					}
				}
				return allChildrenMatch;
			}
		};

		const dtGroups = await getJDGroupStructure();
		const obGroups = this.fileUtil.getObsidianJDGroups();
		return leftMatchesRight(dtGroups, obGroups) && leftMatchesRight(obGroups, dtGroups);
	}
}