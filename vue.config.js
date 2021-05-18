const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    configureWebpack:{
        plugins:[
            new CopyPlugin([
                { from: "src/assets/logos/", to: "logos/" },
                { from: "src/assets/descargas/", to: "descargas/" }
            ])
        ]
    }
}