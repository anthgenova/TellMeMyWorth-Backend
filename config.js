const config = require('./config.json')

function configSetting() {
    // console.log(config.database_dev)
    return config.database_prod
}

configSetting()

module.exports.configSetting = configSetting;
