import { parseScanOutput, toNormalizedScanOutput } from "@/logic/scan"
import { defineStore } from "pinia"



const useStore = defineStore('/Scan', {
    state: (): _S => ({
        selected_device: '',
        execution_mode: '',
        wifi_scan_result:
        {
            timestamp: 0,
            data: '',
        },
    }),
    getters:
    {
        dict_scanned_wifis(state): Record<string, WC.WlanSSInfo>
        {
            return parseScanOutput(state.wifi_scan_result.data)
        },
        scanned_wifis_normalized(): WC.WlanSSInfoNormalized[]
        {
            return toNormalizedScanOutput(this.dict_scanned_wifis)
        },
        // dict_scanned_wifis_normalized(): Record<string, WC.WlanSSInfoNormalized>
        // {
        //     return Object.fromEntries(this.scanned_wifis_normalized.map(ss => [ss._SSID, ss]))
        // },
    },
})

type _S =
{
    selected_device: string,
    execution_mode: '' | 'monitor' | 'profile'
    wifi_scan_result: WC.TimestampedResponse<string>
}



export default useStore
