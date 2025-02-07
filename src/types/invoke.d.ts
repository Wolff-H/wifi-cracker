declare namespace Commands
{
    interface Registration implements Record<string, [args: import("@tauri-apps/api/core.d.ts").InvokeArgs, return_type: any]>
    {
        get_computer_info: [never, string]
        get_device_info: [never, WC.TimestampedResponse<string>]
        scan_wifi: [{ wlan_card: string }, WC.TimestampedResponse<string>]
        read_passwordbook: [never, string]
        create_wlan_profile: [{ name: string, content: string }, string]
        add_wlan_profile_registration: [{ profile_path: string }, void]
        remove_wlan_profile_registration: [{ profile_name: string }, void]
        connect_wlan: [{ profile_name: string, wlan_card: string }, void]
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
    export function invoke<K extends keyof Commands.Registration>(
        cmd: K,
        args?: Commands.Registration[K][0],
        options?: import("@tauri-apps/api/core.d.ts").InvokeOptions,
    ): Promise<Commands.Registration[K][1]>
}