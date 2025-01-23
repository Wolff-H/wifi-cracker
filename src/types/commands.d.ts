declare namespace Commands
{
    interface Response
    {
        get_computer_info: string
        get_device_info: WC.TimestampedResponse<string>
    }
}