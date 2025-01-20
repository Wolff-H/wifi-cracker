use std::process::Command;
use std::io::{self, BufRead, BufReader};
use std::env;
use tauri::ipc::InvokeError;
use chrono;
use serde::Serialize;

#[derive(Serialize)]
pub struct DeviceInfo {
    time: String,
    content: String,
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
        time: chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string(),
        content: content?,
    };

    Ok(device_info)
}

fn get_wireless_info_linux() -> io::Result<String> {
    let output = Command::new("iwconfig").output()?;
    let reader = BufReader::new(output.stdout.as_slice());
    let mut result = String::new();
    for line in reader.lines() {
        let line = line?;
        result.push_str(&line);
        result.push('\n');
    }
    Ok(result)
}

fn get_wireless_info_windows() -> io::Result<String> {
    let output = Command::new("netsh").arg("wlan").arg("show").arg("interfaces").output()?;
    let reader = BufReader::new(output.stdout.as_slice());
    let mut result = String::new();
    for line in reader.lines() {
        let line = line?;
        result.push_str(&line);
        result.push('\n');
    }
    Ok(result)
}

fn get_wireless_info_macos() -> io::Result<String> {
    let output = Command::new("airport").arg("-I").output()?;
    let reader = BufReader::new(output.stdout.as_slice());
    let mut result = String::new();
    for line in reader.lines() {
        let line = line?;
        result.push_str(&line);
        result.push('\n');
    }
    Ok(result)
}