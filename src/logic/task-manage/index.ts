// /**
//  * 添加一组任务。
//  * @param wlan_card 网卡。
//  * @param tasks 一组任务。
//  */
// export function addTasks(wlan_card: string, tasks: WC.CrackTask[])
// {
//     store_Tasks.uncompleted[wlan_card].queue.unshift(...tasks)
// }

// /**
//  * 开始指定网卡下的任务。（如果该网卡下没有任务正在被执行，则开始队列中的第一个）
//  * @param wlan_card 网卡。
//  */
// export function startTasks(wlan_card: string)
// {
//     const tasks_state = store_Tasks.uncompleted[wlan_card]

//     if (!tasks_state.running && tasks_state.queue.length)
//     {
//         tasks_state.running = tasks_state.queue.shift()!
//         runTask(wlan_card, store_Tasks.uncompleted[wlan_card].pop()!)
//     }
// }

// export function runTask(wlan_card: string, task: WC.CrackTask)
// {
    
// }