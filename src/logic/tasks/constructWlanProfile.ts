export default function constructWlanProfile(params: {
    ssid: string
    authentication: string
    encryption: string
    random_mac: boolean
}): string
{
    const randomization_seed = params.random_mac ? Math.floor(Math.random() * 10 ** 9) : 0

    return `\
<?xml version="1.0"?>
<WLANProfile xmlns="http://www.microsoft.com/networking/WLAN/profile/v1">
	<name>${'wc__' + params.ssid}</name>
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
		</security>
	</MSM>
	<MacRandomization xmlns="http://www.microsoft.com/networking/WLAN/profile/v3">
		<enableRandomization>false</enableRandomization>
		<randomizationSeed>${randomization_seed}</randomizationSeed>
	</MacRandomization>
</WLANProfile>
`
}