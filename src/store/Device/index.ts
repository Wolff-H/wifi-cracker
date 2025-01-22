import { defineStore } from "pinia"



const useStore = defineStore('/Device', {
    state: (): _S => ({
        comptuer_info: '',
        // {
        //     os_name: '',
        //     os_version: '',
        //     cpu_brand: '',
        //     cpu_frequency: 0,
        //     cpu_cores: 0,
        //     memory_total: 0,
        //     memory_number: 0,
        //     memory_frequency: 0,
        // },
        device_info:
        {
            time: '',
            content: '',
        },
    }),
    getters:
    {
        wlan_interfaces(state)
        {
            const raw = state.device_info.content

            const lines = raw.split('\n')
            console.log('lines :', lines);

            // const 
            
            return lines


            
        },
    },
})

type _S =
{
    comptuer_info: string,
    device_info: WC.DeviceInfo
}



export default useStore