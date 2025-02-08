use std::process::Command;
use crate::utils::get_data_directory::get_data_directory;



pub fn initialize() {
    println!("initialize");

    // 为当前 tauri 进程设置命令行输出格式，保证一致的输出格式 //
    let mut command = Command::new("powershell");
    command
        .arg("-Command")
        .arg("$OutputEncoding = [console]::OutputEncoding = [System.Text.Encoding]::UTF8; Set-Culture en-US");

    let output = command.output().expect("Failed to set command line output format");

    println!("Normalized command settings: {:?}", output);

    // 打印当前程序位置 //
    let current_dir = std::env::current_dir().expect("Failed to get current directory");
    println!("Current directory: {:?}", current_dir);

    // 打印和初始化数据目录 //
    println!("data directory: {}", get_data_directory().to_str().unwrap());
}