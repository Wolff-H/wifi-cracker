export default async function exit()
{
    const app_state: WC.AppStatePersistence =
    {
        ctime: Date.now(),
        state:
        {
            tasks: store_Tasks.$state,
        },
    }

    await invoke('save_app_state', {
        content: JSON.stringify(app_state),
    })

    await invoke('exit_app')
}