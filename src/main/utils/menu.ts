
/* IMPORT */

import * as _ from 'lodash';

/* MENU */

const Menu = {

  filterTemplate ( template ) { // Removes items with `visible == false`

    return _.cloneDeepWith ( template, val => {

      if ( !_.isArray ( val ) ) return;

      return val.filter ( ele => !_.isObject ( ele ) || !ele.hasOwnProperty ( 'visible' ) || ele.visible ).map ( Menu.filterTemplate );

    });

  }

};

/* EXPORT */

export default Menu;
