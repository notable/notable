
/* IMPORT */

const fs = require ( 'fs' ),
      path = require ( 'path' );

/* FIX LATEST LINUX */

//TODO: Remove this once the upstream bug has been fixed //URL: https://github.com/electron-userland/electron-builder/issues/3890

function fixLatestLinux () {

  const latestLinuxPath = path.join ( process.cwd (), 'releases', 'latest-linux.yml' );

  if ( !fs.existsSync ( latestLinuxPath ) ) return;

  const content = fs.readFileSync ( latestLinuxPath, { encoding: 'utf8' } ),
        contentNext = content.replace ( /notable-(.*?)-x86_64\.AppImage/gi, 'Notable.$1.AppImage' );

  fs.writeFileSync ( latestLinuxPath, contentNext );

}

/* EXPORT */

module.exports = fixLatestLinux;
