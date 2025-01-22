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
        wlan_interfaces(state): WC.WlanCardInfo[]
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

                // return [dict.Name, dict]

                return dict as WC.WlanCardInfo
            })

            return cards

            // const dict_card_info = Object.fromEntries(
            //     wlan_card_info_fragments.map((fragment) => {
            //         const lines = fragment.split('\n').filter((line) => line.trim() !== '')
            //         const pairs = lines.map((line) => {
            //             const [key, value] = line.split(':')
            //             return [key.trim(), value.trim()]
            //         })

            //         const dict = Object.fromEntries(pairs)

            //         return [dict.Name, dict]
            //     })
            // )

            // return dict_card_info
        },
        dict_wlan_interfaces(): Record<string, WC.WlanCardInfo>
        {
            return Object.fromEntries(this.wlan_interfaces.map((card) => [card.Name, card]))
        },
    },
})

type _S =
{
    comptuer_info: string,
    device_info: WC.DeviceInfo
}



export default useStore