"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CopyWebpackPlugin = require("copy-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var webpack = require("webpack");
var merge = require("webpack-merge");
function buildConfig(entryPath, outputPath) {
    if (isDev()) {
        console.warn("Starting Webpack with development config");
        return devConfig(entryPath, outputPath);
    }
    else {
        console.log("Starting Webpack with production config");
        return prodConfig(entryPath, outputPath);
    }
}
exports.buildConfig = buildConfig;
var prod = "production";
var dev = "development";
function getEnv() {
    return process.env.npm_lifecycle_event === "build" ? prod : dev;
}
var isDev = function () { return getEnv() === dev; };
var isProd = function () { return getEnv() === prod; };
function commonConfig(outputPath) {
    var outputFilename = isProd() ? "[name]-[hash].js" : "[name].js";
    return {
        output: {
            path: outputPath,
            filename: outputFilename,
        },
        resolve: {
            extensions: [".js", ".elm", ".ts", ".tsx", ".json"],
            modules: ["node_modules"],
        },
        module: {
            noParse: /\.elm$/,
            rules: [
                {
                    test: /\.(eot|ttf|woff|woff2|svg)$/,
                    use: "file-loader?publicPath=../../&name=static/css/[hash].[ext]",
                },
                {
                    enforce: "pre",
                    test: /\.ts(x?)$/,
                    loader: "tslint-loader",
                    exclude: /node_modules/,
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: "awesome-typescript-loader",
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
            ],
        },
        plugins: [
            new webpack.LoaderOptionsPlugin({
                debug: true,
                minimize: false,
            }),
            new HtmlWebpackPlugin({
                template: "src/index.html",
                inject: "body",
                filename: "index.html",
            }),
        ],
    };
}
function devConfig(entryPath, outputPath) {
    return merge(commonConfig(outputPath), {
        entry: ["webpack-dev-server/client?http://0.0.0.0:8080", entryPath],
        devServer: {
            historyApiFallback: true,
            contentBase: "./src",
            hot: true,
            disableHostCheck: true,
        },
        module: {
            rules: [
                {
                    test: /\.elm$/,
                    exclude: [/elm-stuff/, /node_modules/],
                    use: [
                        {
                            loader: "elm-webpack-loader",
                            options: {
                                verbose: true,
                                warn: true,
                                debug: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.sc?ss$/,
                    use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
                },
            ],
        },
    });
}
function prodConfig(entryPath, outputPath) {
    return merge(commonConfig(outputPath), {
        entry: entryPath,
        module: {
            rules: [
                {
                    test: /\.elm$/,
                    exclude: [/elm-stuff/, /node_modules/],
                    use: "elm-webpack-loader",
                },
            ],
        },
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: "src/favicon.ico",
                },
            ]),
            new webpack.optimize.UglifyJsPlugin(),
        ],
    });
}
