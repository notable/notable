
/* ENVIRONMENT */

const Environment = {
  environment: process.env.NODE_ENV,
  isDevelopment: ( process.env.NODE_ENV !== 'production' ),
  wds: { // Webpack Development Server
    protocol: 'http',
    hostname: 'localhost',
    port: process.env.ELECTRON_WEBPACK_WDS_PORT
  }
};

/* EXPORT */

export default Environment;
