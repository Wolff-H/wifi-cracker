import scanWifi from "./scan"
import crack_task_manager from "./CrackTaskManager"

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
        store_Tasks.wlan_card_nav_at = store_Scan.selected_device
    })

    // TODO
    // 读取密码本存储到全局对象 //
    // await invoke('read_passwordbook').then((response) => {
    //     console.log('passwordbook :', response)

    //     window.__passwordbook = response
    // })

    // 扫描 WiFi 网络 //
    await scanWifi(store_Scan.selected_device)

    // 初始化任务管理器 //
    crack_task_manager.initialize(store_Device.wlan_cards.map((card) => (card.Name)))

    console.log('initialized')
}