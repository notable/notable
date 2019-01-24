
/* IMPORT */

import * as os from 'os';

/* UTILS */

const Utils = {

  pathSepRe: /(?:\/|\\)+/g,

  batchify ( batch, fn ) {

    return function ( ...args ) {
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

  globbyNormalize ( filePaths: string[] ): string[] {

    if ( os.platform () !== 'win32' ) return filePaths;

    return filePaths.map ( filePath => filePath.replace ( /(\\|\/)/g, '\\' ) );

  },

  scrollTo ( itemSelector: string, parentSelector?: string, wrapperSelector: string = '.layout-content' ) {

    const $item = $(itemSelector);

    if ( !$item.length ) return false;

    const $parent = parentSelector ? $item.closest ( parentSelector ) : $item,
          $wrapper = $parent.closest ( wrapperSelector );

    if ( !$wrapper.length ) return false;

    const itemHeight = $item.outerHeight (),
          wrapperHeight = $wrapper.height (),
          positionWithinParent = ( $parent !== $item ) ? $item.getRect ().top - $parent.getRect ().top : 0,
          position = $parent.position ().top + positionWithinParent,
          scrollTop = $wrapper[0].scrollTop;

    if ( position < scrollTop ) { // Scroll up

      $wrapper[0].scrollTop = position - wrapperHeight + itemHeight;

    } else if ( ( position + itemHeight ) > ( scrollTop + wrapperHeight ) ) { // Scroll down

      $wrapper[0].scrollTop = position;

    }

    return true;

  },

  qsaWait ( selector: string ): Promise<any> { // Return the found elements as soon as they appear in the DOM

    let iteration = 0;

    return new Promise ( resolve => {

      const loop = () => {

        if ( iteration++ >= 2500 ) return resolve (); // Something unexpected probably happened, stop checking

        const $ele = $(selector);

        if ( !$ele.length ) return requestAnimationFrame ( loop );

        resolve ( $ele );

      };

      loop ();

    });

  }

};

/* EXPORT */

export default Utils;
