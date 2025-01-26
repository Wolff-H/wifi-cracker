use sysinfo::System;



#[tauri::command]
pub fn get_computer_info() -> String {
    let mut sys = System::new_all();
    sys.refresh_all();

    let os_info = format!(
        "    {} [{}]",
        sysinfo::System::long_os_version().unwrap_or_else(|| String::from("-")),
        sysinfo::System::os_version().unwrap_or_else(|| String::from("-")),
    );

    let cpu_info = sys.cpus().iter().map(|processor| {
        format!(
            "    {} {} MHz ({} cores)",
            processor.brand(),
            processor.frequency(),
            sys.physical_core_count().unwrap_or(0),
        )
    }).collect::<Vec<String>>().join("\n");

    let memory_info = format!(
        "    {:.4} GB",
        sys.total_memory() as f64 / 1024u64.pow(3) as f64,
    );

    format!("操作系统:\n{os_info}\nCPU:\n{cpu_info}\n内存:\n{memory_info}")
}