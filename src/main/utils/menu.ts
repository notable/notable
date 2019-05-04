
/* IMPORT */

import * as _ from 'lodash';
import {MenuItemConstructorOptions} from 'electron';

/* MENU */

const Menu = {

  filterTemplate ( template: MenuItemConstructorOptions[] ): MenuItemConstructorOptions[] { // Removes items with `visible == false`

    return _.cloneDeepWith ( template, val => {

      if ( !_.isArray ( val ) ) return;

      return val.filter ( ele => ele && ( !ele.hasOwnProperty ( 'visible' ) || ele.visible ) ).map ( Menu.filterTemplate );

    });

  }

};

/* EXPORT */

export default Menu;
