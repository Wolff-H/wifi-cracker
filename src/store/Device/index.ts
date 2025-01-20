import { defineStore } from "pinia"



const useStore = defineStore('/Device', {
    state: (): _S => ({
        device_info:
        {
            time: '',
            content: '',
        },
    }),
})

type _S =
{
    device_info: WC.DeviceInfo
}



export default useStore