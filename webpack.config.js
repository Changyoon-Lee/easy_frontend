const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
    entry: {
        main: './src/client/js/main.js',
        videoPlayer: "./src/client/js/videoPlayer.js"
    },
    mode: "development",
    watch: true, //변경시 바로 적용
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/styles.css"
        })
    ],
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "assets"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", { targets: "defaults" }]]
                    }
                }
            },
            {
                test: /.css?$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"] //먼저 적용되어야하는 것이 뒤에 작성되어야함
            }
        ]
    }
}
