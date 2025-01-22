use std::process::Command;



pub fn initialize() {
    println!("initialize");

    // 为当前 tauri 进程设置命令行输出格式，保证一致的输出格式 //
    let mut command = Command::new("powershell");
    command
        .arg("-Command")
        .arg("$OutputEncoding = [console]::OutputEncoding = [System.Text.Encoding]::UTF8; Set-Culture en-US");

    let output = command.output().expect("Failed to set command line output format");

    println!("Normalized command settings: {:?}", output);
}