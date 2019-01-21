
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';

/* TOOLBAR BUTTON */

const ToolbarButton = ({ id = '' , icon, title, onClick = _.noop, isActive = false, color = '', badge = undefined as any }) => ( //TSC
  <div id={id ? id : undefined} className={`${isActive ? 'active text-secondary' : ''} button bordered xsmall ${color}`} title={title} onClick={onClick}>
    <i className="icon">{icon}</i>
    {!badge ? null : (
      <div className="badge" title={badge.title}>{badge.text}</div>
    )}
  </div>
);

/* EXPORT */

export default ToolbarButton;
