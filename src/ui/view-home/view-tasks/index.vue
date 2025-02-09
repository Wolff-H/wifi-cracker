<template lang="pug">
#view-tasks
    .menu
        .actions
            el-button.action.create-task(
                type="primary"
                @click="if_render_create_task_modal = true"
            )
                IconPlus(size="24px" style="margin-right: 4px;")
                |新建
        .menu-item.uncompleted(
            :class="{ 'o-active': menu_at === 'uncompleted' }"
            @click="menu_at = 'uncompleted'"
        )
            IconSignalOne(size="14px").icon
            .title
                |待完成
        .menu-item.completed(
            :class="{ 'o-active': menu_at === 'completed' }"
            @click="menu_at = 'completed'"
        )
            IconCheckOne(size="14px").icon
            .title
                |已完成
    .tasks
        .head
            el-segmented.wlan-cards(
                v-model="wlan_card_nav_at"
                :options="wlan_crads_options"
            )
        .body
            .task-list
                .task(
                    v-for="(task, index) of tasks_running_in_view"
                    :key="task.id"
                )
                    .status(:title="JSON.stringify(task.setup, undefined, 4)")
                        IconRound(v-if="task.status === 'pending'" size="24px")
                        IconSignalOne(v-else-if="task.status === 'running'" size="24px")
                    .main
                        .title(:title="JSON.stringify(JSON.parse(task.wlan_info), undefined, 4)")
                            |{{ task.ssid }}
                        el-progress.progress-bar(
                            :percentage="task._progress.percentage"
                        )
                        .progress-info
                            .combinations-consumption(title="尝试的组合数")
                                |{{ task._progress.percentage }} % ( {{ task._progress.combinations_consumption.join(' / ') }} )
                            .estimated-time(title="估计剩余用时")
                                |??:??:??
                        .log(:title="JSON.stringify(task.log, undefined, 4)")
                            |Log
                    .main-action
                        template(v-if="menu_at === 'uncompleted'")
                            IconPlayOne.action.run(
                                v-if="task.status === 'pending'"
                                size="24px"
                                @click="runTask(index)"
                            )
                            IconPause.action.pause(
                                v-else-if="task.status === 'running'"
                                size="24px"
                                @click="pauseTask(index)"
                            )
                        template(v-else-if="menu_at === 'completed'")
                            IconKeyTwo.action.password(
                                v-if="task.result.password"
                                size="24px"
                                @click="copyPassword(index)"
                            )
                    .delete-button(
                        title="删除任务"
                        @click="deleteTask(index)"
                    )
                        IconClose(size="12px")
    el-dialog.modal.view-tasks_create-task(
        v-model="if_render_create_task_modal"
        title="新建任务"
        align-center
    )
        .modal-content
            .section.device-select
                .label
                    |无线网卡
                .content
                    el-select(
                        v-model="form_task_setup.device"
                        placeholder="选择无线网卡设备"
                        title="执行扫描的无线网卡设备"
                    )
                        el-option(
                            v-for="card of store_Device.wlan_cards"
                            :key="card.Name"
                            :label="card.Name"
                            :value="card.Name"
                            :title="`${card.Description}  •  GUID: ${card.GUID}`"
                        )
            .section.strategy-select
                .label
                    |密码策略
                .content
                    el-select(
                        v-model="form_task_setup.strategies"
                        placeholder="选择密码策略"
                        title="尝试连接所使用的密码策略"
                        multiple
                        collapse-tags
                        collapse-tags-tooltip
                    )
                        el-option(
                            v-for="(v, k) of dict_password_strategy"
                            :key="k"
                            :label="v"
                            :value="k"
                            :title="v"
                        )
                    el-input(
                        v-if="form_task_setup.strategies.includes('custom')"
                        v-model="form_task_setup.custom_strategies"
                        :rows="3"
                        type="textarea"
                        placeholder="自定义密码策略，每行一条"
                    )
            .section.wlan-select
                .label
                    |无线网络
                .content
                    el-select(
                        v-model="form_task_setup.wlans"
                        placeholder="选择要连接的无线网络"
                        title="要尝试连接的无线网络，可选多个"
                        multiple
                        collapse-tags
                        collapse-tags-tooltip
                    )
                        el-option(
                            v-for="(wlan, index) of current_scanned_wlans_secured"
                            :key="index"
                            :label="wlan._SSID"
                            :value="wlan._SSID"
                            :title="`${wlan._SSID}.${wlan.BSS._BSSID}`"
                        )
            .section.connection-interval
               .label
                    |连接间隔（秒）
                    el-tooltip(
                        content="在下一个连接请求就绪（上次连接已回报，新连接配置已就绪）后发起连接的间隔"
                        placement="top"
                    )
                        IconInfo.hint(size="14px")
               .content
                    el-input-number(
                        v-model="form_task_setup.connection_interval"
                        :min="0"
                        :max="10"
                    )
            .section.max-retries
               .label
                    |最大重试次数
                    el-tooltip(
                        content="连接请求不成功时允许的最大重试次数"
                        placement="top"
                    )
                        IconInfo.hint(size="14px")
               .content
                    el-input-number(
                        v-model="form_task_setup.max_retries"
                        :min="0"
                        :max="100"
                    )
            .section.random-mac
                .label
                    |随机 MAC 地址
                    el-tooltip(
                        content="是否向目标 WiFi 暴露随机的本机 MAC 地址"
                        placement="top"
                    )
                        IconInfo.hint(size="14px")
                .content
                    el-switch(
                        v-model="form_task_setup.random_mac"
                        title="随机 MAC 地址"
                    )
            .section.confirm
                el-button(
                    type="primary"
                    @click="createTask"
                )
                    |确认
</template>



<script setup lang="ts">
import {
    SignalOne as IconSignalOne,
    CheckOne as IconCheckOne,
    Plus as IconPlus,
    Info as IconInfo,
    Round as IconRound,
    PlayOne as IconPlayOne,
    Close as IconClose,
    Pause as IconPause,
    KeyTwo as IconKeyTwo,
} from "@icon-park/vue-next"
import { dict_password_strategy } from "@/constants"
import { ElMessage } from "element-plus"
import CrackTask from "@/logic/tasks/CrackTask"
import crack_task_manager from "@/logic/tasks/CrackTaskManager"

defineOptions({ name: 'view-tasks' })

const menu_at = ref<'uncompleted' | 'completed'>('uncompleted')
const if_render_create_task_modal = ref(false)
const current_scanned_wlans = ref<any[]>([])

const current_scanned_wlans_secured = computed(() => {
    return current_scanned_wlans.value.filter((ss) => ss.Authentication !== 'Open')
})

const dict_current_scanned_wlan = computed(() => {
    return Object.fromEntries(current_scanned_wlans.value.map(ss => [ss._SSID, ss])) as Record<string, WC.WlanSSInfoNormalized>
})

const form_task_setup = reactive({
    device: '',
    strategies: [] as WC.CrackStrategy[],
    custom_strategies: '',
    wlans: [] as string[],
    connection_interval: 1,
    random_mac: false,
    max_retries: 100,
})

const wlan_card_nav_at = toRef(store_Tasks, 'wlan_card_nav_at')

const wlan_crads_options = computed(() => {
    return Object.keys(store_Tasks.uncompleted).map((wlan_card_name) => {
        return {
            value: wlan_card_name,
            label: `${wlan_card_name} (${store_Tasks.uncompleted[wlan_card_name].length})`,
        }
    })
})

const tasks_running_in_view = computed(() => {
    const queue = menu_at.value === 'uncompleted' ?
        (store_Tasks.uncompleted[wlan_card_nav_at.value] || []) // 在状态库未初始化网卡时，返回空数组
        :
        store_Tasks.completed

    return queue.map((task) => {
        let iterations_consumed = 0

        for (const [_, cursor, subtotal] of task.progress.iteration_groups)
        {
            if (cursor === subtotal)
            {
                iterations_consumed += subtotal
            }
            else
            {
                iterations_consumed += cursor
                break
            }
        }

        return {
            ...task,
            _progress:
            {
                percentage: Number((iterations_consumed / task.progress.total * 100).toFixed(2)),
                combinations_consumption: [iterations_consumed, task.progress.total],
                estimated_time: '00:00:00',
            },
        }
    }) as (WC.CrackTask & { _progress: any })[]
})

function createTask()
{
    // 校验表单 //
    let if_valid_form = true

    if (!form_task_setup.device)
    {
        ElMessage.error('必须选择无线网卡设备')
        if_valid_form = false
    }
    if (!form_task_setup.strategies.length)
    {
        ElMessage.error('必须选择密码策略')
        if_valid_form = false
    }
    if (!form_task_setup.wlans.length)
    {
        ElMessage.error('必须选择目标网络')
        if_valid_form = false
    }

    if (!if_valid_form) return

    // 校验通过，创建任务 //
    const dict_wlan = dict_current_scanned_wlan.value

    const tasks = form_task_setup.wlans.map((wlan) => {
        const custom_strategies_normalized = form_task_setup.custom_strategies.split('\n').filter((v) => v)

        return new CrackTask({
            ssid: wlan,
            setup:
            {
                ctime: Date.now(),
                device: form_task_setup.device,
                strategies: form_task_setup.strategies,
                custom_strategies: custom_strategies_normalized,
                connection_interval: form_task_setup.connection_interval,
                random_mac: false,
                max_retries: form_task_setup.max_retries,
            },
            wlan_info: JSON.stringify(dict_wlan[wlan]),
        })
    })

    const crack_task_submanager = crack_task_manager.wlan_cards[form_task_setup.device]
    
    crack_task_submanager.add(tasks)

    // 关闭弹窗 //
    if_render_create_task_modal.value = false    
}

function runTask(task_index: number)
{
    const crack_task_submanager = crack_task_manager.wlan_cards[wlan_card_nav_at.value]

    crack_task_submanager.run(task_index)
}

function pauseTask(task_index: number)
{
    const crack_task_submanager = crack_task_manager.wlan_cards[wlan_card_nav_at.value]

    crack_task_submanager.pause(task_index)
}

function deleteTask(task_index: number)
{
    const crack_task_submanager = crack_task_manager.wlan_cards[wlan_card_nav_at.value]

    crack_task_submanager.delete(menu_at.value, task_index)
}

function copyPassword(task_index: number)
{
    // TODO
}

watch(if_render_create_task_modal, (new_val) => {
    if (!new_val)
    {
        Object.assign(form_task_setup, {
            device: '',
            strategies: [],
            custom_strategies: '',
            wlans: [],
            connection_interval: 1,
            random_mac: false,
            max_retries: 100,
        })
        current_scanned_wlans.value = []
    }
    else
    {
        current_scanned_wlans.value = store_Scan.scanned_wifis_normalized
    }
})

</script>



<style lang="stylus">
@import _colorset
@import _patterns

$root = '#view-tasks'

{$root}
    display flex
    height 100%
    width 100%
    >.menu
        display flex
        flex-direction column
        align-items center
        height 100%
        width 129px
        border-right 1px solid $black15
        >.actions
            display flex
            margin 16px
            .create-task
                width 98px
        >.menu-item
            display flex
            height 32px
            width 100%
            align-items center
            padding-left 12px
            {$pattern$buttonlike-primary}
            .icon
                // 
            .title
                font-size 14px
                margin-left 8px
            &.o-active
                color $primary
                background-color $primary10
    >.tasks
        display flex
        flex-direction column
        width 0px
        flex-grow 1
        height 100%
        >.head
            display flex
            height 64px
            width 100%
            padding 16px
            align-items center
            >.wlan-cards
                // 
        >.body
            display flex
            flex-direction column
            height 0px
            flex-grow 1
            overflow-y auto
            padding 16px
            >.task-list
                display flex
                flex-direction column
                width 100%
                >.task
                    display flex
                    position relative
                    align-items center
                    column-gap 8px
                    width 100%
                    padding 16px
                    padding-left 8px
                    border-radius 8px
                    .status
                        height 40px
                        aspect-ratio 1
                        display flex
                        align-items center
                        justify-content center
                        color $black40
                    .main
                        display flex
                        flex-direction column
                        width 0px
                        flex-grow 1
                        row-gap 8px
                        position relative
                        >.title
                            font-size 14px
                            line-height 14px
                        >.progress-bar
                            width 100%
                            .el-progress__text
                                display none
                        >.progress-info
                            display flex
                            align-items center
                            column-gap 8px
                            font-size 12px
                            line-height 14px
                            color $black40
                            justify-content space-between
                           .estimated-time
                                //
                           .combinations-consumption
                                // 
                        >.log
                            display none
                            font-size 12px
                            color $black40
                            position absolute
                            top 0px
                            right 0px
                    .main-action
                        height calc(100% - 16px)
                        aspect-ratio 1
                        display flex
                        align-items center
                        justify-content center
                        .action
                            display flex
                            align-items center
                            justify-content center
                            cursor pointer
                            height 32px
                            width 32px
                            border-radius 4px
                            {$pattern$buttonlike}
                    .delete-button
                        display none
                        position absolute
                        top 6px
                        right 6px
                        cursor pointer
                        color $black60
                        &:hover
                            color $black
                    &:hover
                        background-color $shadow03
                        & .delete-button
                            display flex
                        & .log
                            display block
.modal.view-tasks_create-task
    .modal-content
        display flex
        flex-direction column
        row-gap 8px
        >.section
            display flex
            align-items flex-start
            min-height 32px
            >.label
                display flex
                align-items center
                font-size 12px
                line-height 32px
                min-width 120px
                color $black40
                .hint
                    margin-left 4px
            >.content
                display flex
                flex-direction column
                row-gap 8px
                width 0px
                flex-grow 1
        >.section.confirm
            width 100%
            >.el-button
                width 100%
</style>
