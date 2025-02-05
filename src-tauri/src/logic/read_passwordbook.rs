use std::{fs::File, io::Read};



#[tauri::command]
pub fn read_passwordbook() -> String {
    let mut content = String::new();

    let mut file = File::open("./wc-data/passwordbook.txt").unwrap();

    file.read_to_string(&mut content).unwrap();

    content
}