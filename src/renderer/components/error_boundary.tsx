
/* IMPORT */

import {is, openNewGitHubIssue} from 'electron-util';
import * as os from 'os';
import * as React from 'react';
import pkg from '@root/package.json';

/* ERROR BOUNDARY */

class ErrorBoundary extends React.Component<{}, { error?: Error }> {

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

    const {error} = this.state;

    if ( !error ) return;

    openNewGitHubIssue ({
      repoUrl: pkg.homepage,
      title: `An error occurred: ${error.message}`,
      body: `- **OS Version**: ${os.platform} ${os.release}\n- **Notable Version**: v${pkg.version}\n\n\`\`\`\n${error.stack}\n\`\`\``
    });

  }

  /* RENDER */

  render () {

    const {error} = this.state;

    if ( !error ) return this.props.children;

    const isMacOS = is.macos;

    return (
      <div className="error-boundary app-wrapper layout">
        {!isMacOS ? null : (
          <div className="layout-header titlebar">
            <span className="title">An Error Occurred!</span>
          </div>
        )}
        <div className="layout-content container sharp">
          {isMacOS ? null : (
            <h1 className="text-center">An Error Occurred!</h1>
          )}
          <pre className="error-stack">{error.stack}</pre>
        </div>
        <div className="layout-footer toolbar">
          <div className="button warning" onClick={this.report}>Report It</div>
        </div>
      </div>
    );

  }

}

/* EXPORT */

export default ErrorBoundary;
