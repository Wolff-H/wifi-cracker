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

    print!("{}", output);

    Ok(output)
}

fn scan_wifi_macos() -> io::Result<String> {
    let output = run_command("airport -S")?;

    Ok(output)
}

/**
 * 执行命令行指令，返回纯文本的执行结果（自动依系统语言）
 */
fn run_command_autolang(command_line: &str) -> Result<String, std::io::Error> {
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

/**
 * 执行命令行指令，返回纯文本的执行结果（强制使用英文）
 */
fn run_command(command_line: &str) -> Result<String, std::io::Error> {
    let mut command = Command::new("powershell");
    command
        .arg("-Command")
        .arg(format!("$OutputEncoding = [console]::OutputEncoding = [System.Text.Encoding]::UTF8; Set-Culture en-US; {}", command_line));

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