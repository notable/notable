
/* IMPORT */

import debugging from './debugging';
import render from './render';

/* RENDERER */

debugging ();
render ();

/* HOT MODULE REPLACEMENT */

if ( module.hot ) {

  module.hot.accept ( './render', () => {
    require ( './render' ).default ();
  });

}
