import composeWlanProfile from "./composeWlanProfile"

class CrackTaskManager
{
    /**
     * 网卡任务管理器。
     **/
    wlan_cards: Record<string, WlanCardCrackTaskManager> = {}
    /**
     * 本实例初始化时间。
     **/
    itime: number = 0

    constructor()
    {
        // 
    }

    /**
     * 初始化网卡任务管理器。
     * @param wlan_cards 网卡名称列表。
     */
    initialize(wlan_cards: string[])
    {
        this.itime = Date.now()

        for (const wlan_card of wlan_cards)
        {
            store_Tasks.uncompleted[wlan_card] = []
            this.wlan_cards[wlan_card] = new WlanCardCrackTaskManager(wlan_card)
        }
    }
}

class WlanCardCrackTaskManager
{
    /**
     * 网卡名称。
     */
    private wlan_card: string

    /**
     * 当前正在执行的任务的 Timeout id。
     */
    running_task_timer: undefined | number = undefined

    constructor(wlan_card: string)
    {
        this.wlan_card = wlan_card
    }

    /**
     * 添加一些任务。
     * @param tasks 任务们。
     */
    add(tasks: WC.CrackTask[])
    {
        const queue_task = store_Tasks.uncompleted[this.wlan_card]
        
        queue_task.unshift(...tasks)
    }

    /**
     * 开始任务。（如果该网卡下没有任务正在被执行，则开始队列中的第一个）
     */
    start()
    {
        const queue_task = store_Tasks.uncompleted[this.wlan_card]

        if (queue_task.length && !queue_task.some((task) => (task.status === 'running')))
        {
            this.run(queue_task[0])
        }
    }

    /**
     * 执行一个任务。这将会暂停当前正在执行的任务（如果当前执行任务等同于传入的任务）。
     * @param task 任务。
     */
    run(task: WC.CrackTask): void
    /**
     * 执行一个任务。这将会暂停当前正在执行的任务（如果当前执行任务等同于传入的任务）。
     * @param task_id 任务 ID。
     */
    run(task_id: string): void
    /**
     * 执行一个任务。这将会暂停当前正在执行的任务（如果当前执行任务等同于传入的任务）。
     * @param task_index 任务索引。
     */
    run(task_index: number): void
    async run(arg1: WC.CrackTask | string | number)
    {
        let task: null | WC.CrackTask = null
        const queue_task = store_Tasks.uncompleted[this.wlan_card]
        
        if (typeof arg1 === 'string') task = queue_task.find((task) => (task.id === arg1))!
        else if (typeof arg1 ==='number') task = queue_task[arg1]
        else task = arg1

        const current_running_task = queue_task.find((task) => (task.status === 'running'))

        if(current_running_task && current_running_task.id !== task.id) current_running_task.status = 'pending'
        
        task.status = 'running'
        console.log('task :', task);
        
        // 将任务移到队列首位 //
        // const _index = index ?? queue_task.findIndex((task) => (task.id === task.id))
        // ;[queue_task[_index], queue_task[0]] = [queue_task[0], queue_task[_index]]

        return;
        // 开始执行任务 //
        const wlan_info = JSON.parse(task.wlan_info) as WC.WlanSSInfoNormalized
        const profile_path = await invoke('create_wlan_profile', {
            content: composeWlanProfile({
                ssid: wlan_info._SSID,
                authentication: wlan_info.Authentication,
                random_mac: task.setup.random_mac,
            })
        })

        await invoke('add_wlan_profile_registration', {
            profile_path: profile_path,
        })

        this.running_task_timer = window.setTimeout(async () => {
            // TODO 将这个回调函数封装掉。

            /**
             * 检查是否已完成全部迭代。
             * 已完成则标记任务为完成，执行完成逻辑：
             *     修改任务状态。
             *     将任务移入已完成队列。
             *     清理任务相关（profile 文件，profile 注册）。
             *     开始下一个任务（如果有）。
             * 未完成则继续下方逻辑。
             */

            /**
             * 按任务记录的进度向 profile 改写密码。
             */

            // 连接 WLAN //
            await invoke('connect_wlan', {
                profile_name: wlan_info._SSID,
                wlan_card: this.wlan_card,
            })

            /**
             * 如果请求失败，更新 timer，注册一个新的回调执行。
             *     不推进进度。
             *     更新任务的累计请求失败日志。
             */

            /**
             * 在给定的等待时间后，检查是否连接成功。
             *     检查网卡连接状态以确定是否连接成功。
             */

            /**
             * 如果连接成功，记录密码并标记任务为完成，将任务移入已完成队列。
             */

            /**
             * 如果连接失败，更新 timer，注册一个新的回调执行。
             */
            
        }, task.setup.connection_interval * 1000)
    }

    pause(task: WC.CrackTask): void
    pause(task_id: string): void
    pause(task_index: number): void
    pause(arg1: WC.CrackTask | string | number)
    {
        let task: null | WC.CrackTask = null
        const queue_task = store_Tasks.uncompleted[this.wlan_card]
        
        if (typeof arg1 === 'string') task = queue_task.find((task) => (task.id === arg1))!
        else if (typeof arg1 ==='number') task = queue_task[arg1]
        else task = arg1

        task.status = 'pending'
    }
}

export default new CrackTaskManager()





/**
 * 获取当次迭代的密码。
 */
function getIterationPassword(strategy: WC.CrackStrategy | string[], cursor: number)
{

}