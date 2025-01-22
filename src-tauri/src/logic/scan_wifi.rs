use std::env;
use tauri::ipc::InvokeError;
use crate::utils::run_command::run_command;



#[tauri::command]
pub fn scan_wifi() -> Result<String, InvokeError> {
    let os = env::consts::OS;

    let content = match os {
        "linux" => scan_wifi_linux().map_err(|e| InvokeError::from(e.to_string())),
        "windows" => scan_wifi_windows().map_err(|e| InvokeError::from(e.to_string())),
        "macos" => scan_wifi_macos().map_err(|e| InvokeError::from(e.to_string())),
        _ => Ok("Unsupported OS".to_string()),
    };

    content
}

fn scan_wifi_linux() -> std::io::Result<String> {
    let output = run_command("iw wlan0 scan")?;

    Ok(output)
}

fn scan_wifi_windows() -> std::io::Result<String> {
    let output = run_command("netsh wlan show networks mode=bssid")?;

    Ok(output)
}

fn scan_wifi_macos() -> std::io::Result<String> {
    let output = run_command("airport -S")?;

    Ok(output)
}
