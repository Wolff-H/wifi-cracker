<template lang="pug">
#view-device
    .section.computer-info
        .head
            .title
                |计算机
        .body
            //- 
    .section.device-info
        .head
            .title
                |无线网卡
            .actions
                .action.refresh
                    IconRefresh.icon(size="12px")
                    |刷新
        .body
            .update-time
            .normalized-info
                |{{ store_Device.device_info }}
</template>



<script setup lang="ts">
import { Refresh as IconRefresh } from "@icon-park/vue-next"

defineOptions({ name: 'view-device' })
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
    >.section.device-info
        >.body
            .normalized-info
                white-space pre
                font-size 12px
                font-family consolas, monospace
                user-select text

</style>
