export default async function initialize()
{
    console.log('initializing')

    // ...

    await invoke('get_device_info').then((device_info) => {
        console.log('device_info :', device_info)

        store_Device.device_info = device_info
    })

    console.log('initialized')
}