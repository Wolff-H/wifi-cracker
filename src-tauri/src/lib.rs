// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

// 任何根级导入都需要在 lib.rs 中定义，因为 lib.rs 是 crate 的根
use std::collections::HashMap;
use std::process::Command;
use std::io::{BufRead, BufReader};
use std::cmp::Reverse;
use tauri::ipc::InvokeError;


mod logic;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    logic::scan_wifi::scan_wifi_windows();
    
    // tauri::Builder::default()
    //     .plugin(tauri_plugin_opener::init())
    //     .invoke_handler(tauri::generate_handler![
    //         greet,
    //         logic::get_device_info::get_device_info,
    //         logic::greet2::greet2,
    //         logic::get_computer_info::get_computer_info,
    //         logic::scan_wifi::scan_wifi,
    //         // logic::scan_wifi::scan_wifi_windows,
    //     ])
    //     .run(tauri::generate_context!())
    //     .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// pub fn scan_wifi_windows() {

// }