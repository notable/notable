## Summary
How do I create packages? See https://chocolatey.org/docs/create-packages

If you are submitting packages to the community feed (https://chocolatey.org)
always try to ensure you have read, understood and adhere to the create
packages wiki link above.

## Automatic Packaging Updates?
Consider making this package an automatic package, for the best 
maintainability over time. Read up at https://chocolatey.org/docs/automatic-packages

## Shim Generation
Any executables you include in the package or download (but don't call 
install against using the built-in functions) will be automatically shimmed.

This means those executables will automatically be included on the path.
Shim generation runs whether the package is self-contained or uses automation 
scripts. 

By default, these are considered console applications.

If the application is a GUI, you should create an empty file next to the exe 
named 'name.exe.gui' e.g. 'bob.exe' would need a file named 'bob.exe.gui'.
See https://chocolatey.org/docs/create-packages#how-do-i-set-up-shims-for-applications-that-have-a-gui

If you want to ignore the executable, create an empty file next to the exe 
named 'name.exe.ignore' e.g. 'bob.exe' would need a file named 
'bob.exe.ignore'. 
See https://chocolatey.org/docs/create-packages#how-do-i-exclude-executables-from-getting-shims

## Self-Contained? 
If you have a self-contained package, you can remove the automation scripts 
entirely and just include the executables, they will automatically get shimmed, 
which puts them on the path. Ensure you have the legal right to distribute 
the application though. See https://chocolatey.org/docs/legal. 

You should read up on the Shim Generation section to familiarize yourself 
on what to do with GUI applications and/or ignoring shims.

## Automation Scripts
You have a powerful use of Chocolatey, as you are using PowerShell. So you
can do just about anything you need. Choco has some very handy built-in 
functions that you can use, these are sometimes called the helpers.

### Built-In Functions
https://chocolatey.org/docs/helpers-reference

A note about a couple:
* Get-BinRoot - this is a horribly named function that doesn't do what new folks think it does. It gets you the 'tools' root, which by default is set to 'c:\tools', not the chocolateyInstall bin folder - see https://chocolatey.org/docs/helpers-get-tools-location
* Install-BinFile - used for non-exe files - executables are automatically shimmed... - see https://chocolatey.org/docs/helpers-install-bin-file
* Uninstall-BinFile - used for non-exe files - executables are automatically shimmed - see https://chocolatey.org/docs/helpers-uninstall-bin-file

### Getting package specific information
Use the package parameters pattern - see https://chocolatey.org/docs/how-to-parse-package-parameters-argument

### Need to mount an ISO?
https://chocolatey.org/docs/how-to-mount-an-iso-in-chocolatey-package

### Environment Variables
Chocolatey makes a number of environment variables available (You can access any of these with $env:TheVariableNameBelow):

 * TEMP/TMP - Overridden to the CacheLocation, but may be the same as the original TEMP folder
 * ChocolateyInstall - Top level folder where Chocolatey is installed
 * ChocolateyPackageName - The name of the package, equivalent to the `<id />` field in the nuspec (0.9.9+)
 * ChocolateyPackageTitle - The title of the package, equivalent to the `<title />` field in the nuspec (0.10.1+)
 * ChocolateyPackageVersion - The version of the package, equivalent to the `<version />` field in the nuspec (0.9.9+)
 * ChocolateyPackageFolder - The top level location of the package folder  - the folder where Chocolatey has downloaded and extracted the NuGet package, typically `C:\ProgramData\chocolatey\lib\packageName`.

#### Advanced Environment Variables
The following are more advanced settings:

 * ChocolateyPackageParameters - Parameters to use with packaging, not the same as install arguments (which are passed directly to the native installer). Based on `--package-parameters`. (0.9.8.22+)
 * CHOCOLATEY_VERSION - The version of Choco you normally see. Use if you are 'lighting' things up based on choco version. (0.9.9+) - Otherwise take a dependency on the specific version you need. 
 * ChocolateyForceX86 = If available and set to 'true', then user has requested 32bit version. (0.9.9+) - Automatically handled in built in Choco functions. 
 * OS_PLATFORM - Like Windows, OSX, Linux. (0.9.9+)
 * OS_VERSION - The version of OS, like 6.1 something something for Windows. (0.9.9+)
 * OS_NAME - The reported name of the OS. (0.9.9+)
 * USER_NAME = The user name (0.10.6+)
 * USER_DOMAIN = The user domain name (could also be local computer name) (0.10.6+)
 * IS_PROCESSELEVATED = Is the process elevated? (0.9.9+)
 * IS_SYSTEM = Is the user the system account? (0.10.6+)
 * IS_REMOTEDESKTOP = Is the user in a terminal services session? (0.10.6+)
 * ChocolateyToolsLocation - formerly 'ChocolateyBinRoot' ('ChocolateyBinRoot' will be removed with Chocolatey v2.0.0), this is where tools being installed outside of Chocolatey packaging will go. (0.9.10+)

#### Set By Options and Configuration
Some environment variables are set based on options that are passed, configuration and/or features that are turned on:

 * ChocolateyEnvironmentDebug - Was `--debug` passed? If using the built-in PowerShell host, this is always true (but only logs debug messages to console if `--debug` was passed) (0.9.10+)
 * ChocolateyEnvironmentVerbose - Was `--verbose` passed? If using the built-in PowerShell host, this is always true (but only logs verbose messages to console if `--verbose` was passed). (0.9.10+)
 * ChocolateyForce - Was `--force` passed? (0.9.10+)
 * ChocolateyForceX86 - Was `-x86` passed? (CHECK)
 * ChocolateyRequestTimeout - How long before a web request will time out. Set by config `webRequestTimeoutSeconds` (CHECK)
 * ChocolateyResponseTimeout - How long to wait for a download to complete? Set by config `commandExecutionTimeoutSeconds` (CHECK)
 * ChocolateyPowerShellHost - Are we using the built-in PowerShell host? Set by `--use-system-powershell` or the feature `powershellHost` (0.9.10+)

#### Business Edition Variables

 * ChocolateyInstallArgumentsSensitive - Encrypted arguments passed from command line `--install-arguments-sensitive` that are not logged anywhere. (0.10.1+ and licensed editions 1.6.0+)
 * ChocolateyPackageParametersSensitive - Package parameters passed from command line `--package-parameters-senstivite` that are not logged anywhere.  (0.10.1+ and licensed editions 1.6.0+)
 * ChocolateyLicensedVersion - What version is the licensed edition on? 
 * ChocolateyLicenseType - What edition / type of the licensed edition is installed?
 * USER_CONTEXT - The original user context - different when self-service is used (Licensed v1.10.0+)
 
#### Experimental Environment Variables
The following are experimental or use not recommended:

 * OS_IS64BIT = This may not return correctly - it may depend on the process the app is running under (0.9.9+)
 * CHOCOLATEY_VERSION_PRODUCT = the version of Choco that may match CHOCOLATEY_VERSION but may be different (0.9.9+) - based on git describe
 * IS_ADMIN = Is the user an administrator? But doesn't tell you if the process is elevated. (0.9.9+)
 * IS_REMOTE = Is the user in a remote session? (0.10.6+)

#### Not Useful Or Anti-Pattern If Used

 * ChocolateyInstallOverride = Not for use in package automation scripts. Based on `--override-arguments` being passed. (0.9.9+)
 * ChocolateyInstallArguments = The installer arguments meant for the native installer. You should use chocolateyPackageParameters intead. Based on `--install-arguments` being passed. (0.9.9+)
 * ChocolateyIgnoreChecksums - Was `--ignore-checksums` passed or the feature `checksumFiles` turned off? (0.9.9.9+)
 * ChocolateyAllowEmptyChecksums - Was `--allow-empty-checksums` passed or the feature `allowEmptyChecksums` turned on? (0.10.0+)
 * ChocolateyAllowEmptyChecksumsSecure - Was `--allow-empty-checksums-secure` passed or the feature `allowEmptyChecksumsSecure` turned on? (0.10.0+)
 * ChocolateyCheckLastExitCode - Should Chocolatey check LASTEXITCODE? Is the feature `scriptsCheckLastExitCode` turned on? (0.10.3+)
 * ChocolateyChecksum32 - Was `--download-checksum` passed? (0.10.0+)
 * ChocolateyChecksumType32 - Was `--download-checksum-type` passed? (0.10.0+)
 * ChocolateyChecksum64 - Was `--download-checksum-x64` passed? (0.10.0)+
 * ChocolateyChecksumType64 - Was `--download-checksum-type-x64` passed? (0.10.0)+
 * ChocolateyPackageExitCode - The exit code of the script that just ran - usually set by `Set-PowerShellExitCode` (CHECK)
 * ChocolateyLastPathUpdate - Set by Chocolatey as part of install, but not used for anything in particular in packaging.
 * ChocolateyProxyLocation - The explicit proxy location as set in the configuration `proxy` (0.9.9.9+)
 * ChocolateyDownloadCache - Use available download cache? Set by `--skip-download-cache`, `--use-download-cache`, or feature `downloadCache` (0.9.10+ and licensed editions 1.1.0+)
 * ChocolateyProxyBypassList - Explicitly set locations to ignore in configuration `proxyBypassList` (0.10.4+)
 * ChocolateyProxyBypassOnLocal - Should the proxy bypass on local connections? Set based on configuration `proxyBypassOnLocal` (0.10.4+)
 * http_proxy - Set by original `http_proxy` passthrough, or same as `ChocolateyProxyLocation` if explicitly set. (0.10.4+)
 * https_proxy - Set by original `https_proxy` passthrough, or same as `ChocolateyProxyLocation` if explicitly set. (0.10.4+)
 * no_proxy- Set by original `no_proxy` passthrough, or same as `ChocolateyProxyBypassList` if explicitly set. (0.10.4+)

