use tauri::ipc::InvokeError;

#[tauri::command(rename_all = "snake_case")]
// #[logcall::logcall]
pub fn create_wlan_profile(wlan_card: String, name: String, content: String) -> Result<String, InvokeError>
{
    let path_wlan_profiles = std::env::current_dir().expect("Failed to get current directory")
        .join("wc-data")
        .join("wlan-profiles")
        .join(wlan_card);

    // 在 WLAN 配置文件目录生成 WLAN 配置文件 //
    let path_wlan_profile = path_wlan_profiles.join(format!("{}.xml", name));
    if !path_wlan_profiles.exists() { std::fs::create_dir_all(&path_wlan_profiles).expect("Failed to create directory"); }
    std::fs::write(&path_wlan_profile, content).expect("Failed to write file");

    // 返回 WLAN 配置文件目录位置的完整绝对路径 //
    let file_full_path = path_wlan_profile.to_str().expect("Failed to convert path to string").to_string();

    Ok(file_full_path)
}