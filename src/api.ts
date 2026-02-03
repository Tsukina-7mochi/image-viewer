import { invoke } from "@tauri-apps/api/core";

export async function listFilesInSameDirectory(
  filepath: string,
): Promise<string[]> {
  return await invoke<string[]>("list_files_in_same_directory", {
    filepath,
  });
}

export async function getCliArgumentFilepath(): Promise<string | undefined> {
  return await invoke<string | undefined>("get_cli_argument_filename");
}
