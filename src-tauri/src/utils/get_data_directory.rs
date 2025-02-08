pub fn get_data_directory() -> std::path::PathBuf {
    let current_dir = std::env::current_dir().expect("Failed to get current directory");

    // 区分路径是为了解决 tauri 目录内文件变动导致程序触发重新构建。 //
    let path = match cfg!(debug_assertions) {
        true => current_dir.join("../../wc-data"), // 如果当前在开发模式，向上回退两层目录（退到整个项目目录外）
        false => current_dir.join("wc-data"), // 如果当前不在开发模式，直接在当前目录下生成数据目录
    };

    if !path.exists() {
        std::fs::create_dir(&path).expect("Failed to create directory");
        
        // 如果数据目录不存在，检查并创建配置目录和密码本文件。 //
        let path_wlan_profiles = path.join("wlan-profiles");
        if !path_wlan_profiles.exists() {
            std::fs::create_dir(&path_wlan_profiles).expect("Failed to create directory");
        }
        let path_passwordbook = path.join("passwordbook.txt");
        if !path_passwordbook.exists() {
            std::fs::File::create(&path_passwordbook).expect("Failed to create file");
        }
    }

    path
}