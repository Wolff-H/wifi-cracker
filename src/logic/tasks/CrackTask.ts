import { v7 as uuidv7 } from "uuid"

export default class CrackTask implements WC.CrackTask
{
    id: WC.CrackTask["id"] = ''
    ssid: WC.CrackTask["ssid"] = ''
    status: WC.CrackTask["status"] = 'pending'
    wlan_info: WC.CrackTask["wlan_info"] = ''
    log: WC.CrackTask["log"] =
    {
        failures: [],
    }
    // iteration_groups: WC.CrackTask["iteration_groups"] =
    // {
    //     total: 0,
    //     progress: [],
    // }
    progress: WC.CrackTask["progress"] =
    {
        total: 0,
        stage: 0,
        iteration_groups: [],
    }
    setup: WC.CrackTask["setup"] =
    {
        ctime: 0,
        device: '',
        strategies: [],
        custom_strategies: [],
        connection_interval: 1,
        random_mac: false,
        max_retries: 100,
    }
    result: WC.CrackTask["result"] =
    {
        ctime: 0,
        password: '',
    }
    
    constructor(task: Partial<WC.CrackTask>)
    {
        this.id = task?.id || uuidv7()

        Object.assign(this, {
            ssid: task.ssid || '',
            status: task.status || 'pending',
            log: task.log || {
                failures: [],
            },
            setup: task.setup || {
                ctime: 0,
                device: '',
                strategies: [],
                custom_strategies: [],
                connection_interval: 1,
                random_mac: false,
                max_retries: 100,
            },
            result: task.result || {
                ctime: 0,
                password: ''
            },
            wlan_info: task.wlan_info || '',
        })

        this.progress = task.progress || constructProgress(this.setup.strategies, this.setup.custom_strategies)
    }
}

/**
 * 构造默认的迭代进度。
 * @param strategies 
 * @param custom_strategies 
 */
function constructProgress(strategies: WC.CrackStrategy[], custom_strategies: string[])
{
    console.log('custom_strategies :', custom_strategies);
    const progress: WC.CrackTask["progress"] =
    {
        total: 0,
        stage: 0,
        iteration_groups: [],
    }

    for (const strategy of strategies)
    {
        switch (strategy)
        {
            case 'passwordbook':
                progress.iteration_groups.push([strategy, 0, store.passwordbook_list.length])
                break
            case 'digits_8':
                progress.iteration_groups.push([strategy, 0, 10 ** 8])
                break
            case 'digits_9':
                progress.iteration_groups.push([strategy, 0, 10 ** 9])
                break
            case 'digits_10':
                progress.iteration_groups.push([strategy, 0, 10 ** 10])
                break
            case 'phone_number':
                progress.iteration_groups.push([strategy, 0, 26 * 10 ** 8])
                break
            // TODO 自定义策略
            default:
                break
        }
    }

    progress.total = _.sum(progress.iteration_groups.map((iteration) => iteration[2]))

    return progress
}