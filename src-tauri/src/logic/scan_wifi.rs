use std::process::Command;
use std::io::{self, BufRead, BufReader};
use std::env;
use shlex::Shlex;
use tauri::ipc::InvokeError;



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

fn scan_wifi_linux() -> io::Result<String> {
    let output = run_command("iw wlan0 scan")?;

    Ok(output)
}

fn scan_wifi_windows() -> io::Result<String> {
    let output = run_command("netsh wlan show networks mode=bssid")?;

    Ok(output)
}

fn scan_wifi_macos() -> io::Result<String> {
    let output = run_command("airport -S")?;

    Ok(output)
}

// fn call_command(command_str: &str) -> Result<Output, io::Error> {
//     let command_tokens = command_str.split_whitespace().collect::<Vec<&str>>();
//     let command_entry = command_tokens[0];
//     let command_args = &command_tokens[1..];

//     let output = Command::new(command_entry)
//        .args(command_args)
//        .output()?;

//     Ok(output)
// }

/**
 * 执行命令行指令，返回纯文本的执行结果
 */
fn run_command(command_line: &str) -> Result<String, std::io::Error> {
    let mut args = Shlex::new(command_line);
    let mut command = Command::new(args.next().unwrap());

    command.args(args);

    let output = command.output()?;
    let reader = BufReader::new(output.stdout.as_slice());
    let mut result = String::new();

    for line in reader.lines() {
        let line = line?;
        result.push_str(&line);
        result.push('\n');
    }

    Ok(result)
}