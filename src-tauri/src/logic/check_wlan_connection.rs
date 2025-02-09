// use tauri::ipc::InvokeError;
// use tokio::time::{interval, Duration};
// use crate::utils::run_command::run_command;

// #[tauri::command(rename_all = "snake_case")]
// // #[logcall::logcall]
// pub async fn check_wlan_connection(wlan_card: String, ssid: String) -> Result<bool, InvokeError>
// {
//     // let output = run_command("netsh wlan show interfaces")
//     //     .map_err(|e| InvokeError::from(e.to_string()))?;

//     // println!("{}", &output);

//     // // 跳过输出内容的第一行和任何空行，将输出解析为键值对列表 //
//     // let mut lines = output.lines().skip(1).filter(|line| !line.is_empty());
//     // let mut plist = Vec::new();
//     // while let Some(key) = lines.next() {
//     //     let value = lines.next().unwrap_or_default();
//     //     plist.push((key, value));
//     // }

//     // // 查找属性 Name 值为 wlan_card 的行，其后方最近的属性 State 和属性 Profile 的键值对 //
//     // let mut state: Option<&str> = None;
//     // let mut profile: Option<&str> = None;
//     // for (key, value) in &plist {
//     //     if key.contains("Name") && value.contains(&wlan_card) {
//     //         state = plist.iter().find(|(k, _)| k.contains("State")).map(|(_, v)| v.as_ref());
//     //         profile = plist.iter().find(|(k, _)| k.contains("Profile")).map(|(_, v)| v.as_ref());
//     //         break;
//     //     }
//     // }

//     // println!("{:?}, {:?}--------------", &state, &profile);

//     // // 如果找到的 State 的值为 connected 且 Profile 的值为 ssid，则返回 true，否则返回 false //
//     // Ok(state == Some("connected") && profile == Some(&ssid))

//     // TODO 以下是一个临时方案，需要重写。 //
//     // Ok((output.contains(&format!(": {}", wlan_card)) && output.contains(": connected")) && output.contains(&format!(": {}", ssid)))

//     let mut interval = interval(Duration::from_millis(200));
//     let connection_status: bool;

//     loop {
//         let output = run_command("netsh wlan show interfaces")
//             .map_err(|e| InvokeError::from(e.to_string()))?;
    
//         // 打印 output 中含有 State 字段的行 //
//         // for line in output.lines() {
//         //     if line.contains("State") {
//         //         println!("{}", line);
//         //     }
//         // }

//         if output.contains(&format!(": {}", wlan_card)) {
//             if output.contains(": connected") && output.contains(&format!(": {}", ssid)) {
//                 connection_status = true;
//                 break;
//             }
//             else if output.contains(": disconnected") {
//                 connection_status = false;
//                 break;
//             }
//         }

//         interval.tick().await;
//     }

//     Ok(connection_status)
// }


use tauri::ipc::InvokeError;
use crate::utils::run_command::run_command;

#[tauri::command(rename_all = "snake_case")]
// #[logcall::logcall]
pub async fn check_wlan_connection(wlan_card: String, ssid: String) -> Result<bool, InvokeError>
{
    let output = run_command("netsh wlan show interfaces")
        .map_err(|e| InvokeError::from(e.to_string()))?;

    // 打印 output 中含有 State 字段的行 //
    for line in output.lines() {
        if line.contains("State") {
            println!("{}", line);
        }
    }
    
    // TODO 以下是一个临时方案，需要重写。 //
    Ok((output.contains(&format!(": {}", wlan_card)) && output.contains(": connected")) && output.contains(&format!(": {}", ssid)))
}