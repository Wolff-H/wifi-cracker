import { defineStore } from "pinia"



const useStore = defineStore('/Device', {
    state: (): _S => ({
        computer_info: '',
        device_info:
        {
            timestamp: 0,
            data: '',
        },
    }),
    getters:
    {
        wlan_cards(state): WC.WlanCardInfo[]
        {
            const raw = state.device_info.data
            const regex = /Name\s+:.+?(?=Name\s+:|$)/gs
            const matches = raw.matchAll(regex)
            const wlan_card_info_fragments: string[] = []
            
            for (const match of matches)
            {
                if (match[0])
                {
                    wlan_card_info_fragments.push(match[0]);
                }
            }

            const cards: WC.WlanCardInfo[] = []

            for (const fragment of wlan_card_info_fragments)
            {
                const lines = fragment.split('\n').filter((line) => line.trim() !== '')
                const pairs: [string, string][] = []
                
                for (const line of lines)
                {
                    const [key, value] = line.split(':')
                    pairs.push([key.trim(), value.trim()])
                    
                    if (line.includes(': disconnected')) break
                }
                
                const dict = Object.fromEntries(pairs) as unknown as WC.WlanCardInfo
                cards.push(dict)
            }

            return cards
        },
        dict_wlan_cards(): Record<string, WC.WlanCardInfo>
        {
            return Object.fromEntries(this.wlan_cards.map((card) => [card.Name, card]))
        },
    },
})

type _S =
{
    computer_info: string,
    device_info: WC.TimestampedResponse<string>
}



export default useStore