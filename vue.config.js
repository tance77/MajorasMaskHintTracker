module.exports = {
    css: {sourceMap: false},
    productionSourceMap: false,
    configureWebpack: {
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',
    }
};
