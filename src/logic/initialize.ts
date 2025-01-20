export default async function initialize()
{
    console.log('initializing')

    // ...

    await invoke('get_computer_info').then((response) => {
        console.log('computer_info :', response)

        store_Device.computer_info = response
    })

    await invoke('get_device_info').then((response) => {
        console.log('device_info :', response)

        store_Device.device_info = response
    })

    console.log('initialized')
}