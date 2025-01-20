import { defineStore } from "pinia"



const useStore = defineStore('/Device', {
    state: (): _S => ({
        device_info: '',
    }),
})

type _S =
{
    device_info: string
}



export default useStore