
/* IMPORT */

import CallsBatch from 'calls-batch';
import * as os from 'os';

/* UTILS */

const Utils = {

  pathSepRe: /(?:\/|\\)+/g,

  batchify ( batch: CallsBatch.type, fn: Function ) {

    return function ( ...args: any[] ) {
      batch.add ( fn, args );
    };

  },

  encodeFilePath ( filePath: string ): string {

    return encodeURI ( filePath.replace ( Utils.pathSepRe, '/' ) );

  },

  getFirstUnemptyLine ( str: string ): string | null {

    const match = str.match ( /^.*?\S.*$/m );

    return match && match[0];

  },

  normalizeFilePaths ( filePaths: string[] ): string[] {

    if ( os.platform () !== 'win32' ) return filePaths;

    return filePaths.map ( filePath => filePath.replace ( Utils.pathSepRe, '\\' ) );

  },

  qsaWait ( selector: string, context?: HTMLElement ): Promise<Cash | undefined> { // Return the found elements as soon as they appear in the DOM

    let iteration = 0;

    return new Promise ( resolve => {

      const loop = () => {

        if ( iteration++ >= 2500 ) return resolve (); // Something unexpected probably happened, stop checking

        const $ele = $(selector, context);

        if ( !$ele.length ) return requestAnimationFrame ( loop );

        resolve ( $ele );

      };

      loop ();

    });

  }

};

/* EXPORT */

export default Utils;
