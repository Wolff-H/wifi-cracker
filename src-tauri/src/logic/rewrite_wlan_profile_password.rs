use tauri::ipc::InvokeError;
use crate::utils::get_data_directory::get_data_directory;

#[tauri::command(rename_all = "snake_case")]
pub fn rewrite_wlan_profile_password(wlan_card: String, profile_name: String, password: String) -> Result<(), InvokeError>
{
    let path_wlan_profiles = get_data_directory().join("wlan-profiles").join(wlan_card);

    // 重写 WLAN 配置文件的 keyMaterial 标签内容为 password 参数值 //
    let path_wlan_profile = path_wlan_profiles.join(format!("{}.xml", profile_name));
    let profile_content = std::fs::read_to_string(&path_wlan_profile).expect("Failed to read file");

    // 将 profile_content 中的 keyMaterial 标签内容替换为 password 参数值 //
    let profile_content = regex::Regex::new(r"<keyMaterial>.*?</keyMaterial>").expect("Failed to create regex")
        .replace(&profile_content, vec!["<keyMaterial>", &password, "</keyMaterial>"].join("").as_str())
        .to_string();

    std::fs::write(&path_wlan_profile, profile_content).expect("Failed to write file");

    Ok(())
}