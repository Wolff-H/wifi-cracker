<template lang="pug">
#view-scan
    .actions
        .action.device-select
            el-select(
                v-model="selected_device"
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
        .action.execution-mode
            el-radio-group(
                v-model="execution_mode"
            )
                el-radio-button(label="手动" value="")
                el-radio-button(label="监控" value="monitor")
                el-radio-button(label="监控并统计" value="profile")
        el-button.action.refresh(
            type="primary"
            circle
            :disabled="execution_mode !== ''"
            :class="{ 'o-executing': execution_mode !== '' }"
            @click="scan"
            title="执行扫描"
        )
            IconRefresh.icon(size="18px")
    .information
        .update-time
            |更新于 {{ update_time_formatted }}
    .scan-result
        el-table(
            :data="scanned_wifis"
            height="100%"
        )
            el-table-column(prop="_SSID" label="SSID")
            el-table-column(prop="BSS.Signal" label="强度" width="80px")
            el-table-column(prop="Authentication" label="认证")
            el-table-column(prop="Encryption" label="加密")
            el-table-column(prop="BSS.Band" label="波段")
            el-table-column(prop="BSS.Radio type" label="无线电类型")
</template>



<script setup lang="ts">
import scanWifi from "@/logic/scan"
import {
    Refresh as IconRefresh,
} from "@icon-park/vue-next"

defineOptions({ name: 'view-scan' })

const selected_device = toRef(store_Scan, 'selected_device')
const execution_mode = toRef(store_Scan, 'execution_mode')

let scan_monitor_timer: undefined | number = undefined

const scan_result = computed(() => {
    return store_Scan.wifi_scan_result
})

const scanned_wifis = computed(() => {
    const dict = store_Scan.dict_scanned_wifis

    const list = Object.values(dict).map((SS) => {
        const list_BSS = Object.values(SS.BSSs)
        let best_signal_bss = list_BSS[0]

        list_BSS.forEach((bss) => {
            if (bss.Signal > best_signal_bss.Signal) best_signal_bss = bss
        })

        return { ...SS, BSS: best_signal_bss }
    })

    return list.length <= 1 ? list : list.toSorted((a, b) => {
        return b.BSS.Signal - a.BSS.Signal
    })
})

const update_time_formatted = computed(() => {
    const update_time = scan_result.value.timestamp
    return update_time ? dayjs(update_time).format('YYYY-MM-DD HH:mm:ss') : '-'
})

function scan()
{
    scanWifi(selected_device.value)
}

watch(execution_mode, (new_val) => {
    if (new_val === '')
    {
        window.clearInterval(scan_monitor_timer)
        scan_monitor_timer = undefined
    }
    else if (new_val === 'monitor')
    {
        if (scan_monitor_timer === undefined) scan_monitor_timer = window.setInterval(scan, 2000)
    }
    else if (new_val === 'profile')
    {
        if (scan_monitor_timer === undefined) scan_monitor_timer = window.setInterval(scan, 2000)
    }
})
</script>



<style lang="stylus">
@import _colorset
@import _patterns

$root = "#view-scan"

{$root}
    display flex
    flex-direction column
    height 100%
    >.actions
        display flex
        align-items center
        margin 16px
        column-gap 16px
        .action.device-select
            width 200px
        .action.refresh
            &.o-executing
                animation spin 3s linear infinite
    >.information
        display flex
        align-items center
        font-size 12px
        margin 0px 16px
        color $black60
        .update-time
            color $black40
    >.scan-result
        height 0px
        flex-grow 1
        padding 16px
@keyframes spin
    0%
        transform rotate(0deg)
    100%
        transform rotate(360deg)
</style>
