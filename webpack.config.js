import * as path from "path";
import * as url from "url";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const webpackConfig = {
    mode: "production",
    entry: "./src/server.js",
    output: {
        filename: "build.js",
        path: path.resolve(__dirname, "build")
    },
    plugins: [
        /**
         * All files inside webpack's output.path directory will be removed once, but the
         * directory itself will not be. If using webpack 4+'s default configuration,
         * everything under <PROJECT_DIR>/dist/ will be removed.
         * Use cleanOnceBeforeBuildPatterns to override this behavior.
         *
         * During rebuilds, all webpack assets that are not used anymore
         * will be removed automatically.
         *
         * See `Options and Defaults` for information
         */
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                API_KEY: JSON.stringify(process.env.API_KEY)
            }
        })
    ]
};

export default webpackConfig;
