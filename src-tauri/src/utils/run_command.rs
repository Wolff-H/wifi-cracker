use std::process::Command;
use std::io::{BufRead, BufReader};
use shlex::Shlex;



/**
 * 执行命令行指令，返回纯文本的执行结果（自动依系统语言）
 */
pub fn run_command(command_line: &str) -> Result<String, std::io::Error> {
    // let mut command = Command::new("powershell");
    // command
    //     .arg("-Command")
    //     .arg(format!("$OutputEncoding = [console]::OutputEncoding = [System.Text.Encoding]::UTF8; Set-Culture en-US; {}", command_line));

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
