<template lang="pug">
#view-home
    #header
        #navigation
            .navigation-tab.tasks
                IconListTop.icon(size="16px")
                .title
                    |任务
            .navigation-tab.scan
                IconRadarTwo.icon(size="16px")
                .title
                    |扫描
            .navigation-tab.device
                IconSignalOne.icon(size="16px")
                .title
                    |设备
</template>



<script setup lang="ts">
import {
    ListTop as IconListTop,
    RadarTwo as IconRadarTwo,
    SignalOne as IconSignalOne,
} from "@icon-park/vue-next"

defineOptions({ name: 'view-home' })
</script>



<style lang="stylus">
@import _colorset
@import _patterns

$root = '#view-home'

{$root}
    height 100%
    width 100%
    #header
        display flex
        height 41px
        width 100%
        border-bottom 1px solid $black15
        background-color $black03
        #navigation
            display flex
            height 100%
            .navigation-tab
                display flex
                // flex-direction column
                height 100%
                width 80px
                align-items center
                justify-content center
                {$pattern$buttonlike-primary}
                .icon
                    // 
                .title
                    margin-left 8px
                    font-size 16px
                    // color $black40
</style>
