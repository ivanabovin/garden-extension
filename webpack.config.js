import * as p from 'path';
import CopyPlugin from 'copy-webpack-plugin';

function path(path) {
  return p.resolve(path);
}

function config(env, argv) {
  return {
    devtool: argv.mode === 'development' ? 'inline-source-map' : false,
    entry: {
      background: path('src/background.ts'),
      content: path('src/content.tsx'),
    },
    output: {
      path: path('dist'),
      filename: '[name].js',
    },
    optimization: {
      splitChunks: {
        name: 'vendor',
        chunks(chunk) {
          return chunk.name !== 'background';
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        }
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: path('public'), to: path('dist') }],
        options: {},
      }),
    ],
  };
}

// noinspection JSUnusedGlobalSymbols
export default config;
