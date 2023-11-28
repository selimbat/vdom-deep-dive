const path = require('path')

const resolve = (file) => path.resolve(__dirname, file);

module.exports = {
    entry: "./src/app/main.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist"
    },

    mode: 'development',

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"],
        modules: [resolve('src'), 'node_modules']
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'babel-loader'.
            { test: /\.tsx?$/, loader: "babel-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
};
