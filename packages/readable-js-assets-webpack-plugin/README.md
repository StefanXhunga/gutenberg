# Readable JS assets WebPack Plugin

Generate a readable non-minified JS file for each `.min.js` asset.

The end result is that for each JS entrypoint, we get a set of readable and non-minimized `.js` file and a minimized `.min.js`. This allows Gutenberg to follow the WordPress convention of adding a `.min.js` suffix to minimized JS files, while still providing a readable and unminized files that play well with the WordPress i18n machinery.

Consult the [webpack website](https://webpack.js.org) for additional information on webpack concepts.

## Installation

Install the module

```bash
npm install @wordpress/readable-js-assets-webpack-plugin --save-dev
```

**Note**: This package requires Node.js 12.0.0 or later. It also requires webpack 4.8.3 and newer. It is not compatible with older versions.

## Usage

### Webpack

Use this plugin as you would other webpack plugins:

```js
// webpack.config.js
const ReadableJsAssetsWebpackPlugin = require( '@wordpress/readable-js-assets-webpack-plugin' );

module.exports = {
	// …snip
	plugins: [ new ReadableJsAssetsWebpackPlugin() ],
};
```

**Note:**
- Multiple instances of the plugin are not supported and may produced unexpected results;
- It assumes your WebPack pipeline is already generating a `.min.js` JS asset file for each JS entry-point.