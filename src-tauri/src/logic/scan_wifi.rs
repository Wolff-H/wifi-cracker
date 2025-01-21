// // use std::cmp::Reverse;
// // use std::collections::HashMap;

// // #[cfg(target_os = "windows")]
// // use windows::Win32::NetworkManagement::WiFi::{
// //     WlanOpenHandle,
// //     WlanEnumInterfaces,
// //     WlanScan,
// //     WlanGetNetworkBssList,
// //     WlanFreeMemory,
// //     DOT11_SSID,
// //     DOT11_BSS_LIST,
// //     DOT11_BSS_ENTRY,
// //     WLAN_INTERFACE_INFO_LIST,
// //     WLAN_INTERFACE_INFO,
// // };

// // // use windows::Win32::NetworkManagement

// // pub fn scan_wifi() -> Option<Vec<HashMap<String, String>>> {
// //     if sysinfo::System::name().unwrap_or_else(|| String::from("-")) == String::from("Windows") {
// //         scan_wifi_windows()
// //     } else {
// //         None
// //     }
// // }

// // #[cfg(target_os = "windows")]
// // fn scan_wifi_windows() -> Option<Vec<HashMap<std::string::String, std::string::String>>> {
// //     unsafe {
// //         let mut client_handle: usize = 0;
// //         let mut negotiation_version: u32 = 0;

// //         // 打开WLAN客户端句柄
// //         if WlanOpenHandle(2, std::ptr::null_mut(), &mut negotiation_version, &mut client_handle) != 0 {
// //             return None;
// //         }

// //         // 获取WLAN接口列表
// //         let mut iface_list_ptr: *mut WLAN_INTERFACE_INFO_LIST = std::ptr::null_mut();
// //         if WlanEnumInterfaces(client_handle, std::ptr::null_mut(), &mut iface_list_ptr) != 0 {
// //             WlanFreeMemory(iface_list_ptr as *mut _);
// //             return None;
// //         }

// //         let iface_list = &*iface_list_ptr;
// //         let mut results = Vec::new();

// //         for i in 0..iface_list.dwNumberOfItems {
// //             let iface_info = &iface_list.InterfaceInfo[i];

// //             // 扫描无线网络
// //             if WlanScan(client_handle, &iface_info.InterfaceGuid, std::ptr::null_mut(), std::ptr::null_mut(), std::ptr::null_mut()) != 0 {
// //                 continue;
// //             }

// //             // 获取扫描结果
// //             let mut bss_list_ptr: *mut DOT11_BSS_LIST = std::ptr::null_mut();
// //             if WlanGetNetworkBssList(client_handle, &iface_info.InterfaceGuid, std::ptr::null_mut(), DOT11_BSS_TYPE_ANY, false, &mut bss_list_ptr) != 0 {
// //                 WlanFreeMemory(bss_list_ptr as *mut _);
// //                 continue;
// //             }

// //             let bss_list = &*bss_list_ptr;

// //             for j in 0..bss_list.uTotalSize {
// //                 let bss_entry = &bss_list.wlanBssEntries[j as usize];
// //                 let ssid = std::ffi::CStr::from_ptr(bss_entry.dot11Ssid.ucSSID.as_ptr()).to_string_lossy().into_owned();
// //                 let signal_strength = bss_entry.lRssi;

// //                 let mut entry = HashMap::new();
// //                 entry.insert("ssid".to_string(), ssid);
// //                 entry.insert("signal_strength".to_string(), signal_strength.to_string());

// //                 results.push(entry);
// //             }

// //             WlanFreeMemory(bss_list_ptr as *mut _);
// //         }

// //         WlanFreeMemory(iface_list_ptr as *mut _);

// //         // 按信号强度排序
// //         results.sort_by_key(|entry| Reverse(entry["signal_strength"].parse::<i32>().unwrap()));

// //         Some(results)
// //     }
// // }

// // #[cfg(not(target_os = "windows"))]
// // fn scan_wifi() -> Option<Vec<HashMap<String, String>>> {
// //     None
// // }



// use std::collections::HashMap;
// use std::process::Command;
// use std::io::{BufRead, BufReader};
// use std::cmp::Reverse;
// use tauri::ipc::InvokeError;


// #[tauri::command]
// pub fn scan_wifi() -> Result<Vec<HashMap<String, String>>, InvokeError> {
//     if sysinfo::System::name().unwrap_or_else(|| String::from("-")) == String::from("Windows") {
//         scan_wifi_windows()
//     } else {
//         Ok(Vec::new())
//     }
// }

// pub fn scan_wifi_windows() -> Result<Vec<HashMap<String, String>>, InvokeError> {
//     let output = Command::new("netsh")
//         .arg("wlan")
//         .arg("show")
//         .arg("networks")
//         .arg("mode=Bssid")
//         .output()
//         .map_err(|e| InvokeError::from(e.to_string()))?;

//     let reader = BufReader::new(output.stdout.as_slice());
//     let mut results = Vec::new();
//     let mut current_network = HashMap::new();

//     for line in reader.lines() {
//         let line = line.map_err(|e| InvokeError::from(e.to_string()))?;
//         if line.starts_with("SSID") {
//             if !current_network.is_empty() {
//                 results.push(current_network.clone());
//                 current_network.clear();
//             }
//             let ssid = line.split(": ").nth(1).unwrap_or("").to_string();
//             current_network.insert("SSID".to_string(), ssid);
//         } else if line.contains("BSSID") {
//             let bssid = line.split(": ").nth(1).unwrap_or("").to_string();
//             current_network.insert("BSSID".to_string(), bssid);
//         } else if line.contains("Signal") {
//             let signal_strength = line.split(": ").nth(1).unwrap_or("").replace("%", "").to_string();
//             current_network.insert("signal_strength".to_string(), signal_strength);
//         }
//     }

//     if !current_network.is_empty() {
//         results.push(current_network);
//     }

//     results.sort_by_key(|entry| Reverse(entry["signal_strength"].parse::<i32>().unwrap_or(0)));

//     Ok(results)
// }

use std::collections::HashMap;
use std::io::{BufRead, BufReader};
use std::cmp::Reverse;
use std::process::Command;
use windows::Win32::NetworkManagement::WiFi::{
    WlanOpenHandle,
    WlanEnumInterfaces,
    WlanScan,
    WlanGetNetworkBssList,
    WlanFreeMemory,
    WLAN_INTERFACE_INFO_LIST,
    WLAN_BSS_LIST,
    WLAN_INTERFACE_INFO,
    WLAN_BSS_ENTRY,
    dot11_BSS_type_any,
};
use windows::Win32::Foundation::{HANDLE, CloseHandle, ERROR_SUCCESS};
use windows::core::PWSTR;
// use windows::Win32::System::Threading::CloseHandle;

// #[tauri::command]
pub fn scan_wifi_windows() {
    unsafe {
        let mut client_handle: HANDLE = HANDLE::default();
        let mut iface_list: *mut WLAN_INTERFACE_INFO_LIST = std::ptr::null_mut();

        // // 打开WLAN客户端句柄
        // let result = WlanOpenHandle(2, PWSTR_NULL, &mut client_handle);
        // if result != ERROR_SUCCESS {
        //     eprintln!("Failed to open WLAN handle: {:?}", result);
        //     return;
        // }

        // 枚举WLAN接口
        let result = WlanEnumInterfaces(client_handle, None, &mut iface_list);
        // if result != ERROR_SUCCESS.0 {
        //     eprintln!("Failed to enumerate WLAN interfaces: {:?}", result);
        //     CloseHandle(client_handle);
        //     return;
        // }

        println!("{}", result);

        // 获取第一个接口的信息
        let iface_info = (*iface_list).InterfaceInfo.as_ptr();
        let iface = &*iface_info;

        // println!("{}", iface_info);
        println!("=1");

        // 扫描无线网络
        let result = WlanScan(client_handle, &iface.InterfaceGuid, None, None, None);
        // if result != ERROR_SUCCESS {
        //     eprintln!("Failed to scan for wireless networks: {:?}", result);
        //     WlanFreeMemory(iface_list as *mut _);
        //     CloseHandle(client_handle);
        //     return;
        // }

        println!("=2");

        // 等待扫描完成（这里简单地等待一段时间，实际应用中可能需要更复杂的同步机制）
        std::thread::sleep(std::time::Duration::from_secs(5));

        println!("=3");

        // 获取扫描结果
        let mut bss_list: *mut WLAN_BSS_LIST = std::ptr::null_mut();
        let result = WlanGetNetworkBssList(
            client_handle,
            &iface.InterfaceGuid,
            None,
            dot11_BSS_type_any,
            false,
            None,
            &mut bss_list,
        );
        // if result != ERROR_SUCCESS {
        //     eprintln!("Failed to get BSS list: {:?}", result);
        //     WlanFreeMemory(iface_list as *mut _);
        //     CloseHandle(client_handle);
        //     return;
        // }

        println!("=4");

        // 打印扫描到的无线网络信息
        let bss_entries = (*bss_list).wlanBssEntries.as_ptr();
        println!("=4.1");
        let num_entries = (*bss_list).dwNumberOfItems;// as usize;
        // let num_entries = 10 as usize;
        println!("=4.2");
        let mut networks: Vec<(i32, String)> = Vec::new();
        println!("=4.3");

        println!("=5");

        for i in 0..num_entries {
            let bss_entry = &*bss_entries.add(i as usize);
            // let ssid = std::ffi::CStr::from_ptr(bss_entry.dot11Ssid.ucSSID).to_string_lossy().into_owned();
            // let ssid = String::from("test");
            let ssid = std::ffi::CStr::from_ptr(std::mem::transmute(bss_entry.dot11Ssid.ucSSID.as_ptr()))
                .to_string_lossy()
                .into_owned();
            let rssi = bss_entry.lRssi;
            networks.push((rssi, ssid));
        }

        println!("=6");

        // 按信号强度排序并打印
        networks.sort_by_key(|&(rssi, _)| Reverse(rssi));
        for (rssi, ssid) in networks {
            println!("SSID: {}, Signal Strength: {} dBm", ssid, rssi);
        }

        println!("=7");

        // 释放内存并关闭句柄
        WlanFreeMemory(bss_list as *mut _);
        WlanFreeMemory(iface_list as *mut _);
        let _ = CloseHandle(client_handle);
    }
}
