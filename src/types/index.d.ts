declare namespace WC
{
    // interface ComputerInfo
    // {
    //     os_name: string,
    //     os_version: string,
    //     cpu_brand: string,
    //     cpu_frequency: number,
    //     cpu_cores: number,
    //     memory_total: number,
    //     memory_number: number,
    //     memory_frequency: number,
    // }

    interface Timestamped<T>
    {
        timestamp: number
        data: T
    }

    interface DeviceInfo
    {
        time: string
        content: string
    }

    interface WlanCardInfo
    {
        'Name': string;
        'Description': string;
        'GUID': string;
        'Physical address': string;
        'Interface type': string;
        'State': string;
        'SSID': string;
        'AP BSSID': string;
        'Band': string;
        'Channel': number;
        'Network type': string;
        'Radio type': string;
        'Authentication': string;
        'Cipher': string;
        'Connection mode': string;
        'Receive rate (Mbps)': number;
        'Transmit rate (Mbps)': number;
        'Signal': string;
        'Profile': string;
        'QoS MSCS Configured': number;
        'QoS Map Configured': number;
        'QoS Map Allowed by Policy': number;
        'Hosted network status': string;
    }

}