declare namespace Commands
{
    interface Response
    {
        get_computer_info: string
        get_device_info: WC.TimestampedResponse<string>
        scan_wifi: WC.TimestampedResponse<string>
        read_passwordbook: string
    }
}

declare module "@tauri-apps/api/core"
{
    /**
     * 所有命令必须要注册 Commands.Response 中的类型以期在 invoke 中获得类型提示。
     * @param cmd 命令名称。
     * @param args 参数。
     * @param options 选项。
     */
    export function invoke<K extends keyof Commands.Response>(
        cmd: K,
        args?: import("@tauri-apps/api/tauri").InvokeArgs,
        options?: import("@tauri-apps/api/tauri").InvokeOptions,
    ): Promise<Commands.Response[K]>
}