use tauri::ipc::InvokeError;
use crate::utils::get_data_directory::get_data_directory;

#[tauri::command(rename_all = "snake_case")]
pub fn delete_wlan_profile(wlan_card: String, name: String) -> Result<(), InvokeError>
{
    let path_wlan_profiles = get_data_directory().join("wlan-profiles").join(wlan_card);

    // 在 WLAN 配置文件目录删除 WLAN 配置文件 //
    let path_wlan_profile = path_wlan_profiles.join(format!("{}.xml", name));
    std::fs::remove_file(&path_wlan_profile).expect("Failed to remove file");

    Ok(())
}