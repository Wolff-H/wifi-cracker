use std::env;
use tauri::ipc::InvokeError;
use chrono;
use serde::Serialize;

use crate::utils::run_command::run_command;

#[derive(Serialize)]
pub struct DeviceInfo {
    timestamp: i64,
    data: String,
}

#[tauri::command]
pub fn get_device_info() -> Result<DeviceInfo, InvokeError> {
    let os = env::consts::OS;

    let content = match os {
        "linux" => get_wireless_info_linux().map_err(|e| InvokeError::from(e.to_string())),
        "windows" => get_wireless_info_windows().map_err(|e| InvokeError::from(e.to_string())),
        "macos" => get_wireless_info_macos().map_err(|e| InvokeError::from(e.to_string())),
        _ => Ok("Unsupported OS".to_string()),
    };

    let device_info = DeviceInfo {
        timestamp: chrono::Local::now().with_timezone(&chrono::Utc).timestamp(), //.format("%Y-%m-%d %H:%M:%S").to_string(),
        data: content?,
    };

    Ok(device_info)
}

fn get_wireless_info_linux() -> std::io::Result<String> {
    let output = run_command("iwconfig")?;

    Ok(output)
}

fn get_wireless_info_windows() -> std::io::Result<String> {
    let output = run_command("netsh wlan show interfaces")?;

    Ok(output)
}

fn get_wireless_info_macos() -> std::io::Result<String> {
    let output = run_command("airport -I")?;

    Ok(output)
}