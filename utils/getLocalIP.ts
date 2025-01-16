import os from "node:os"



/**
 * 获取本机在网络上的 ipv4 地址。
 * @returns 
 */
export default function getLocalIP()
{
    const network_interfaces = os.networkInterfaces()
    let local_ip = ''
    
    for (const key in network_interfaces)
    {
        const ni = network_interfaces[key]
    
        if (ni)
        {
            for (const detail of ni)
            {
                if (detail.family === 'IPv4' && !detail.internal)
                {
                    local_ip = detail.address
                    break
                }
            }
        }
    
        if (local_ip) break
    }

    return local_ip
}
