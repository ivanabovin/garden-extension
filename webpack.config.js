import * as p from 'path';
import CopyPlugin from 'copy-webpack-plugin';

function path(path) {
  return p.resolve(path);
}

function config(env, argv) {
  // noinspection JSUnusedGlobalSymbols
  return {
    devtool: argv.mode === 'development' ? 'inline-source-map' : false,
    entry: {
      background: path('src/background.ts'),
      content: path('src/content/index.ts'),
      app: path('src/app/index.ts'),
    },
    output: {
      path: path('build'),
      filename: '[name].js',
    },
    optimization: {},
    performance: false,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: path('public'), to: path('build') }],
        options: {},
      }),
    ],
  };
}

// noinspection JSUnusedGlobalSymbols
export default config;
