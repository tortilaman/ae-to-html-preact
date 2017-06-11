import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ReplacePlugin from 'replace-bundle-webpack-plugin';
import OfflinePlugin from 'offline-plugin';
// import HtmlWebpackInlineSVGPlugin from 'html-webpack-inline-svg-plugin';
import path from 'path';

const ENV = process.env.NODE_ENV || 'development';

const CSS_MAPS = ENV !== 'production';

module.exports = {
	context: path.resolve(__dirname, "src"),
	entry: './index.js',

	output: {
		path: path.resolve(__dirname, "build"),
		publicPath: '/',
		filename: 'bundle.js'
	},

	resolve: {
		extensions: ['.jsx', '.js', '.json', '.scss'],
		modules: [
			path.resolve(__dirname, "src/lib"),
			path.resolve(__dirname, "node_modules"),
			'node_modules'
		],
		alias: {
			components: path.resolve(__dirname, "src/components"),
			containers: path.resolve(__dirname, "src/containers"),
			style: path.resolve(__dirname, "src/style"),	//Useful for imports
			api: path.resolve(__dirname, "src/api"),
			assets: path.resolve(__dirname, "src/assets"),
			'react': 'preact-compat',
			'react-dom': 'preact-compat'
		}
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: path.resolve(__dirname, 'src'),
				enforce: 'pre',
				use: 'source-map-loader'
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				// Transform our own .(scss|css) files with PostCSS and CSS-modules
				test: /\.(scss|css)$/,
				include: [
					path.resolve(__dirname, 'src/containers'),
					path.resolve(__dirname, 'src/components')
				],
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								modules: true,
								localIdentName: '[local]--[hash:base64:5]',
								sourceMap: CSS_MAPS,
								importLoaders: 1
							}
						},
						{
							loader: `postcss-loader`,
							options: {
								sourceMap: CSS_MAPS,
								plugins: () => {
									autoprefixer({ browsers: ['last 2 versions']});
								}
							}
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: CSS_MAPS
							}
						}
					]
				})
			},
			{
				test: /\.(scss|css)$/,
				exclude: [
					path.resolve(__dirname, 'src/components'),
					path.resolve(__dirname, 'src/containers')
				],
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: CSS_MAPS,
								importLoaders: 1
							}
						},
						{
							loader: `postcss-loader`,
							options: {
								sourceMap: CSS_MAPS,
								plugins: () => {
									autoprefixer({browsers: ['last 2 versions']});
								}
							}
						},
						{
							loader: 'sass-loader',
							options: {sourceMap: CSS_MAPS}
						}
					]
				})
			},
			{
				test: /\.json$/,
				use: 'json-loader'
			},
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				loaders: [
					'file-loader',
					{
						loader: 'image-webpack-loader',
						query: {
							progressive: true,
							optimizationLevel: 7,
							interlaced: false,
							pngquant: {
								quality: '65-90',
								speed: 4
							}
						}
					}
				]
			},
			{
				test: /\.(xml|html|txt|md)$/,
				use: 'raw-loader'
			},
			{
				test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
				use: ENV === 'production' ? 'file-loader' : 'url-loader'
			}
		]
	},
	plugins: ([
		new webpack.NoEmitOnErrorsPlugin(),
		new ExtractTextPlugin({
			filename: 'style.css',
			allChunks: true,
			disable: ENV !== 'production'
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(ENV)
		}),
		new HtmlWebpackPlugin({
			template: './index.ejs',
			minify: {
				collapseWhitespace: true
			}
		}),
		new CopyWebpackPlugin([{
			from: './manifest.json',
			to: './'
		},
		{
			from: './favicon.ico',
			to: './'
		}
		])
	]).concat(ENV === 'production' ? [
		new webpack.optimize.UglifyJsPlugin({
			output: {
				comments: false
			},
			compress: {
				unsafe_comps: true,
				properties: true,
				keep_fargs: false,
				pure_getters: true,
				collapse_vars: true,
				unsafe: true,
				warnings: false,
				screw_ie8: true,
				sequences: true,
				dead_code: true,
				drop_debugger: true,
				comparisons: true,
				conditionals: true,
				evaluate: true,
				booleans: true,
				loops: true,
				unused: true,
				hoist_funs: true,
				if_return: true,
				join_vars: true,
				cascade: true,
				drop_console: true
			}
		}),

		// strip out babel-helper invariant checks
		new ReplacePlugin([{
			// this is actually the property name https://github.com/kimhou/replace-bundle-webpack-plugin/issues/1
			partten: /throw\s+(new\s+)?[a-zA-Z]+Error\s*\(/g,
			replacement: () => 'return;('
		}]),
		new OfflinePlugin({
			relativePaths: false,
			AppCache: false,
			excludes: ['_redirects'],
			ServiceWorker: {
				events: true
			},
			cacheMaps: [{
				match: /.*/,
				to: '/',
				requestTypes: ['navigate']
			}],
			publicPath: '/'
		})
	] : []),

	stats: {colors: true},

	node: {
		global: true,
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false,
		setImmediate: false
	},

	devtool: ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',

	devServer: {
		port: process.env.PORT || 8080,
		host: 'localhost',
		publicPath: '/',
		contentBase: './src',
		historyApiFallback: true,
		open: true,
		proxy: {
			// OPTIONAL: proxy configuration:
			// '/optional-prefix/**': { // path pattern to rewrite
			//   target: 'http://target-host.com',
			//   pathRewrite: path => path.replace(/^\/[^\/]+\//, '')   // strip first path segment
			// }
		}
	}
};
