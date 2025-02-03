import scanWifi from "./scan"

export default async function initialize()
{
    console.log('initializing')

    // ...

    // 获取计算机信息 //
    await invoke('get_computer_info').then((response) => {
        console.log('computer_info :', response)

        store_Device.computer_info = response
    })

    // 获取无线网卡设备信息 //
    await invoke('get_device_info').then((response) => {
        console.log('device_info :', response)

        store_Device.device_info = response

        // 默认选择第一个设备为扫描执行设备 //
        store_Scan.selected_device = store_Device.wlan_cards[0].Name
        // 设置任务状态库入口 //
        store_Device.wlan_cards.forEach((card) => {
            store_Tasks.running[card.Name] = []
        })
        store_Tasks.wlan_card_nav_at = store_Scan.selected_device
    })

    // 扫描 WiFi 网络 //
    await scanWifi(store_Scan.selected_device)

    console.log('initialized')
}