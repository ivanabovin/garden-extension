import * as p from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import postcss_prepend_selector from 'postcss-prepend-selector';

function path(path) {
  return p.resolve(path);
}

function config(env, argv) {
  // noinspection JSUnusedGlobalSymbols
  return {
    devtool: argv.mode === 'development' ? 'inline-source-map' : false,
    entry: {
      background: path('src/background.ts'),
      content: path('src/content/content.tsx'),
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
    performance: false,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {},
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: false,
                modules: { mode: 'icss' },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  ident: 'postcss',
                  config: false,
                  plugins: [
                    postcss_prepend_selector({ selector: '.jam ' }),
                  ],
                },
                sourceMap: false,
              },
            },
          ],
          sideEffects: true,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new CopyPlugin({
        patterns: [{ from: path('public'), to: path('dist') }],
        options: {},
      }),
    ],
  };
}

// noinspection JSUnusedGlobalSymbols
export default config;
