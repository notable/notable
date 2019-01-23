
/* IMPORT */

import * as _ from 'lodash';
import * as fs from 'fs';

/* IMPORT LAZY */

const laxy = require ( 'laxy' ),
      chokidar = laxy ( () => require ( 'chokidar' ) )();

/* WATCHER */

//TODO: Maybe switch to `https://github.com/Axosoft/nsfw`

function watcher ( root: string, options = {}, callbacks = {} ) {

  /* VARIABLES */

  let filesStats = {}, // filePath => fs.Stats
      renameSignalers = {}, // ino => Function
      renameTimeout = 150; // Amount of time to wait for the complementary add/unlink event

  /* HELPERS */

  function emit ( event: string, args: any[] ) {

    if ( !callbacks[event] ) return;

    callbacks[event].apply ( undefined, args );

  }

  /* HANDLERS */

  function change ( filePath: string, stats: fs.Stats ) {

    emit ( 'change', [filePath, stats] );

  }

  function add ( filePath: string, stats: fs.Stats ) {

    stats = stats || {}; // Just to be safe

    filesStats[filePath] = stats;

    const renameSignaler = renameSignalers[stats.ino];

    if ( renameSignaler ) { // Rename

      const prevPath = renameSignaler ();

      emit ( 'rename', [prevPath, filePath, stats] );

    } else {

      const timeoutId = setTimeout ( () => { // Added

        delete renameSignalers[stats.ino];

        emit ( 'add', [filePath, stats] );

      }, renameTimeout );

      renameSignalers[stats.ino] = () => { // Renamed

        clearTimeout ( timeoutId );

        delete renameSignalers[stats.ino];

        return filePath;

      };

    }

  }

  function unlink ( filePath: string ) {

    const stats = filesStats[filePath] || {}; // Just to be safe

    const renameSignaler = renameSignalers[stats.ino];

    if ( renameSignaler ) { // Rename

      const newPath = renameSignaler ();

      emit ( 'rename', [filePath, newPath, stats] );

    } else {

      const timeoutId = setTimeout ( () => { // Deleted

        delete renameSignalers[stats.ino];

        emit ( 'unlink', [filePath] );

      }, renameTimeout );

      renameSignalers[stats.ino] = () => { // Renamed

        clearTimeout ( timeoutId );

        delete renameSignalers[stats.ino];

        return filePath;

      };

    }

  }

  /* CHOKIDAR */

  const chokidarOptions = _.merge ( {}, options, { ignoreInitial: false } );

  return chokidar.watch ( root, chokidarOptions ).on ( 'add', add ).on ( 'change', change ).on ( 'unlink', unlink );

}

/* EXPORT */

export default watcher;
