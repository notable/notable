
/* IMPORT */

import * as _ from 'lodash';
import * as chokidar from 'chokidar';

/* WATCHER */

//TODO: Maybe switch to `https://github.com/Axosoft/nsfw`

function watcher ( root: string, options = {}, callbacks = {} ) {

  /* VARIABLES */

  let filesStats = {}, // filePath => fs.Stats
      renameSignalers = {}; // ino => Function

  /* HELPERS */

  function emit ( event, args ) {

    if ( !callbacks[event] ) return;

    callbacks[event].apply ( undefined, args );

  }

  /* HANDLERS */

  async function add ( filePath, stats ) {

    stats = stats || {}; // Just to be safe

    filesStats[filePath] = stats;

    const renameSignaler = renameSignalers[stats.ino];

    if ( renameSignaler ) {

      const prevPath = renameSignaler ();

      emit ( 'rename', [prevPath, filePath, stats] );

    } else {

      emit ( 'add', [filePath, stats] );

    }

  }

  function change () {

    emit ( 'change', arguments );

  }

  function unlink ( filePath ) {

    const args = arguments; //TSC

    const stats = filesStats[filePath] || {}; // Just to be safe

    const timeoutId = setTimeout ( () => { // Deleted

      delete renameSignalers[stats.ino];

      emit ( 'unlink', args );

    }, 150 );

    renameSignalers[stats.ino] = () => { // Renamed

      clearTimeout ( timeoutId );

      delete renameSignalers[stats.ino];

      return filePath;

    };

  }

  /* CHOKIDAR */

  const chokidarOptions = _.merge ( {}, options, { ignoreInitial: false } );

  return chokidar.watch ( root, chokidarOptions ).on ( 'add', add ).on ( 'change', change ).on ( 'unlink', unlink );

}

/* EXPORT */

export default watcher;
