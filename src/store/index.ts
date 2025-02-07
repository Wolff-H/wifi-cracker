/**
 * @description
 * 根层级的状态库定义。
 */

import dayjs from "dayjs"
import { defineStore } from "pinia"



const useStore = defineStore('/', {
    state: (): _S => ({
        initialized_time: dayjs().unix(),
        navigation_at: 'tasks',
        passwordbook: '',
    }),
    getters:
    {
        passwordbook_list(): string[]
        {
            return markRaw(this.passwordbook.split('\n'))
        },
    },
})

type _S =
{
    initialized_time: number
    navigation_at: 'tasks' | 'scan' | 'device'
    passwordbook: string
}

// export type Store = ReturnType<typeof useStore> // 不需要手写了，因为由 store.auto-imports.ts 自动编译了



export default useStore