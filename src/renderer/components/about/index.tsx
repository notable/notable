
/* IMPORT */

import * as React from 'react';
import * as path from 'path';
import pkg from '@root/package.json';

/* ABOUT */

const About = () => (
  <div id="about" className="app-wrapper layout multiple vertical center">
    <img src={`file://${path.join ( __static, 'images', 'icon.png' )}`} width={64} />
    <p className="title">{pkg.productName}</p>
    <p className="desc">Version {pkg.version}</p>
    <p className="desc">{pkg.license} © {pkg.author.name}</p>
  </div>
);

/* EXPORT */

export default About;
