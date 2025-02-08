use std::{fs::File, io::Read};
use crate::utils::get_data_directory::get_data_directory;



#[tauri::command]
pub fn read_passwordbook() -> String {
    let mut content = String::new();
    let mut file = File::open(format!("{}/passwordbook.txt", get_data_directory().display())).unwrap();

    file.read_to_string(&mut content).unwrap();

    content
}