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
            this.run(queue_task[0], 0)
        }
    }

    /**
     * 执行一个任务。这将会暂停当前正在执行的任务（如果当前执行任务等同于传入的任务）。
     * @param task 任务。
     * @param index 任务在队列中的索引。
     */
    run(task: WC.CrackTask, index?: number)
    {
        const queue_task = store_Tasks.uncompleted[this.wlan_card]

        const current_running_task = queue_task.find((task) => (task.status === 'running'))

        if(current_running_task && current_running_task.id !== task.id) current_running_task.status = 'pending'

        // const _index = index ?? queue_task.findIndex((task) => (task.id === task.id))

        task.status = 'running'
        
        // 将任务移到队列首位 //
        // ;[queue_task[_index], queue_task[0]] = [queue_task[0], queue_task[_index]]
    }
}

export default new CrackTaskManager()