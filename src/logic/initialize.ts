import scanWifi from "./scan"
import crack_task_manager from "./tasks/CrackTaskManager"

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

    // 读取密码本存储到根状态库 //
    await invoke('read_passwordbook').then((response) => {
        store.passwordbook = response
    })

    // 扫描 WiFi 网络 //
    await scanWifi(store_Scan.selected_device)

    // 初始化任务管理器 //
    crack_task_manager.initialize(store_Device.wlan_cards.map((card) => (card.Name)))

    // 读取应用状态持久化数据，并最大可用赋给当前状态 //
    await invoke('read_app_state_persistence').then((response) => {
        console.log('response :', response);
        const app_state = JSON.parse(response) as WC.AppStatePersistence

        for (const key in app_state.state.tasks.uncompleted)
        {
            if (store_Tasks.uncompleted[key])
                store_Tasks.uncompleted[key] = app_state.state.tasks.uncompleted[key]
        }

        if (store_Device.dict_wlan_cards[app_state.state.tasks.wlan_card_nav_at])
            store_Tasks.wlan_card_nav_at = app_state.state.tasks.wlan_card_nav_at
    })

    console.log('initialized')
}