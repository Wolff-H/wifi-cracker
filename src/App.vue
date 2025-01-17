<template lang="pug">
#app
    router-view
</template>



<script setup lang="ts">
import initialize from "@/logic/initialize"



defineOptions({ name: 'app' })

// on created //
initialize()

</script>



<style lang="stylus">
@import _colorset
@import _patterns

body
    width 100vw
    height 100vh
    overscroll-behavior-y contain

#app
    // 
</style>
    