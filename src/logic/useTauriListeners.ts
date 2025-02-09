import { listen as listenTauri } from "@tauri-apps/api/event"
import exit from "./exit"

export default function useTauriListeners()
{
    listenTauri('tauri://close-requested', (event) => {
        console.log(event)
    })
    
    listenTauri('window-close', (event) => {
        console.log(event)

        exit()
    })
}
