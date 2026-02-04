use serde_json::Value;
use std::fs;
use std::path::Path;
use tauri::{Manager, State};
use tauri_plugin_cli::CliExt;

#[derive(Debug)]
struct AppData {
    cli_argument_filename: Option<String>,
}

fn is_image(filepath: &Path) -> bool {
    filepath
        .extension()
        .and_then(|s| s.to_str())
        .is_some_and(|s| match s.to_lowercase().as_str() {
            // list from https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
            "apng" => true,
            "png" => true,
            "avif" => true,
            "jpg" => true,
            "jpeg" => true,
            "jfif" => true,
            "pjpeg" => true,
            "pjp" => true,
            "svg" => true,
            "webp" => true,
            "bmp" => true,
            "ico" => true,
            "cur" => true,
            "tif" => true,
            "tiff" => true,
            _ => false,
        })
}

#[tauri::command]
fn list_files_in_same_directory(filepath: &str) -> Result<Vec<String>, String> {
    let filepath = Path::new(filepath);
    let dirname = if filepath.is_dir() {
        &filepath
    } else {
        filepath.parent().ok_or("Invalid file path")?
    };

    let result: Vec<_> = fs::read_dir(dirname)
        .map_err(|_| format!("Cannot read directory {}", dirname.to_str().unwrap_or("")))?
        .into_iter()
        .flat_map(|entry| entry)
        .filter(|entry| entry.metadata().is_ok_and(|m| m.is_file()))
        .filter(|entry| is_image(&entry.path()))
        .flat_map(|entry| entry.path().to_str().map(|s| s.to_string()))
        .collect();

    Ok(result)
}

#[tauri::command]
fn get_cli_argument_filename(state: State<'_, AppData>) -> Option<String> {
    state.cli_argument_filename.clone()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .setup(|app| {
            let file = match app.cli().matches() {
                Ok(matches) => matches.args.get("file").cloned(),
                Err(_) => None,
            };
            let file = file.and_then(|x| match x.value {
                Value::String(x) => Some(x),
                _ => None,
            });

            app.manage(AppData {
                cli_argument_filename: file,
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            list_files_in_same_directory,
            get_cli_argument_filename,
        ])
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
