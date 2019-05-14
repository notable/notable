
/* IMPORT */

const fixLatestLinux = require ( './fix_latest_linux' );

/* AFTER BUILD */

function afterBuild () {

  fixLatestLinux ();

  return [];

}

/* EXPORT */

module.exports = afterBuild;
