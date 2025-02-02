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

    // 打印当前程序位置 //
    let current_dir = std::env::current_dir().expect("Failed to get current directory");
    println!("Current directory: {:?}", current_dir);

    // 在程序当前位置生成数据目录 //
    let path = current_dir.join("wc-data");
    if !path.exists() {
        std::fs::create_dir(&path).expect("Failed to create directory");
    }
    let path_wlan_profiles = path.join("wlan-profiles");
    if !path_wlan_profiles.exists() {
        std::fs::create_dir(&path_wlan_profiles).expect("Failed to create directory");
    }
    let path_passwordbook = path.join("passwordbook.txt");
    if !path_passwordbook.exists() {
        std::fs::File::create(&path_passwordbook).expect("Failed to create file");
    }
}