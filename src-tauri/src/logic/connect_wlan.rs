use tauri::ipc::InvokeError;
use crate::utils::run_command::run_command;



#[tauri::command(rename_all = "snake_case")]
pub fn connect_wlan(wlan_card: String, profile_name: String) -> Result<(), InvokeError>
{
    let output = run_command(&format!("netsh wlan connect name=\"{}\" interface=\"{}\"", profile_name, wlan_card))
        .map_err(|e| InvokeError::from(e.to_string()))?;

    // 如果输出包含字串“successfully”，返回空，否则返回 InvokeError //
    if output.contains("successfully") {
        Ok(()) // 预期输出：Connection request was completed successfully.
    }
    else {
        Err(InvokeError::from(output)) 
    }
}