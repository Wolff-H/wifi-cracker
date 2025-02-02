import { defineStore } from "pinia"



const useStore = defineStore('/Tasks', {
    state: (): _S => ({
        running: [],
        completed: [],
    }),
})

type _S =
{
    running: any[]
    completed: any[]
}



export default useStore