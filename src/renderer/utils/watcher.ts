
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

  let stats = {}, // filePath => fs.Stats //TODO: Maybe make this a weak map
      locks = {}, // id => releaseFn
      renameTimeout = 150; // Amount of time to wait for the complementary add/unlink event

  /* HELPERS */

  function getId ( filePath: string, stat?: fs.Stats ): string | undefined {

    stat = stat || stats[filePath];

    if ( !stat ) {

      try {

        stat = fs.statSync ( filePath );

      } catch {

        return;

      }

    }

    stats[filePath] = stat; // Caching for future use

    return `${stat.ino}`; //TODO: Switch to BigInt (https://github.com/nodejs/node/issues/12115)

  }

  function getLock ( id: string | undefined, timeout: number, handlers: { free: Function, override: Function, overridden: Function } ) { //TODO: Find a more appropriate name

    if ( !id ) return handlers.free (); // Free

    const release = locks[id];

    if ( release ) { // Override

      handlers.override ( release () );

    } else {

      const timeoutId = setTimeout ( () => { // Free

        delete locks[id];

        handlers.free ();

      }, timeout );

      locks[id] = () => { // Overridden // Function for releasing the lock

        clearTimeout ( timeoutId );

        delete locks[id];

        return handlers.overridden ();

      };

    }

  }

  function emit ( event: string, args: any[] ) {

    if ( !callbacks[event] ) return;

    callbacks[event].apply ( undefined, args );

  }

  /* HANDLERS */

  function change ( filePath: string, stats?: fs.Stats ) {

    emit ( 'change', [filePath, stats] );

  }

  function add ( filePath: string, stats?: fs.Stats ) {

    const id = getId ( filePath, stats );

    getLock ( id, renameTimeout, {
      free: () => emit ( 'add', [filePath, stats] ),
      override: prevPath => emit ( 'rename', [prevPath, filePath, stats] ),
      overridden: () => filePath
    });

  }

  function unlink ( filePath: string ) {

    const id = getId ( filePath );

    getLock ( id, renameTimeout, {
      free: () => emit ( 'unlink', [filePath] ),
      override: newPath => emit ( 'rename', [filePath, newPath] ),
      overridden: () => filePath
    });

  }

  /* CHOKIDAR */

  const chokidarOptions = _.merge ( {}, options, { ignoreInitial: false } );

  return chokidar.watch ( root, chokidarOptions ).on ( 'add', add ).on ( 'change', change ).on ( 'unlink', unlink );

}

/* EXPORT */

export default watcher;
