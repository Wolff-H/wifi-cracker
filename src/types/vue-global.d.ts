import type { LoDashStatic } from "lodash"
import type { Router, RouteLocationNormalizedLoadedGeneric } from "vue-router"
import dayjs from "dayjs"



/**
 * 必须声明到 declare module "@vue/runtime-core"。Vue 官方文档上声明到 declare module "vue" 是错的。
 */
declare module "@vue/runtime-core"
{
    export interface ComponentCustomProperties
    {
        _: LoDashStatic
        router: Router
        route: RouteLocationNormalizedLoadedGeneric
        dayjs: typeof dayjs
    }
}
