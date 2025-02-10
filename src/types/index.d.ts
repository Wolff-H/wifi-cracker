declare namespace WC
{
    type CrackStrategy = keyof typeof import("@/constants").dict_password_strategy

    interface TimestampedResponse<T>
    {
        timestamp: number
        data: T
    }

    interface WlanCardInfo
    {
        'Name': string
        'Description': string
        'GUID': string
        'Physical address': string
        'Interface type': string
        'State': 'connected' | 'disconnected'
        'SSID'?: string
        'AP BSSID'?: string
        'Band'?: string
        'Channel'?: number
        'Network type'?: string
        'Radio type'?: string
        'Authentication'?: string
        'Cipher'?: string
        'Connection mode'?: string
        'Receive rate (Mbps)'?: number
        'Transmit rate (Mbps)'?: number
        'Signal'?: string
        'Profile'?: string
        'QoS MSCS Configured'?: number
        'QoS Map Configured'?: number
        'QoS Map Allowed by Policy'?: number
        'Hosted network status'?: string
    }

    interface WlanSSInfo
    {
        '_SSID': string
        'Network type': string
        'Authentication': string
        'Encryption': string
        'BSSs':
        {
            [BSS: string]:
            {
                '_BSSID': string
                'Signal': number
                'Radio type': string
                'Band': string
                'Channel': number
                'Bss Load'?:
                {
                    'Connected Stations': string
                    'Channel Utilization': string
                    'Medium Available Capacity': string
                }
                'QoS MSCS Supported': string
                'QoS Map Supported': string
                'Basic rates (Mbps)': string
                'Other rates (Mbps)': string
            }
        }
    }

    interface WlanSSInfoNormalized
    {
        '_SSID': string
        'Network type': string
        'Authentication': string
        'Encryption': string
        'BSSs':
        {
            [BSS: string]:
            {
                '_BSSID': string
                'Signal': number
                'Radio type': string
                'Band': string
                'Channel': number
                'Bss Load'?:
                {
                    'Connected Stations': string
                    'Channel Utilization': string
                    'Medium Available Capacity': string
                }
                'QoS MSCS Supported': string
                'QoS Map Supported': string
                'Basic rates (Mbps)': string
                'Other rates (Mbps)': string
            }
        }
        'BSS':
        {
            '_BSSID': string
            'Signal': number
            'Radio type': string
            'Band': string
            'Channel': number
            'Bss Load'?:
            {
                'Connected Stations': string
                'Channel Utilization': string
                'Medium Available Capacity': string
            }
            'QoS MSCS Supported': string
            'QoS Map Supported': string
            'Basic rates (Mbps)': string
            'Other rates (Mbps)': string
        }
    }

    interface CrackTask
    {
        id: string
        ssid: string
        status: 'pending' | 'running' | 'completed'
        wlan_info: string
        // /** 总迭代数 */
        // iterations_total: number
        /** 策略的迭代进度。 */
        // iteration_groups:
        // {
        //     total: number
        //     // progress: Partial<Record<WC.CrackStrategy, [cursor: number, total: number]>>
        //     /** cursor 是最新已执行掉的迭代。如果 cursor 等同于 total，则说明该策略已迭代完。 */
        //     progress: [strategy: string, cursor: number, total: number][]
        // }
        log:
        {
            failures: [timestamp: number, message: string][]
        }
        progress:
        {
            /** 总迭代数。 */
            total: number
            /** 已迭代完毕的阶段（策略）数。 */
            stage: number
            /** 迭代组详情。对于一个组，cursor 是最新已执行完毕的迭代。如果 cursor 等同于 total，则说明该组策略已迭代完。 */
            iteration_groups: [strategy: CrackStrategy, cursor: number, total: number][]
        }
        setup:
        {
            ctime: number
            device: string
            strategies: CrackStrategy[]
            custom_strategies: string[]
            connection_interval: number
            random_mac: boolean
            max_retries: number
        }
        result:
        {
            ctime: number
            password: string
        }
    }

    // interface WlanCrackTasksState
    // {
    //     running: null | CrackTask
    //     queue: CrackTask[]
    // }

    interface AppStatePersistence
    {
        ctime: number
        state:
        {
            tasks: typeof import("@/store/Tasks/index").$state
        }
    }

}