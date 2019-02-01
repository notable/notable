$ErrorActionPreference = 'Stop'
$Arguments = [ordered]@ {
Name = 'notable'
Version = '1.3.0'
CSumNum = 'AC580870272AFE19985B78CD88CBDA4618D59D89649547813BD7F0C903A7B6BC'
Ctype = 'sha256'
silentArgs = '/qn /norestart /S /s'
type = 'exe'
Exe = "$Arguments[0].$Arguments[1].$Arguments[5]"
Url = "https://github.com/fabiospampinato/notable/releases/download/v$Arguments[1]/$Arguments[6]"
validExitCodes = @(0, 3010, 1605, 1614, 1641)
}
Install-ChocolateyPackage $Arguments
Install-ChocolateyFileAssociation '.md' $Tool
Install-ChocolateyShortcut "$env:USERPROFILE\Desktop\$Name.lnk" $Tool
