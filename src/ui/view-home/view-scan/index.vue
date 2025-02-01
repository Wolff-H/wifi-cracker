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
                    :title="`${card.Description}  •  GUID=${card.GUID}`"
                )
        .action.execution-mode
            el-radio-group(
                v-model="execution_mode"
            )
                el-radio-button(label="手动" value="")
                el-radio-button(label="监控" value="monitor")
                el-radio-button(label="监控并统计" value="profile")
        el-button.action.refresh(
            v-if="execution_mode === ''"
            type="primary"
            @click="scan"
        )
            IconRefresh.icon(size="14px" style="margin-right: 6px")
            |刷新
    .information
        .update-time
            |更新于 {{ update_time_formatted }}
    .scan-result
        el-table(
            :data="scanned_wifis"

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

// const update_time = ref<number>()
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

    return list.toSorted((a, b) => {
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
</script>



<style lang="stylus">
@import _colorset
@import _patterns

$root = "#view-scan"

{$root}
    display flex
    flex-direction column
    >.actions
        display flex
        align-items center
        margin 16px
        column-gap 16px
        .action.device-select
            width 200px
    >.information
        display flex
        align-items center
        font-size 12px
        margin 0px 16px
        color $black60
        .update-time
            color $black40
    >.scan-result
        padding 16px
</style>
