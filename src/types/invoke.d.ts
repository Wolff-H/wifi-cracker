declare namespace Commands
{
    interface Registration implements Record<string, [args: import("@tauri-apps/api/core.d.ts").InvokeArgs, return_type: any]>
    {
        get_computer_info: [never, string]
        get_device_info: [never, WC.TimestampedResponse<string>]
        scan_wifi: [{ wlan_card: string }, WC.TimestampedResponse<string>]
        read_passwordbook: [never, string]
        create_wlan_profile: [{ wlan_card: string, name: string, content: string }, string]
        add_wlan_profile_registration: [{ wlan_card: string, profile_path: string }, void]
        remove_wlan_profile_registration: [{ wlan_card: string, profile_name: string }, void]
        delete_wlan_profile: [{ wlan_card: string, name: string }, string]
        rewrite_wlan_profile_password: [{ wlan_card: string, profile_name: string, password: string }, void]
        connect_wlan: [{ wlan_card: string, profile_name: string }, void]
        check_wlan_connection: [{ wlan_card: string, ssid: string }, boolean]
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