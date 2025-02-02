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
        scanned_wifis_normalized(): any
        {
            return toNormalizedScanOutput(this.dict_scanned_wifis)
        },
    },
})

type _S =
{
    selected_device: string,
    execution_mode: '' | 'monitor' | 'profile'
    wifi_scan_result: WC.TimestampedResponse<string>
}



export default useStore
