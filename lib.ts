import type { PluginManifest } from "obsidian";
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

/**
 * grabs the manifest.json from the repository. rootManifest - if true grabs manifest.json if false grabs manifest-beta.json
 *
 * @param repositoryPath - path to GitHub repository in format USERNAME/repository
 * @param rootManifest   - if true grabs manifest.json if false grabs manifest-beta.json
 *
 * @returns returns manifest file for  a plugin
 */
export const grabManifestJsonFromRepository = async (
	repositoryPath: string,
	rootManifest = true,
	debugLogging = true
): Promise<PluginManifest | null> => {
	const manifestJsonPath =
		GITHUB_RAW_USERCONTENT_PATH +
		repositoryPath +
		(rootManifest ? "/HEAD/manifest.json" : "/HEAD/manifest-beta.json");
	if (debugLogging)
		console.log(
			"grabManifestJsonFromRepository manifestJsonPath",
			manifestJsonPath
		);
	try {
		const response: string = await request({ url: manifestJsonPath });
		if (debugLogging)
			console.log("grabManifestJsonFromRepository response", response);
		return response === "404: Not Found"
			? null
			: ((await JSON.parse(response)) as PluginManifest);
	} catch (error) {
		if (error !== "Error: Request failed, status 404" && debugLogging) {
			// normal error, ignore
			console.log(
				`error in grabManifestJsonFromRepository for ${manifestJsonPath}`,
				error
			);
		}
		return null;
	}
};

export interface CommunityPlugin {
	id: string;
	name: string;
	author: string;
	description: string;
	repo: string;
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
