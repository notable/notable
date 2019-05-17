
/* IMPORT */

const ExcludeAssetsPlugin = require ( 'webpack-exclude-assets-plugin' ),
      TerserPlugin = require ( 'terser-webpack-plugin' ),
      TSConfigPathsPlugin = require ( 'tsconfig-paths-webpack-plugin' ),
      webpack = require ( 'webpack' );

/* PLUGINS */

function PluginSkeletonOptimization ( compiler ) { // Loading heavy resources after the skeleton
  compiler.plugin ( 'compilation', compilation => {
    compilation.hooks.htmlWebpackPluginAfterHtmlProcessing = {
      async promise ( data ) {
        data.html = data.html.replace ( /<link(.*?)rel="stylesheet">(.*?)<body>(.*?)<script/, '$2<body>$3<link$1rel="stylesheet"><script' ); // Moving the main CSS to the bottom in order to make the skeleton load faster
        return data;
      }
    };
  });
}

/* CONFIG */

const config = {
  resolve: {
    alias: {
      'react-dom': process.env.NODE_ENV !== 'production' ? '@hot-loader/react-dom' : 'react-dom'
    },
    plugins: [
      new TSConfigPathsPlugin ()
    ]
  },
  plugins: [
    new ExcludeAssetsPlugin ({
      path: [
        '\.(eot|ttf|woff)$' // Unused font formats
      ]
    }),
    new webpack.DefinePlugin ({
      'Environment.isDevelopment': JSON.stringify ( process.env.NODE_ENV !== 'production' )
    }),
    PluginSkeletonOptimization
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
