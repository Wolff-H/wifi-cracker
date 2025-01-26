// export function parseScanOutput(output: string) {
    
// }

export default async function scanWifi(wlan_card: string)
{
    await invoke('scan_wifi', {
        wlan_card: wlan_card,
    }).then((response) => {
        console.log(response)

        store_Scan.wifi_scan_result = response
    })
}