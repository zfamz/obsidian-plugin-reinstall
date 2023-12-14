import { Notice, Plugin, normalizePath } from "obsidian";
import { CommunityPlugin, ReleaseFiles } from "./lib";
import { grabCommmunityPluginList, getAllReleaseFiles } from "./lib";

export default class ReinstallPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: "reinstall-backup",
			name: "Backup list",
			callback: () => {
				this.savePluginsList();
			},
		});
		this.addCommand({
			id: "reinstall-reinstall",
			name: "Reinstall",
			callback: () => {
				this.updatePluginsFiles();
			},
		});
		this.addCommand({
			id: "reinstall-show",
			name: "Show",
			callback: () => {
				this.loadData().then((list) => {
					let str = "";
					list.map((item: CommunityPlugin) => {
						str += `${item.name}: ${item.version}\n`;
					});
					new Notice(str);
				});
			},
		});
	}

	async updatePluginsFiles() {
		const list = await this.loadData();
		if (list && list.length) {
			console.log(list);
			list.map(async (item: CommunityPlugin) => {
				const notice = new Notice(
					`reinstall plugin  ${item.name} ...`,
					0
				);
				const rFile = await getAllReleaseFiles(
					item.repo,
					item.version!
				);
				await this.writeReleaseFilesToPluginFolder(item.id, rFile);
				notice.hide();
			});
		}
	}

	async writeReleaseFilesToPluginFolder(
		betaPluginId: string,
		relFiles: ReleaseFiles
	): Promise<void> {
		const pluginTargetFolderPath =
			normalizePath(
				this.app.vault.configDir + "/plugins/" + betaPluginId
			) + "/";
		const { adapter } = this.app.vault;
		if (
			!(await adapter.exists(pluginTargetFolderPath)) ||
			!(await adapter.exists(pluginTargetFolderPath + "manifest.json"))
		) {
			// if plugin folder doesnt exist or manifest.json doesn't exist, create it and save the plugin files
			await adapter.mkdir(pluginTargetFolderPath);
		}
		await adapter.write(
			pluginTargetFolderPath + "main.js",
			relFiles.mainJs ?? ""
		);
		if (relFiles.styles)
			await adapter.write(
				pluginTargetFolderPath + "styles.css",
				relFiles.styles
			);
		await adapter.write(
			pluginTargetFolderPath + "manifest.json",
			relFiles.manifest ?? ""
		);
	}

	async savePluginsList() {
		const pList = await grabCommmunityPluginList();
		if (pList) {
			const localPlugins = (this.app as any).plugins.manifests;
			const keys = new Set(Object.keys(localPlugins));
			console.log(keys);
			const data = pList.filter((item) => {
				if (keys.has(item.id)) {
					item.version = localPlugins[item.id].version;
					return true;
				}
			});
			this.saveData(data);
			new Notice("plugins's config saved");
		}
	}

	onunload() {}
}
