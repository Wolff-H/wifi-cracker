use tauri::ipc::InvokeError;

#[tauri::command(rename_all = "snake_case")]
pub fn delete_wlan_profile(wlan_card: String, name: String) -> Result<(), InvokeError>
{
    let path_wlan_profiles = std::env::current_dir().expect("Failed to get current directory")
        .join("wc-data")
        .join("wlan-profiles")
        .join(wlan_card);

    // 在 WLAN 配置文件目录删除 WLAN 配置文件 //
    let path_wlan_profile = path_wlan_profiles.join(name);
    std::fs::remove_file(&path_wlan_profile).expect("Failed to remove file");

    Ok(())
}