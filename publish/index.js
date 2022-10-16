/* eslint-disable @typescript-eslint/no-var-requires */
const inquirer = require('inquirer');
const {getDefaultRegistry, getNpmLatestVersion} = require('@jking-lwj/get-npm-info')
const semver = require('semver')
const colors = require('colors/safe') // !命令行颜色
const { cd, exec, echo, touch } = require("shelljs")
const pkg = require('../package.json')

class InitCommand {
  constructor(argv) {
    this._argv = argv
    const runner = new Promise(() => {
      let chain = Promise.resolve();
      chain = chain.then(() => this.init());
      chain = chain.then(() => this.exec());
      chain.catch((err) => {
        console.error(err.message)
      })
    });
  }

  async init() {
    // !获取最新的版本号
    this.latestVersion = await getNpmLatestVersion(pkg.name, getDefaultRegistry())
  }

  async exec() {
    try {
      //const localPath = process.cwd()
      const { version,isConfirm } = await this.prepare()
      if (isConfirm) {
        console.log(1)
      } else {
        console.log(colors.yellow('已取消'))
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  
  async prepare() {
    return this.getComponentInfo()
  }

  async getComponentInfo () {
    const versionCodes = this.latestVersion.split('.')
    const newCode = parseInt(versionCodes.pop()) + 1
    versionCodes.push(newCode)
    const defaultVersion = versionCodes.join('.')
    const latestVersion = this.latestVersion

    const {version,isConfirm} = await inquirer.prompt([
      {
        type: 'input',
        name: 'version',
        message: `请输入版本号`,
        default: defaultVersion,
        validate: function (val) {
          const done = this.async();
          setTimeout(function() {
            if (!semver.valid(val)) { // !返回 版本号  或者  null
              done(`请输入合法的版本号`);
              return;
            }
            if (!semver.gt(val, latestVersion)) {
              done(`版本号需大于` + latestVersion);
              return;
            }
            done(null, true);
          }, 0);
        },
        // filter: (v) => semver.valid(v)  // ! v1.0.0 => 1.0.0，会改变最终值
        // !当emver.valid(v)  返回null时，上面就报错，需要兼容处理
        filter: (v) => {
          return semver.valid(v) || v
        }
      },
      {
        type: 'confirm', // !二选一  true or false
        name: 'isConfirm',
        message: 'are you sure?',
        default: false
      },
    ])
    return {
      version,isConfirm
    }
  }

}

function init(argv) {
  return new InitCommand(argv)
}

init()
//module.exports = init