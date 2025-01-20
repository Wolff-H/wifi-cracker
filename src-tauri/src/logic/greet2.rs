#[tauri::command]
pub fn greet2(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}