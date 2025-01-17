<template lang="pug">
#view-home
    #header
        #navigation
            .navigation-tab.tasks(
                :class="{ 'o-active': store.navigation_at === 'tasks' }"
                @click="store.navigation_at = 'tasks'"
            )
                IconListTop.icon(size="16px")
                .title
                    |任务
            .navigation-tab.scan(
                :class="{ 'o-active': store.navigation_at === 'scan' }"
                @click="store.navigation_at = 'scan'"
            )
                IconRadarTwo.icon(size="16px")
                .title
                    |扫描
            .navigation-tab.device(
                :class="{ 'o-active': store.navigation_at === 'device' }"
                @click="store.navigation_at = 'device'"
            )
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
        background-color $black02
        #navigation
            display flex
            height 100%
            .navigation-tab
                display flex
                height 100%
                width 80px
                align-items center
                justify-content center
                {$pattern$buttonlike-primary}
                .icon
                    // 
                .title
                    margin-left 6px
                    font-size 14px
                &.o-active
                    color $primary

</style>
