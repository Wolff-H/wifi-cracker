/**
 * @TODO 添加 hex 支持。（中文 <name> 可能不被识别，需要转译到 hex）
 * @param params 
 * @returns 
 */
export default function composeWlanProfile(params: {
    ssid: string
    authentication: string
    random_mac: boolean
    // password: string
}): string
{
    const randomization_seed = params.random_mac ? Math.floor(Math.random() * 10 ** 9) : 0

    let _authentication: 'open' | 'WPA3SAE' | 'WPA2PSK' | 'WPA2' | 'WPAPSK' = 'open'

    if (params.authentication.includes('WPA3')) _authentication = 'WPA3SAE'
    else if (params.authentication.includes('WPA2')) _authentication = 'WPA2PSK'
    else if (params.authentication.includes('WPA')) _authentication = 'WPAPSK'
    else _authentication = 'open' // WEP or Open

    return `\
<?xml version="1.0"?>
<WLANProfile xmlns="http://www.microsoft.com/networking/WLAN/profile/v1">
	<name>${params.ssid}</name>
	<SSIDConfig>
		<SSID>
			<name>${params.ssid}</name>
		</SSID>
	</SSIDConfig>
	<connectionType>ESS</connectionType>
	<connectionMode>manual</connectionMode>
	<MSM>
		<security>
			<authEncryption>
				<authentication>${_authentication}</authentication>
				<encryption>${_authentication === 'open' ? 'none' : 'AES'}</encryption>
				<useOneX>false</useOneX>
				<transitionMode xmlns="http://www.microsoft.com/networking/WLAN/profile/v4">true</transitionMode>
			</authEncryption>
            <sharedKey>
				<keyType>passPhrase</keyType>
				<protected>false</protected>
				<keyMaterial>__UNSET__</keyMaterial>
			</sharedKey>
		</security>
	</MSM>
	<MacRandomization xmlns="http://www.microsoft.com/networking/WLAN/profile/v3">
		<enableRandomization>${params.random_mac}</enableRandomization>
		<randomizationSeed>${randomization_seed}</randomizationSeed>
	</MacRandomization>
</WLANProfile>
`
}