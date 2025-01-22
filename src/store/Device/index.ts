import { defineStore } from "pinia"



const useStore = defineStore('/Device', {
    state: (): _S => ({
        comptuer_info: '',
        device_info:
        {
            time: '',
            content: '',
        },
    }),
    getters:
    {
        wlan_cards(state): WC.WlanCardInfo[]
        {
            const raw = state.device_info.content
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

            const cards = wlan_card_info_fragments.map((fragment) => {
                const lines = fragment.split('\n').filter((line) => line.trim() !== '')
                const pairs = lines.map((line) => {
                    const [key, value] = line.split(':')
                    return [key.trim(), value.trim()]
                })

                const dict = Object.fromEntries(pairs)

                return dict as WC.WlanCardInfo
            })

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
    comptuer_info: string,
    device_info: WC.DeviceInfo
}



export default useStore