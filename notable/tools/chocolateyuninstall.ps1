# IMPORTANT: Before releasing this package, copy/paste the next 2 lines into PowerShell to remove all comments from this file:
#   $f='c:\path\to\thisFile.ps1'
#   gc $f | ? {$_ -notmatch "^\s*#"} | % {$_ -replace '(^.*?)\s*?[^``]#.*','$1'} | Out-File $f+".~" -en utf8; mv -fo $f+".~" $f

## NOTE: In 80-90% of the cases (95% with licensed versions due to Package Synchronizer and other enhancements),
## AutoUninstaller should be able to detect and handle registry uninstalls without a chocolateyUninstall.ps1.
## See https://chocolatey.org/docs/commands-uninstall
## and https://chocolatey.org/docs/helpers-uninstall-chocolatey-package

## If this is an MSI, ensure 'softwareName' is appropriate, then clean up comments and you are done.
## If this is an exe, change fileType, silentArgs, and validExitCodes

$ErrorActionPreference = 'Stop'; # stop on all errors
$packageArgs = @{
  packageName   = $env:ChocolateyPackageName
  softwareName  = 'notable*'  #part or all of the Display Name as you see it in Programs and Features. It should be enough to be unique
  fileType      = 'EXE_MSI_OR_MSU' #only one of these: MSI or EXE (ignore MSU for now)
  # MSI
  silentArgs    = "/qn /norestart"
  validExitCodes= @(0, 3010, 1605, 1614, 1641) # https://msdn.microsoft.com/en-us/library/aa376931(v=vs.85).aspx
  # OTHERS
  # Uncomment matching EXE type (sorted by most to least common)
  #silentArgs   = '/S'           # NSIS
  #silentArgs   = '/VERYSILENT /SUPPRESSMSGBOXES /NORESTART /SP-' # Inno Setup
  #silentArgs   = '/s'           # InstallShield
  #silentArgs   = '/s /v"/qn"'   # InstallShield with MSI
  #silentArgs   = '/s'           # Wise InstallMaster
  #silentArgs   = '-s'           # Squirrel
  #silentArgs   = '-q'           # Install4j
  #silentArgs   = '-s -u'        # Ghost
  # Note that some installers, in addition to the silentArgs above, may also need assistance of AHK to achieve silence.
  #silentArgs   = ''             # none; make silent with input macro script like AutoHotKey (AHK)
                                 #       https://chocolatey.org/packages/autohotkey.portable
  #validExitCodes= @(0) #please insert other valid exit codes here
}

$uninstalled = $false
# Get-UninstallRegistryKey is new to 0.9.10, if supporting 0.9.9.x and below,
# take a dependency on "chocolatey-core.extension" in your nuspec file.
# This is only a fuzzy search if $softwareName includes '*'. Otherwise it is 
# exact. In the case of versions in key names, we recommend removing the version
# and using '*'.
[array]$key = Get-UninstallRegistryKey -SoftwareName $packageArgs['softwareName']

if ($key.Count -eq 1) {
  $key | % { 
    $packageArgs['file'] = "$($_.UninstallString)"
    if ($packageArgs['fileType'] -eq 'MSI') {
      # The Product Code GUID is all that should be passed for MSI, and very 
      # FIRST, because it comes directly after /x, which is already set in the 
      # Uninstall-ChocolateyPackage msiargs (facepalm).
      $packageArgs['silentArgs'] = "$($_.PSChildName) $($packageArgs['silentArgs'])"
      
      # Don't pass anything for file, it is ignored for msi (facepalm number 2) 
      # Alternatively if you need to pass a path to an msi, determine that and 
      # use it instead of the above in silentArgs, still very first
      $packageArgs['file'] = ''
    }

    Uninstall-ChocolateyPackage @packageArgs
  }
} elseif ($key.Count -eq 0) {
  Write-Warning "$packageName has already been uninstalled by other means."
} elseif ($key.Count -gt 1) {
  Write-Warning "$($key.Count) matches found!"
  Write-Warning "To prevent accidental data loss, no programs will be uninstalled."
  Write-Warning "Please alert package maintainer the following keys were matched:"
  $key | % {Write-Warning "- $($_.DisplayName)"}
}

## OTHER POWERSHELL FUNCTIONS
## https://chocolatey.org/docs/helpers-reference
#Uninstall-ChocolateyZipPackage $packageName # Only necessary if you did not unpack to package directory - see https://chocolatey.org/docs/helpers-uninstall-chocolatey-zip-package
#Uninstall-ChocolateyEnvironmentVariable # 0.9.10+ - https://chocolatey.org/docs/helpers-uninstall-chocolatey-environment-variable 
#Uninstall-BinFile # Only needed if you used Install-BinFile - see https://chocolatey.org/docs/helpers-uninstall-bin-file
## Remove any shortcuts you added in the install script.

