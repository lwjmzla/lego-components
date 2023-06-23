import basicConfig, { name, file } from './rollup.config'
import vue from 'rollup-plugin-vue'

basicConfig.plugins.push(vue({ css: false, template: { optimizeSSR: true } }))

export default {
  ...basicConfig,
  output: {
    name,
    file: file('umd'),
    format: 'umd',
    globals: {
      "vue": "Vue",
      "element-plus":"ElementPlus",
      'lodash-es': '_'
    },
    exports: 'named' // !解决Mixing named and default exports
  }
}