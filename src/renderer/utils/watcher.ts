
/* IMPORT */

import * as watch from '@atom/watcher';

/* WATCHER */

async function watcher ( root: string, options = {}, callbacks = {} ) {

  return await watch.watchPath ( root, options, events => {
    alert ( `Received batch of ${events.length} events` );
  });

}

/* EXPORT */

export default watcher;
