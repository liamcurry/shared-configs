import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";
import * as merge from "webpack-merge";

const prod = "production";
const dev = "development";

// determine build env
const TARGET_ENV = process.env.npm_lifecycle_event === "build" ? prod : dev;
const isDev = TARGET_ENV === dev;
const isProd = TARGET_ENV === prod;

// entry and output path/filename variables
const entryPath = path.join(__dirname, "src/ts/index.ts");
const outputPath = path.join(__dirname, "dist");
const outputFilename = isProd ? "[name]-[hash].js" : "[name].js";

console.log("WEBPACK GO! Building for " + TARGET_ENV);

// common webpack config (valid for dev and prod)
export const common: webpack.Configuration = {
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
                // exclude: /(node_modules|bower_components)/
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

export const development: webpack.Configuration = merge(common, {
    entry: ["webpack-dev-server/client?http://0.0.0.0:8080", entryPath],
    devServer: {
        // serve index.html in place of 404 responses
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

export const production: webpack.Configuration = merge(common, {
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

export default (isDev ? development : production);
