import { Notice, Plugin } from "obsidian";
import { grabCommmunityPluginList } from "./lib";

export default class ReinstallPlugin extends Plugin {
	async onload() {
		this.addRibbonIcon("dice", "Greet", () => {
			new Notice("Hello, world!");
			this.updatePluginsFiles();
		});
	}

	updatePluginsFiles() {
		// TODO
		// 1. 判断文件夹是否存在
		// 2. 获取发布的文件
		// 3. 写入文件
	}

	async savePluginsList() {
		const pList = await grabCommmunityPluginList();
		if (pList) {
			const local = this.getLocalPlugins();
			const data = pList.filter((item) => local.has(item.id));
			this.saveData(data);
			new Notice("plugins's config saved");
		}
	}

	getLocalPlugins() {
		return new Set(Object.keys((this.app as any).plugins.plugins));
	}

	onunload() {}
}
