const svgMod = {
    test: /\.svg$/,
    use: {
        loader: 'svg-url-loader',
        options: {
            noquotes: true,
        },
    },
};

module.exports = svgMod;
