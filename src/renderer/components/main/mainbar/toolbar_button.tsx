
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';

/* TOOLBAR BUTTON */

const ToolbarButton = ({ icon, title, onClick = _.noop, isActive = false, color = '', className = '' }) => (
  <div className={`${isActive ? 'active text-accent' : ''} button bordered xsmall ${color} ${className}`} title={title} onClick={onClick}>
    <i className="icon">{icon}</i>
  </div>
);

/* EXPORT */

export default ToolbarButton;
