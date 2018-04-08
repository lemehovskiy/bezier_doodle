module.exports = {
    watch: true,
    entry: './src/bezier_doodle.es6',
    output: {
        filename: 'build/bezier_doodle.js'
    },
    module: {
        rules: [
            {
                test: /\.es6$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    }
};