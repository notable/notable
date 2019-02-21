
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';

/* TOOLBAR BUTTON */

const ToolbarButton = ({ id = '' , icon, title, onClick = _.noop, isActive = false, color = '' }) => (
  <div id={id ? id : undefined} className={`${isActive ? 'active text-accent' : ''} button bordered xsmall ${color}`} title={title} onClick={onClick}>
    <i className="icon">{icon}</i>
  </div>
);

/* EXPORT */

export default ToolbarButton;
