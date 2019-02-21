
/* IMPORT */

import '@static/css/notable.min.css';
import '@static/javascript/notable.min.js';

import * as React from 'react';
import {render as renderDOM} from 'react-dom';
import Identity from 'react-component-identity';
import {Router} from 'react-router-static';
import {Provider} from 'overstated';
import Environment from '@common/environment';
import Routes from './routes';
import ErrorBoundary from './components/error_boundary';

/* RENDER */

async function render () {

  const AppContainer = Environment.isDevelopment ? ( await import ( 'react-hot-loader' ) ).AppContainer : Identity;

  renderDOM (
    <AppContainer>
      <Provider>
        <ErrorBoundary>
          <Router routes={Routes} />
        </ErrorBoundary>
      </Provider>
    </AppContainer>,
    document.getElementById ( 'app' )
  );

}

/* EXPORT */

export default render;
