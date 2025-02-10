export function getCrackStrategiesIterationsTotal(strategies: WC.CrackStrategy[]/*, custom_strategies?: string[]*/): number
{
    let total = 0

    for (const strategy of strategies)
    {
        switch (strategy)
        {
            case 'passwordbook':
                total += 200 // TODO: 从真实密码本文件中获取总数
                break
            case 'digits_8':
                total += 10 ** 8
                break
            case 'digits_9':
                total += 10 ** 9
                break
            case 'digits_10':
                total += 10 ** 10
                break
            case 'phone_number':
                total += 26 * 10 ** 8
                break
            default:
                break
        }
    }

    return total
}