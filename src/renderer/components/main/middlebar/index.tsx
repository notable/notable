
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Content from './content';
import Header from './header';
import Toolbar from './toolbar';

/* MIDDLEBAR */

const Middlebar = ({ isFocus, isZen }) => {

  if ( isFocus || isZen ) return null;

  return (
    <div className="middlebar layout column">
      <Toolbar />
      <Header />
      <Content />
    </div>
  );

};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    isFocus: container.window.isFocus (),
    isZen: container.window.isZen ()
  })
})( Middlebar );
