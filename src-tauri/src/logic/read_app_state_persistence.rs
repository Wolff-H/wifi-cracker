use crate::utils::get_data_directory::get_data_directory;
use std::io::Read;

#[tauri::command(rename_all = "snake_case")]
pub fn read_app_state_persistence() -> String
{
    let path_persistence = get_data_directory().join("app-state.json");

    // 读取并返回文件内容 //
    let mut file = std::fs::File::open(path_persistence).unwrap();
    let mut contents = String::new();
    
    file.read_to_string(&mut contents).unwrap();

    contents
}