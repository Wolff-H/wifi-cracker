// auto-generated by scripts/import-store //
// @ts-nocheck
import useStore_Device from "@/store/Device/index"
import useStore from "@/store/index"
import useStore_Scan from "@/store/Scan/index"
import useStore_Tasks from "@/store/Tasks/index"

export
{
    useStore_Device,
    useStore,
    useStore_Scan,
    useStore_Tasks,
}

declare module "@vue/runtime-core"
{
    export interface ComponentCustomProperties
    {
        store_Device: ReturnType<typeof useStore_Device>
        store: ReturnType<typeof useStore>
        store_Scan: ReturnType<typeof useStore_Scan>
        store_Tasks: ReturnType<typeof useStore_Tasks>
    }
}
