const config = require('./config.json')

function configSetting() {
    // console.log(config.database_dev)
    return config.database_dev
}

configSetting()

module.exports.configSetting = configSetting;
