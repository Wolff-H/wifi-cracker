/**
 * @TODO 添加 hex 支持。（中文 <name> 可能不被识别，需要转译到 hex）
 * @param params 
 * @returns 
 */
export default function composetWlanProfile(params: {
    ssid: string
    authentication: string
    encryption: string
    random_mac: boolean
    password: string
}): string
{
    const randomization_seed = params.random_mac ? Math.floor(Math.random() * 10 ** 9) : 0

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
				<authentication>${params.authentication}</authentication>
				<encryption>${params.encryption}</encryption>
				<useOneX>false</useOneX>
				<transitionMode xmlns="http://www.microsoft.com/networking/WLAN/profile/v4">true</transitionMode>
			</authEncryption>
            <sharedKey>
				<keyType>passPhrase</keyType>
				<protected>false</protected>
				<keyMaterial>${params.password}</keyMaterial>
			</sharedKey>
		</security>
	</MSM>
	<MacRandomization xmlns="http://www.microsoft.com/networking/WLAN/profile/v3">
		<enableRandomization>false</enableRandomization>
		<randomizationSeed>${randomization_seed}</randomizationSeed>
	</MacRandomization>
</WLANProfile>
`
}