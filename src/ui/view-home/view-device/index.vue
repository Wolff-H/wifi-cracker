<template lang="pug">
#view-device
    .section.computer-info
        .head
            .title
                |计算机
        .body
            .normalized-info
                |{{ computer_info }}
    .section.device-info
        .head
            .title
                |无线网卡
            .actions
                .action.refresh(@click="refreshDeviceInfo")
                    IconRefresh.icon(size="12px")
                    |刷新
        .body
            .update-time
                |更新于 {{ device_info.time }}
            .normalized-info
                |{{ device_info.content }}
</template>



<script setup lang="ts">
import { Refresh as IconRefresh } from "@icon-park/vue-next"

defineOptions({ name: 'view-device' })

const computer_info = computed(() => {
    return store_Device.computer_info
})

const device_info = computed(() => {
    return store_Device.device_info
})

function refreshDeviceInfo() {
    invoke('get_device_info')
        .then((response) => {
            store_Device.device_info = response
        })
}
</script>



<style lang="stylus">
@import _colorset
@import _patterns

$root = "#view-device"

{$root}
    display flex
    flex-direction column
    >.section
        height 100%
        width 100%
        margin-top 16px
        >.head
            height 32px
            width 100%
            display flex
            align-items center
            padding 0 16px
            >.title
                font-size 16px
            >.actions
                margin-left auto
                display flex
                align-items center
                >.action
                    cursor pointer
                    display flex
                    align-items center
                    font-size 12px
                    &:hover
                        color $primary60
                    &:active
                        color $primary
                    .icon
                        margin-right 4px
        >.body
            padding 16px
    >.section.computer-info
        >.body
            .normalized-info
                white-space pre
                font-size 12px
                font-family consolas, monospace
                user-select text
                background-color $black03
                padding 8px
    >.section.device-info
        >.body
            .update-time
                display flex
                align-items center
                font-size 12px
                color $black40
                margin-bottom 8px
                width fit-content
                padding 8px
                background-color $black03
            .normalized-info
                white-space pre
                font-size 12px
                font-family consolas, monospace
                user-select text
                background-color $black03
                padding 8px

</style>
