export default class CrackTask implements WC.CrackTask
{
    ssid: WC.CrackTask["ssid"] = ''
    status: WC.CrackTask["status"] = 'pending'
    iterations_total: number = 0
    iterations: number = 0
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
    

    constructor(task?: Partial<WC.CrackTask>)
    {
        Object.assign(this, task)
    }
}