const path = require('path');
const os = require('os');

module.exports = {
  entry: {
    'gameLambda': './src/lambdas/gameLambda.ts',
    'authLambda': './src/lambdas/authLambda.ts',
    'cleanupLambda': './src/lambdas/cleanupLambda.ts',
  },
  target: 'node',
  module: {
    rules: [
      { 
        test: /\.tsx?$/, 
        loader: 'ts-loader',
        options: { 
          transpileOnly: false,
          compilerOptions: {
            sourceMap: true,
          },
        }
      },
      {
        test: /\.node$/,
        loader: "node-loader",
        options: {
          flags: os.constants.dlopen.RTLD_NOW,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.ts'],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, 'out'),
  },
  mode: 'production',
};
