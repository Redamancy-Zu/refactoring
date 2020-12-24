'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    API_ROOT: '"http://10.58.237.237:9083/api/"',  //iot开发环境
    SSO_ROOT: '"http://10.58.237.237:9185/api/"' //sso权限平台开发环境
    // API_ROOT: '"http://iot.dev.lsctl.com/api/"',  //iot开发环境
    // SSO_ROOT: '"http://iot.dev.lsctl.com/sso/api/"' //sso权限平台开发环境
})
