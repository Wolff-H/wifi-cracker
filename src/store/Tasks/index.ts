import { defineStore } from "pinia"



const useStore = defineStore('/Tasks', {
    state: (): _S => ({
        uncompleted: {},
        completed: [],
        wlan_card_nav_at: '',
    }),
})

type _S =
{
    uncompleted: Record<string, WC.CrackTask[]>
    completed: any[]
    wlan_card_nav_at: string
}



export default useStore