import * as stores from "@/store.auto-imports.ts" // auto-generated by scripts/import-store
// 框架 //
import { createApp } from "vue"
import { createPinia } from "pinia"
import dayjs from "dayjs"
import "dayjs/locale/zh-cn"
import dayjs_plugin_utc from "dayjs/plugin/utc"
import dayjs_plugin_weekday from "dayjs/plugin/weekday"
import dayjs_plugin_duration from "dayjs/plugin/duration"
import dayjs_plugin_toObject from "dayjs/plugin/toObject"
import dayjs_plugin_isBetween from "dayjs/plugin/isBetween"
import dayjs_plugin_minMax from "dayjs/plugin/minMax"
import dayjs_plugin_isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import dayjs_plugin_objectSupport from "dayjs/plugin/objectSupport"
import dayjs_plugin_advancedFormat from 'dayjs/plugin/advancedFormat'
import dayjs_plugin_arraySupport from 'dayjs/plugin/arraySupport'
import dayjs_plugin_isoWeek from 'dayjs/plugin/isoWeek'
// 类库 //
import * as Lodash from "lodash-es"
// 逻辑 //
import App from "./App.vue"
// 工具 //
// import * as directives from "@/common/directives"
// import * as components from "@/common/components"
// 样式 //
import "@/assets/stylesheets/overall/index.styl"
import "@/assets/stylesheets/colorset/define-css-variables.styl"
import "@icon-park/vue-next/styles/index.css"
import "@/assets/stylesheets/element-plus-customized/index.scss"

// 设置 dayjs //
dayjs.extend(dayjs_plugin_utc)
dayjs.extend(dayjs_plugin_weekday)
dayjs.extend(dayjs_plugin_toObject)
dayjs.extend(dayjs_plugin_isBetween)
dayjs.extend(dayjs_plugin_minMax)
dayjs.extend(dayjs_plugin_isSameOrBefore)
dayjs.extend(dayjs_plugin_duration)
dayjs.extend(dayjs_plugin_objectSupport)
dayjs.extend(dayjs_plugin_advancedFormat)
dayjs.extend(dayjs_plugin_arraySupport)
dayjs.extend(dayjs_plugin_isoWeek)
dayjs.locale('zh-cn', {
    weekStart: 1,
})

// 设置 app 实例 //
const app = createApp(App)

app.config.globalProperties['_'] = Lodash
app.config.globalProperties['router'] = router
app.config.globalProperties['route'] = route
app.config.globalProperties['dayjs'] = dayjs

// /**
//  * 凡是自己写在 "@/common/components" 内的公共指令、组件，一定是被应用使用到的，直接统统全局注册掉。
//  */
// for (const key in directives)
// {
//     app.directive(key, (directives as any)[key])
// }
// for (const key in components)
// {
//     const component = (components as any)[key]
//     app.component(component.name, component)
// }

app.use(createPinia())    // 准备 pinia 状态库实例（任何 pinia 实例必须在 app.use(pinia_instance) 后才可以实例化）

/// <store-auto-imports>
// auto-generated by scripts/import-store //
export const store_Device = stores.useStore_Device()
export const store = stores.useStore()
app.config.globalProperties['store_Device'] = store_Device
app.config.globalProperties['store'] = store
/// </store-auto-imports>

app
    .use(router)
    .mount('body')
