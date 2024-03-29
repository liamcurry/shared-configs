import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";
import * as merge from "webpack-merge";

export function buildConfig(entryPath: string, outputPath: string): webpack.Configuration {
    if (isDev()) {
        console.warn("Starting Webpack with development config");
        return devConfig(entryPath, outputPath);
    } else {
        console.log("Starting Webpack with production config");
        return prodConfig(entryPath, outputPath);
    }
}

const prod = "production";
const dev = "development";
function getEnv(): "production" | "development" {
    return process.env.npm_lifecycle_event === "build" ? prod : dev;
}
const isDev = () => getEnv() === dev;
const isProd = () => getEnv() === prod;

// entry and output path/filename variables
// const entryPath = path.join(process.cwd(), "src/ts/index.ts");
// const outputPath = path.join(process.cwd(), "dist");
// const entryPath = "src/ts/index.ts";
// const outputPath = "dist";

// common webpack config (valid for dev and prod)
function commonConfig(outputPath: string): webpack.Configuration {
    const outputFilename = isProd() ? "[name]-[hash].js" : "[name].js";
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
}

function devConfig(entryPath: string, outputPath: string): webpack.Configuration {
    return merge(commonConfig(outputPath), {
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
}

function prodConfig(entryPath: string, outputPath: string): webpack.Configuration {
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
