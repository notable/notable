
/* IMPORT */

import {shell} from 'electron';
import * as is from 'electron-is';
import * as React from 'react';
import pkg from '@root/package.json';

/* ERROR BOUNDARY */

class ErrorBoundary extends React.Component<any, { error?: Error }> {

  /* STATE */

  state = {
    error: undefined as Error | undefined
  };

  /* SPECIAL */

  componentDidCatch ( error: Error ) {

    this.setState ({ error });

  }

  /* API */

  report = () => {

    shell.openExternal ( pkg.bugs.url );

  }

  /* RENDER */

  render () {

    const {error} = this.state;

    if ( !error ) return this.props.children;

    const isMacOS = is.macOS ();

    return (
      <div id="error-boundary" className="app-wrapper layout">
        {!isMacOS ? null : (
          <div className="layout-header centerer">
            <div className="title small">An Error Occurred!</div>
          </div>
        )}
        <div className="layout-content container">
          {isMacOS ? null : (
            <h1 className="text-center">An Error Occurred!</h1>
          )}
          <pre className="error-stack">{error.stack}</pre>
        </div>
        <div className="layout-footer container centerer">
          <div className="button red" onClick={this.report}>Report It</div>
        </div>
      </div>
    );

  }

}

/* EXPORT */

export default ErrorBoundary;
