use std::env;
use tauri::ipc::InvokeError;
use crate::utils::{run_command::run_command, to_timestamped_data, TimestampedData};



#[tauri::command(rename_all = "snake_case")]
pub fn scan_wifi(wlan_card: String) -> Result<TimestampedData<String>, InvokeError>{
    let os = env::consts::OS;

    let content = match os {
        "linux" => scan_wifi_linux(wlan_card).map_err(|e| InvokeError::from(e.to_string())),
        "windows" => scan_wifi_windows(wlan_card).map_err(|e| InvokeError::from(e.to_string())),
        "macos" => scan_wifi_macos(wlan_card).map_err(|e| InvokeError::from(e.to_string())),
        _ => Ok(to_timestamped_data("Unsupported OS".to_string(), None)),
    };

    content
}

fn scan_wifi_linux(wlan_card: String) -> std::io::Result<TimestampedData<String>> {
    let output = run_command("iw wlan0 scan")?;
    println!("wlan_card: {}", wlan_card);

    Ok(to_timestamped_data(output, None))
}

fn scan_wifi_windows(wlan_card: String) -> std::io::Result<TimestampedData<String>> {
    let output = run_command(&format!("netsh wlan show networks mode=bssid interface=\"{}\"", wlan_card))?;

    Ok(to_timestamped_data(output, None))
}

fn scan_wifi_macos(wlan_card: String) -> std::io::Result<TimestampedData<String>> {
    let output = run_command("airport -S")?;
    println!("wlan_card: {}", wlan_card);

    Ok(to_timestamped_data(output, None))
}
