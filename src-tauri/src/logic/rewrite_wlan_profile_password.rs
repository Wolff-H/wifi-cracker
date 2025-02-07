use tauri::ipc::InvokeError;

#[tauri::command(rename_all = "snake_case")]
pub fn rewrite_wlan_profile_password(wlan_card: String, profile_name: String, password: String) -> Result<(), InvokeError>
{
    let path_wlan_profiles = std::env::current_dir().expect("Failed to get directory")
        .join("wc-data")
        .join("wlan-profiles")
        .join(wlan_card);

    // 重写 WLAN 配置文件的 keyMaterial 标签内容为 password 参数值 //
    let path_wlan_profile = path_wlan_profiles.join(profile_name);

    let profile_content = std::fs::read_to_string(&path_wlan_profile).expect("Failed to read file");

    let profile_content = profile_content.replace(
        "<keyMaterial>.*</keyMaterial>", 
        &format!("<keyMaterial>{}</keyMaterial>", password)
    );

    std::fs::write(&path_wlan_profile, profile_content).expect("Failed to write file");

    Ok(())
}