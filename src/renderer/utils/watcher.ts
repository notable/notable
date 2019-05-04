
/* IMPORT */

import * as _ from 'lodash';
import {FSWatcher, WatchOptions} from 'chokidar';
import * as fs from 'fs';

/* IMPORT LAZY */

const laxy = require ( 'laxy' ),
      chokidar = laxy ( () => require ( 'chokidar' ) )();

/* TYPES */

type ID = string | undefined;

type Locks = {
  [id: string]: Function
};

type LockOptions = {
  locks: {
    read: Locks,
    write: Locks
  },
  handlers: {
    free: Function,
    override: Function,
    overridden: Function
  }
};

type Stats = {
  [index: string]: fs.Stats
};

type Event = 'add' | 'change' | 'rename' | 'unlink';

type Handlers = {
  add?: Function,
  change?: Function,
  rename?: Function,
  unlink?: Function
};

/* WATCHER */

//TODO: Publish as `graceful-chokidar` or something
//TODO: Maybe switch to `https://github.com/Axosoft/nsfw`

function watcher ( root: string, options: WatchOptions = {}, handlers: Handlers = {} ): FSWatcher {

  /* VARIABLES */

  let stats: Stats = {}, // filePath => fs.Stats //TODO: If these values aren't accessed within X seconds they should be removed, for cleaning up some memory
      locksAdd: Locks = {}, // id => releaseFn
      locksUnlink: Locks = {}, // id => releaseFn
      renameTimeout = 150; // Amount of time to wait for the complementary add/unlink event

  /* HELPERS */

  function getId ( filePath: string, stat?: fs.Stats ): ID {

    stat = stat || stats[filePath];

    if ( !stat ) {

      try {

        stat = fs.statSync ( filePath );

      } catch {

        return;

      }

    }

    stats[filePath] = stat; // Caching for future use

    if ( !stat.ino ) return;

    return `${stat.ino}`; //TODO: Switch to BigInt (https://github.com/nodejs/node/issues/12115)

  }

  function getLock ( id: ID, timeout: number, options: LockOptions ) {

    if ( !id ) return options.handlers.free (); // Free

    const release = options.locks.read[id];

    if ( release ) { // Override

      options.handlers.override ( release () );

    } else {

      const timeoutId = setTimeout ( () => { // Free

        delete options.locks.write[id];

        options.handlers.free ();

      }, timeout );

      options.locks.write[id] = () => { // Overridden // Function for releasing the lock

        clearTimeout ( timeoutId );

        delete options.locks.write[id];

        return options.handlers.overridden ();

      };

    }

  }

  function emit ( event: Event, args: any[] ) {

    const handler = handlers[event];

    if ( !handler ) return;

    handler.apply ( undefined, args );

  }

  /* HANDLERS */

  function change ( filePath: string, stats?: fs.Stats ) {

    emit ( 'change', [filePath, stats] );

  }

  function add ( filePath: string, stats?: fs.Stats ) {

    const id = getId ( filePath, stats );

    getLock ( id, renameTimeout, {
      locks: {
        read: locksUnlink,
        write: locksAdd
      },
      handlers: {
        free: () => emit ( 'add', [filePath, stats] ),
        override: ( prevPath: string ) => emit ( 'rename', [prevPath, filePath, stats] ),
        overridden: () => filePath
      }
    });

  }

  function unlink ( filePath: string ) {

    const id = getId ( filePath );

    getLock ( id, renameTimeout, {
      locks: {
        read: locksAdd,
        write: locksUnlink
      },
      handlers: {
        free: () => emit ( 'unlink', [filePath] ),
        override: ( newPath: string ) => emit ( 'rename', [filePath, newPath] ),
        overridden: () => filePath
      }
    });

  }

  /* CHOKIDAR */

  const chokidarOptions = _.merge ( {}, options, { ignoreInitial: false } );

  return chokidar.watch ( root, chokidarOptions ).on ( 'add', add ).on ( 'change', change ).on ( 'unlink', unlink );

}

/* EXPORT */

export default watcher;
