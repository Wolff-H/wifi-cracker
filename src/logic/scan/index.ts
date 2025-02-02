export default async function scanWifi(wlan_card: string)
{
    console.log(`invoke('scan_wifi'`);
    
    await invoke('scan_wifi', {
        wlan_card: wlan_card,
    }).then((response) => {
        store_Scan.wifi_scan_result = response
    })
}

export function parseScanOutput(scan_output: string) {
    const lines = scan_output.split('\n').slice(4)

    const dict_line_group: Record<string, string[]> = {}
    let current_checking_group: string = ''

    for (const line of lines)
    {
        if (line.startsWith('SSID '))
        {
            const { value } = parseLine(line)
            
            dict_line_group[value] = []
            current_checking_group = value
        }
        else if (line !== '')
        {
            dict_line_group[current_checking_group].push(line)
        }
    }

    const composed: any = {}

    for (const ssid in dict_line_group)
    {
        const group_lines = dict_line_group[ssid]

        const layer_ss: Record<string, any> =
        {
            _SSID: ssid,
            BSSs: {} as any,
        }

        let current_checking_bss: string = ''
        
        for (const line of group_lines)
        {
            const { key, value } = parseLine(line)
            
            if (key.startsWith('BSSID '))
            {
                if (!layer_ss.BSSs[value]) layer_ss.BSSs[value] = { _BSSID: value }
                current_checking_bss = value
            }
            else if (current_checking_bss)
            {
                if (key === 'Bss Load')
                {
                    layer_ss.BSSs[current_checking_bss]['Bss Load'] = {}
                }
                else if (['Connected Stations', 'Channel Utilization', 'Medium Available Capacity'].includes(key))
                {
                    layer_ss.BSSs[current_checking_bss]['Bss Load'][key] = value
                }
                else
                {
                    // 特殊逻辑 //
                    if (key === 'Signal')
                        layer_ss.BSSs[current_checking_bss][key] = parseInt(value)
                    else if (key === 'Channel')
                        layer_ss.BSSs[current_checking_bss][key] = parseInt(value)
                    else
                        layer_ss.BSSs[current_checking_bss][key] = value
                }
            }
            else
            {
                layer_ss[key] = value
            }
        }

        composed[ssid] = layer_ss
    }

    return composed as Record<string, WC.WlanSSInfo>
}

function parseLine(line: string)
{
    const indent = getLineIndent(line)
    const match = line.match(/^([^:]+):(.*)$/)
    const [_, key_part = '', value_part = ''] = match || []

    return {
        indent,
        key: key_part.trim(),
        value: value_part.trim(),
    }
}

function getLineIndent(str: string)
{
    const match = str.match(/^ */)
    return match ? match[0].length : 0
}

export function toNormalizedScanOutput(parsed_output: Record<string, WC.WlanSSInfo>)
{
    const dict = parsed_output

    const list = Object.values(dict).map((SS) => {
        const list_BSS = Object.values(SS.BSSs)
        let best_signal_bss = list_BSS[0]

        list_BSS.forEach((bss) => {
            if (bss.Signal > best_signal_bss.Signal) best_signal_bss = bss
        })

        return { ...SS, BSS: best_signal_bss }
    })

    return list.length <= 1 ? list : list.toSorted((a, b) => {
        return b.BSS.Signal - a.BSS.Signal
    })
}