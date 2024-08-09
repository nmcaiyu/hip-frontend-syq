import Vue from 'vue'
import SvgIcon from './SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('@/icons/svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

/*

# SvgIcon

## Description:

  Custom SVG icon integration component.

## Installation:

- yarn add svg-sprite-loader --dev

- Put this component into src/components.

- create folders src/icons/svg.

- In vue.config.js, add configs below:

    const path = require('path')

    module.exports = {
        chainWebpack: config => {
        config.module
            .rule('svg')
            .exclude.add(path.resolve(__dirname, 'src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(path.resolve(__dirname, 'src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
            symbolId: 'icon-[name]'
            })
            .end()
        }
    }

- In main.js, add `import '@/components/SvgIcon'`

#  Usage:

  After installation, just putting custom SVG icons into src/icons/svg, they will be loaded automatically.

  Then use <svg-icon icon-class="home" /> in template, if svg icon filename is 'home.svg' for example.

*/