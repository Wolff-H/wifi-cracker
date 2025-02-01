import { parseScanOutput } from "@/logic/scan"
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
        scanned_info(state)
        {
            return parseScanOutput(state.wifi_scan_result.data)
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