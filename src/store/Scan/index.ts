import { defineStore } from "pinia"



const useStore = defineStore('/Scan', {
    state: (): _S => ({
        selected_device: '',
        execution_mode: '',
        wifi_scan_result:
        {
            timestamp: 0,
            data: {},
        },
    }),
})

type _S =
{
    selected_device: string,
    execution_mode: '' | 'monitor' | 'profile'
    wifi_scan_result: WC.Timestamped<any>
}



export default useStore