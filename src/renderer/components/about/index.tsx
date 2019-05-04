
/* IMPORT */

import * as React from 'react';
import * as path from 'path';
import pkg from '@root/package.json';

/* ABOUT */

const About = () => (
  <div className="about app-wrapper layout multiple vertical center">
    <img src={`file://${path.join ( __static, 'images', 'icon.png' )}`} width={64} />
    <p className="title">{pkg.productName}</p>
    <p className="description">Version {pkg.version}</p>
    <p className="description">{pkg.license} © {pkg.author.name}</p>
  </div>
);

/* EXPORT */

export default About;
