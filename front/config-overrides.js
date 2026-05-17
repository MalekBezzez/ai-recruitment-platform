const path = require('path');
const alias = require('./aliases');
const { aliasWebpack } = require('react-app-alias');

const SRC = './src';
const aliases = alias(SRC);
const resolvedAliases = Object.fromEntries(
  Object.entries(aliases).map(([key, value]) => [key, path.resolve(__dirname, value)])
);
const options = { alias: resolvedAliases };

module.exports = (config /*, env */) => {
  // 1) Don’t fail the build on ESLint errors (dev + prod)
  const eslintPlugin = (config.plugins || []).find(
    (p) => p && p.constructor && p.constructor.name === 'ESLintWebpackPlugin'
  );
  if (eslintPlugin) {
    // let the build continue even if there are errors
    eslintPlugin.options.failOnError = false;
    // still show warnings
    eslintPlugin.options.emitWarning = true;

    // Optionally, soften specific rules at build time:
    eslintPlugin.options.overrideConfig = {
      ...(eslintPlugin.options.overrideConfig || {}),
      rules: {
        ...(eslintPlugin.options.overrideConfig?.rules || {}),
        'jsx-a11y/no-autofocus': 'warn',
      },
    };
  }

  // 2) Silence the "Failed to parse source map" noise
  config.ignoreWarnings = [
    ...(config.ignoreWarnings || []),
    { message: /Failed to parse source map/ },
  ];

  // 3) Apply aliases
  return aliasWebpack(options)(config);
};
