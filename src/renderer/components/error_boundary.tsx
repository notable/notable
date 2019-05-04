
/* IMPORT */

import {shell} from 'electron';
import * as is from 'electron-is';
import githubIssueUrl from 'new-github-issue-url';
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

    const url = githubIssueUrl ({
      repoUrl: pkg.homepage,
      title: `An error occurred: ${error.message}`,
      body: `- **OS Version**: ${os.platform} ${os.release}\n- **Notable Version**: v${pkg.version}\n\n\`\`\`\n${error.stack}\n\`\`\``
    });

    shell.openExternal ( url );

  }

  /* RENDER */

  render () {

    const {error} = this.state;

    if ( !error ) return this.props.children;

    const isMacOS = is.macOS ();

    return (
      <div id="error-boundary" className="app-wrapper layout">
        {!isMacOS ? null : (
          <div className="layout-header titlebar">
            <span className="title">An Error Occurred!</span>
          </div>
        )}
        <div className="layout-content container">
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
