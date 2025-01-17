<template lang="pug">
#view-tasks
    .menu
        .actions
            el-button.action.create-task(
                type="primary"
            )
                IconPlus(size="24px" style="margin-right: 4px;")
                |新建任务
        .menu-item.running(
            :class="{ 'o-active': menu_at === 'running' }"
        )
            IconSignalOne(size="14px").icon
            .title
                |执行中
        .menu-item.completed(
            :class="{ 'o-active': menu_at === 'completed' }"
        )
            IconCheckOne(size="14px").icon
            .title
                |已完成
</template>



<script setup lang="ts">
import {
    SignalOne as IconSignalOne,
    CheckOne as IconCheckOne,
    Plus as IconPlus,
} from "@icon-park/vue-next"

defineOptions({ name: 'view-tasks' })

const menu_at = ref<'running' | 'completed'>('running')
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
            margin 8px 0px
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
</style>
