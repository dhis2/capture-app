const svgMod = {
    test: /\.svg$/,
    use: {
        loader: 'svg-url-loader',
        options: {
            noquotes: true,
            encoding: 'base64',
        },
    },
};

module.exports = svgMod;
