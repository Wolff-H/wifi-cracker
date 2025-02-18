// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

// 在 lib.rs 中定义根级导入，因为 lib.rs 是 crate 的根

use tauri::Emitter;

mod utils;
mod logic;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    logic::initialize::initialize();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            logic::get_device_info::get_device_info,
            logic::greet2::greet2,
            logic::get_computer_info::get_computer_info,
            logic::scan_wifi::scan_wifi,
            logic::read_passwordbook::read_passwordbook,
            logic::create_wlan_profile::create_wlan_profile,
            logic::add_wlan_profile_registration::add_wlan_profile_registration,
            logic::remove_wlan_profile_registration::remove_wlan_profile_registration,
            logic::delete_wlan_profile::delete_wlan_profile,
            logic::rewrite_wlan_profile_password::rewrite_wlan_profile_password,
            logic::connect_wlan::connect_wlan,
            logic::check_wlan_connection::check_wlan_connection,
            logic::save_app_state::save_app_state,
            logic::read_app_state_persistence::read_app_state_persistence,
            logic::exit_app::exit_app,
        ])
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                // 向前端触发关闭事件 //
                // window.emit("close", "").unwrap();
                window.emit_to(tauri::EventTarget::any(), "window-close", ()).unwrap();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}