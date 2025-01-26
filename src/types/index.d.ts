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

}