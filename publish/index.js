/* eslint-disable @typescript-eslint/no-var-requires */
const execa = require('execa')
const inquirer = require('inquirer');
const {getDefaultRegistry, getNpmLatestVersion} = require('@jking-lwj/get-npm-info')
const semver = require('semver')
const colors = require('colors/safe') // !命令行颜色
const { exec } = require("shelljs")
const pkg = require('../package.json')
const curVersion = pkg.version
class InitCommand {
  constructor(argv) {
    this._argv = argv
    this.version = curVersion
    const runner = new Promise(() => {
      let chain = Promise.resolve();
      chain = chain.then(() => this.init());
      chain = chain.then(() => this.exec());
      chain.catch((err) => {
        console.error(colors.red(err.message))
      })
    });
  }

  async init() {
    const bumps = ['patch', 'minor', 'major', 'prerelease']
    const versions = {}

    bumps.forEach((b) => {
      versions[b] = semver.inc(curVersion, b, 'beta') // ! beta只对prerelease有影响
    })

    //console.log(versions)

    const bumpChoices = bumps.map((b) => ({
      name: `${b} (${versions[b]})`,
      value: b
    }))

    const { bump, customVersion } = await inquirer.prompt([
      {
        name: 'bump',
        message: '请选择需要发布的版本:',
        type: 'list',
        choices: [...bumpChoices, { name: 'custom', value: 'custom' }]
      },
      {
        name: 'customVersion',
        message: '请输入需要发布的版本:',
        type: 'input',
        when: (answers) => answers.bump === 'custom'
      }
    ])

    this.version = customVersion || versions[bump]
    // !获取最新的版本号
    this.latestVersion = await getNpmLatestVersion(pkg.name, getDefaultRegistry(true))
    if (!semver.gt(this.version, this.latestVersion)) {
      throw new Error(`要发版的版本号需大于当前最新版本号${this.latestVersion}`)
    }
  }

  async exec() {
    try {
      const { version,isConfirm } = await this.prepare()
      if (isConfirm) {
        // 使用npm version 更新package.json 的版本号
        await execa('npm', ['--no-git-tag-version', 'version', version], {
          stdio: 'inherit'
        })
        exec("git add -A")
        exec(`git commit -m "update ${version}"`)
        exec(`git tag ${version}`)
        exec(`git push origin ${version}`)
        exec("git push origin master")

        exec("npm publish")
      } else {
        console.log(colors.yellow('已取消操作'))
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  
  async prepare() {
    return this.getComponentInfo()
  }

  async getComponentInfo () {
    // const versionCodes = this.latestVersion.split('.')
    // const newCode = parseInt(versionCodes.pop()) + 1
    // versionCodes.push(newCode)
    // const defaultVersion = versionCodes.join('.')
    // const latestVersion = this.latestVersion

    const {isConfirm} = await inquirer.prompt([
      // {
      //   type: 'input',
      //   name: 'version',
      //   message: `请输入版本号`,
      //   default: defaultVersion,
      //   validate: function (val) {
      //     const done = this.async();
      //     setTimeout(function() {
      //       if (!semver.valid(val)) { // !返回 版本号  或者  null
      //         done(`请输入合法的版本号`);
      //         return;
      //       }
      //       if (!semver.gt(val, latestVersion)) {
      //         done(`版本号需大于` + latestVersion);
      //         return;
      //       }
      //       done(null, true);
      //     }, 0);
      //   },
      //   // filter: (v) => semver.valid(v)  // ! v1.0.0 => 1.0.0，会改变最终值
      //   // !当emver.valid(v)  返回null时，上面就报错，需要兼容处理
      //   filter: (v) => {
      //     return semver.valid(v) || v
      //   }
      // },
      {
        type: 'confirm', // !二选一  true or false
        name: 'isConfirm',
        message: `当前需要发版的版本号为${this.version}, are you sure?`,
        default: false
      },
    ])
    return {
      version: this.version,
      isConfirm
    }
  }

}

function init(argv) {
  return new InitCommand(argv)
}

init()
//module.exports = init