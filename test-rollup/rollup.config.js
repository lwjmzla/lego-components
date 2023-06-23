import { dataToEsm } from '@rollup/pluginutils'
/*
  !执行顺序，先执行buildStart，再执行入口文件的load，transform，
  !再执行入口文件里面的import逻辑的多个load，多个transform
*/
function rollupPlugin() {
  return {
    name: 'parse-json',
    buildStart ( options ) {
      console.log('--buildStart--')
    },
    load ( id ) {
      console.log('--load--', id)
      return null;
    },
    transform(code, id) {
      if ( id.slice(-5) !== '.json' ) return null
      console.log('--transform code--', code)
      console.log('--transform id--', id)
      const parsed = JSON.parse(code)
      const transformCode = dataToEsm(parsed) // !把对象里的每个key,value都export
      console.log(transformCode)
      return {
        code: transformCode
      };
    },
    buildEnd ( error ) {
      console.log('--buildEnd--',error)
    },
  }
}

export default {
  input: 'test-rollup/main.js',
  output: {
    format: 'esm',
    file: 'test-rollup/dist/bundle.js'
  },
  plugins: [
    rollupPlugin()
  ]
}