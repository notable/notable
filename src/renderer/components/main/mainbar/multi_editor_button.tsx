
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';

/* MULTI EDITOR BUTTON */

const Button = ({ icon, title, onClick = _.noop, color = '' }) => (
  <div className={`button bordered ${color}`} title={title} onClick={onClick}>
    <i className="icon">{icon}</i>
  </div>
);

/* EXPORT */

export default Button;
