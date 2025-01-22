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
        )
            IconRefresh.icon(size="14px" style="margin-right: 6px")
            |刷新
    .information
        .update-time
            |更新于 {{ update_time_formatted }}
</template>



<script setup lang="ts">
import {
    Refresh as IconRefresh,
} from "@icon-park/vue-next"

defineOptions({ name: 'view-scan' })

const selected_device = toRef(store_Scan, 'selected_device')
const execution_mode = toRef(store_Scan, 'execution_mode')

const update_time = ref<number>()
const update_time_formatted = computed(() => {
    return update_time ? '-' : dayjs(update_time).format('YYYY-MM-DD HH:mm:ss')
})
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
</style>
