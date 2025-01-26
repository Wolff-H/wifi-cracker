export default async function initialize()
{
    console.log('initializing')

    // ...

    await invoke('get_computer_info').then((response) => {
        console.log('computer_info :', response)

        store_Device.computer_info = response
    })

    await invoke('get_device_info').then((response) => {
        console.log('device_info :', response)

        store_Device.device_info = response

        // 默认选择第一个设备为扫描执行设备 //
        store_Scan.selected_device = store_Device.wlan_cards[0].Name
    })

    // await invoke('scan_wifi').then((response) => {
    //     console.log('scan_wifi :', response)

    //     // store_Device.device_info = response
    // })

    console.log('initialized')
}