
/* IMPORT */

import {clipboard} from 'electron';
import {Container} from 'overstated';
import Critical from '@renderer/utils/critical';

/* SKELETON */

class Skeleton extends Container<SkeletonState, MainCTX> {

  /* API */

  get = (): string => {

    function transform ( doc: Document ) {
      const $html = $(doc.documentElement);
      $html.find ( 'body > :not(#app)' ).remove ();
      $html.find ( '#app' ).children ().not ( '#main' ).remove ();
      $html.find ( '#main' ).children ().not ( '#sidebar, #middlebar, #mainbar' ).remove ();
      $html.find ( '#sidebar' ).children ().remove ();
      $html.find ( '.layout-header, .layout-content' ).children ().remove ();
      $html.find ( '#mainbar' ).children ().not ( '.layout-header, .layout-content' ).remove ();
      $html.find ( '.editor, .preview' ).remove ();
      $html.find ( '*' ).removeAttr ( 'style' );
      $html.find ( '*' ).removeClass ( 'centerer xsmall resizable' );
      $html.find ( 'head' ).children ().not ( 'meta[charset]' ).remove ();
      $html.find ( 'html' ).removeAttr ( 'class' );
    }

    return Critical.get ({ transform });

  }

  getToClipboard = (): void => {

    const skeleton = this.get ();

    clipboard.writeText ( skeleton );

    console.log ( 'Skeleton copied to the clipboard!' );

  }

}

/* EXPORT */

export default Skeleton;
