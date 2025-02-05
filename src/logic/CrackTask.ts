import { v7 as uuidv7 } from "uuid"

export default class CrackTask implements WC.CrackTask
{
    id: WC.CrackTask["id"] = ''
    ssid: WC.CrackTask["ssid"] = ''
    status: WC.CrackTask["status"] = 'pending'
    iterations: WC.CrackTask["iterations"] =
    {
        total: 0,
        progress: {},
    }
    setup: WC.CrackTask["setup"] =
    {
        ctime: 0,
        device: '',
        strategies: [],
        custom_strategies: [],
        connection_interval: 1,
        random_mac: false,
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
            ssid: task?.ssid || '',
            status: task?.status || 'pending',
            setup: task.setup,
            result: task.result,
        })

        this.iterations = task.iterations || constructIterations(this.setup.strategies, this.setup.custom_strategies)
    }
}

/**
 * 构造默认的迭代进度。
 * @param strategies 
 * @param custom_strategies 
 */
function constructIterations(strategies: WC.CrackStrategy[], custom_strategies: string[])
{
    const iterations: WC.CrackTask["iterations"] =
    {
        total: 0,
        progress: {},
    }

    for (const strategy of strategies)
    {
        switch (strategy)
        {
            case 'passwordbook':
                iterations.progress[strategy] = [0, store.passwordbook_list.length]
                break
            case 'digits_8':
                iterations.progress[strategy] = [0, 10 ** 8]
                break
            case 'digits_9':
                iterations.progress[strategy] = [0, 10 ** 9]
                break
            case 'digits_10':
                iterations.progress[strategy] = [0, 10 ** 10]
                break
            case 'phone_number':
                iterations.progress[strategy] = [0, 26 * 10 ** 8]
                break
            // TODO 自定义策略
            default:
                break
        }
    }

    iterations.total = _.sum(Object.values(iterations.progress).map(([_, subtotal]) => subtotal))

    return iterations
}