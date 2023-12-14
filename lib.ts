import { request } from "obsidian";

const GITHUB_RAW_USERCONTENT_PATH = "https://raw.githubusercontent.com/";

/**
 * pulls from github a release file by its version number
 *
 * @param repository - path to GitHub repository in format USERNAME/repository
 * @param version    - version of release to retrive
 * @param fileName   - name of file to retrieve from release
 *
 * @returns contents of file as string from the repository's release
 */
export const grabReleaseFileFromRepository = async (
	repository: string,
	version: string,
	fileName: string,
	debugLogging = true
): Promise<string | null> => {
	const URL = `https://github.com/${repository}/releases/download/${version}/${fileName}`;
	try {
		const download = await request({ url: URL });
		return download === "Not Found" || download === `{"error":"Not Found"}`
			? null
			: download;
	} catch (error) {
		if (debugLogging)
			console.log("error in grabReleaseFileFromRepository", URL, error);
		return null;
	}
};

export interface CommunityPlugin {
	id: string;
	name: string;
	author: string;
	description: string;
	repo: string;
	version?: string;
}

export const grabCommmunityPluginList = async (
	debugLogging = true
): Promise<CommunityPlugin[] | null> => {
	const pluginListUrl = `https://raw.githubusercontent.com/obsidianmd/obsidian-releases/HEAD/community-plugins.json`;
	try {
		const response = await request({ url: pluginListUrl });
		return response === "404: Not Found"
			? null
			: ((await JSON.parse(response)) as CommunityPlugin[]);
	} catch (error) {
		if (debugLogging)
			console.log("error in grabCommmunityPluginList", error);
		return null;
	}
};

export interface ReleaseFiles {
	mainJs: string | null;
	manifest: string | null;
	styles: string | null;
}

/**
 * Gets all the release files based on the version number in the manifest
 *
 * @param repositoryPath - path to the GitHub repository
 * @param manifest       - manifest file
 * @param getManifest    - grab the remote manifest file
 * @param specifyVersion - grab the specified version if set
 *
 * @returns all relase files as strings based on the ReleaseFiles interaface
 */
export const getAllReleaseFiles = async (
	repositoryPath: string,
	version: string
): Promise<ReleaseFiles> => {
	return {
		mainJs: await grabReleaseFileFromRepository(
			repositoryPath,
			version,
			"main.js"
		),
		manifest: await grabReleaseFileFromRepository(
			repositoryPath,
			version,
			"manifest.json"
		),
		styles: await grabReleaseFileFromRepository(
			repositoryPath,
			version,
			"styles.css"
		),
	};
};
