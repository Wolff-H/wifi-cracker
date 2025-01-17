
import { createRouter, createWebHashHistory } from "vue-router"
import type { RouteLocationNormalizedLoadedGeneric, RouteRecordRaw } from "vue-router"
import Views from "@/ui.auto-imports"



export const routes: RouteRecordRaw[] =
[
    // 兜底404 //
    {
        path: '/:pathMatch(.*)',
        component: Views.PageNotFound,
    },
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        // redirect: '/home/front-page',
        component: Views.Home,
        children:
        [

        ],
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
})

export const route = new Proxy({}, {
    get(_target, prop: keyof RouteLocationNormalizedLoadedGeneric)
    {
        return router.currentRoute.value[prop]
    },
}) as Readonly<RouteLocationNormalizedLoadedGeneric>



export default router