use crate::utils::get_data_directory::get_data_directory;

#[tauri::command(rename_all = "snake_case")]
pub fn save_app_state(content: String)
{
    let path_persistence = get_data_directory().join("app-state.json");

    std::fs::write(&path_persistence, content).expect("Failed to write file");
}