use tauri::ipc::InvokeError;
use crate::utils::get_data_directory::get_data_directory;

#[tauri::command(rename_all = "snake_case")]
pub fn rewrite_wlan_profile_password(wlan_card: String, profile_name: String, password: String) -> Result<(), InvokeError>
{
    // println!("{}=================", password.clone());
    // println!("${}===$", password);
    // let key_tag = String::from("<keyMaterial>") + password.clone() + String::from("</keyMaterial>");
    // println!("{}", key_tag);
    // println!("{}", format!("{}{}{}", "<keyMaterial>", "password.clone()", "</keyMaterial>").as_str());

    // println!("{}", format!("{}{}{}", "<keyMaterial>", &password.clone(), "</keyMaterial>").as_str());
    // let path_wlan_profiles = std::env::current_dir().expect("Failed to get directory")
    //     .join("wc-data")
    //     .join("wlan-profiles")
    //     .join(wlan_card);

    let path_wlan_profiles = get_data_directory().join("wlan-profiles").join(wlan_card);

    // 重写 WLAN 配置文件的 keyMaterial 标签内容为 password 参数值 //
    let path_wlan_profile = path_wlan_profiles.join(format!("{}.xml", profile_name));

    let profile_content = std::fs::read_to_string(&path_wlan_profile).expect("Failed to read file");

    // let match_password_tag = regex::Regex::new(r"(<keyMaterial>)(.*?)(</keyMaterial>)").expect("Failed to create regex");
    // let profile_content = match_password_tag.replace(&profile_content, format!("${{1}}{}${{3}}", password)).to_string();

    // 将 profile_content 中的 keyMaterial 标签内容替换为 password 参数值 //
    let profile_content = regex::Regex::new(r"<keyMaterial>.*?</keyMaterial>").expect("Failed to create regex")
        .replace(&profile_content, vec!["<keyMaterial>", &password, "</keyMaterial>"].join("").as_str())
        .to_string();
        // .replace(&profile_content, format!("{}", "<keyMaterial>hello</keyMaterial>").as_str())
        // .replace(" </keyMaterial>", "</keyMaterial>");
    // .to_string()

    // println!("profile_content: {}", profile_content);

    // println!(format!("{}{}{}", "<keyMaterial>", password, "</keyMaterial>").as_str());

    std::fs::write(&path_wlan_profile, profile_content).expect("Failed to write file");

    Ok(())
}