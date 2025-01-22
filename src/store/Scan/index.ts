import { defineStore } from "pinia"



const useStore = defineStore('/Scan', {
    state: (): _S => ({
        selected_device: '',
        execution_mode: '',
    }),
})

type _S =
{
    selected_device: string,
    execution_mode: '' | 'monitor' | 'profile'
}



export default useStore