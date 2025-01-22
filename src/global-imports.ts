/**
 * 这个目录放默认要自动（由 unplugin-auto-import 执行）全局导入的模块。
 */
export * as _ from "lodash-es"
export { clone as cloneShallow, cloneDeep as clone } from "lodash-es"
export { default as router, route } from "@/router"
export { default as dayjs } from "dayjs"