declare namespace WC
{
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
}