#[tauri::command(rename_all = "snake_case")]
pub fn exit_app(app_handle: tauri::AppHandle)
{
    // std::process::exit(0);
    tauri::AppHandle::exit(&app_handle, 0);
}