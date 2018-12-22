
/* IMPORT */

const TerserPlugin = require ( 'terser-webpack-plugin' ),
      TSConfigPathsPlugin = require ( 'tsconfig-paths-webpack-plugin' ),
      webpack = require ( 'webpack' );

/* CONFIG */

const config = {
  resolve: {
    plugins: [
      new TSConfigPathsPlugin ()
    ]
  },
  plugins: [
    new webpack.DefinePlugin ({
      'Environment.isDevelopment': JSON.stringify ( process.env.NODE_ENV !== 'production' )
    })
  ],
  optimization: {
    minimizer: [
      new TerserPlugin ({
        parallel: true,
        sourceMap: true,
        terserOptions: {
          keep_fnames: true
        }
      })
    ]
  }
};

/* EXPORT */

module.exports = config;
