import { defineStore } from "pinia"



const useStore = defineStore('/Tasks', {
    state: (): _S => ({
        running: {},
        completed: [],
        wlan_card_nav_at: '',
    }),
})

type _S =
{
    running: Record<string, WC.CrackTask[]>
    completed: any[]
    wlan_card_nav_at: string
}



export default useStore