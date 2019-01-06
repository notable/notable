
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Position from './statusbar_position';
import WordCount from './statusbar_word_count';

/* STATUSBAR */

const Statusbar = ({ isStatusbar }) => {
  if (!isStatusbar) {
    return null;
  }

  return <div id="mainbar-statusbar" className="layout-footer centerer">
    <div className="multiple grow">
      <div className="spacer"></div>
      <Position />
      <WordCount />
    </div>
  </div>
};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    isStatusbar: container.editor.isStatusbar ()
  })
})( Statusbar );
