
/* IMPORT */

import * as React from 'react';

/* MULTI EDITOR BUTTON */

const Button = ({ icon, title, onClick, color = '' }) => (
  <div className={`button bordered ${color}`} title={title} onClick={onClick}>
    <i className="icon">{icon}</i>
  </div>
);

/* EXPORT */

export default Button;
