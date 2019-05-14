
/* IMPORT */

const fs = require ( 'fs' ),
      path = require ( 'path' );

/* FIX LATEST WINDOWS */

//TODO: Remove this once the upstream bug has been fixed //URL: https://github.com/electron-userland/electron-builder/issues/3894

function fixLatestWindows () {

  const latestWindowsPath = path.join ( process.cwd (), 'releases', 'latest.yml' );

  if ( !fs.existsSync ( latestWindowsPath ) ) return;

  const content = fs.readFileSync ( latestWindowsPath, { encoding: 'utf8' } ),
        contentNext = content.replace ( /notable-setup-(.*?)\.exe/gi, 'Notable.Setup.$1.exe' );

  fs.writeFileSync ( latestWindowsPath, contentNext );

}

/* EXPORT */

module.exports = fixLatestWindows;
