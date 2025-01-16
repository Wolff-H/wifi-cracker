/**
 * @description
 * 【如果使用 deno 执行 ts 文件，用这个脚本转发执行】
 * 这是一个封装的简便脚本，专门用于照下述参数执行 typescript 文件。
 */
import { execSync } from "node:child_process"



if (process.argv.length < 3)
{
    console.error("必须提供一个 TypeScript 文件路径。")
    process.exit(1)
}

execSync(`deno --allow-all --unstable-sloppy-imports ${process.argv[2]}`, {
    stdio: 'inherit',
})
