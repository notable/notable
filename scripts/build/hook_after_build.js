
/* IMPORT */

const fixLatestLinux = require ( './fix_latest_linux' ),
      fixLatestWin = require ( './fix_latest_win' );

/* AFTER BUILD */

function afterBuild () {

  fixLatestLinux ();
  fixLatestWin ();

  return [];

}

/* EXPORT */

module.exports = afterBuild;
