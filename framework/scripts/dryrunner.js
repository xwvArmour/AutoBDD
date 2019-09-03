#!/usr/bin/env node
'use strict'
var argv = require('minimist')(process.argv.slice(2))
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const project = process.argv[2] || 'webtest-example'
// var frameworkPath = path.join(process.env.FrameworkPath, 'test-projects', project) // TODO

const defaultProjPath= path.resolve(path.join(process.env.PWD, `../../AutoBDD-vArmour/test-projects/webtest-example`))
const defaultDryDir = path.join(defaultProjPath, 'dry.json')

// Return a freature pool object
class DryRun {
  // $pPath->project path, dPath->dryrun report path
  constructor(pPath=defaultProjPath, dPath=defaultDryDir, fromScratch=true) {
    this.projDir = pPath 
    this.dryDir = dPath 
    this.fromScratch = fromScratch
  }

  setProjPath(projDir) {
    this.projDir = projDir
  }
  setDryDir(dryDir) {
    this.dryDir = dryDir
  }

  async dryrunner() {
    let command = this.fromScratch? 'cucumber-js -d -f json:${this.dryDir} **/' : 'pwd'
    
    return new Promise((resolve, reject) => {
      try {
        let options = { cwd: this.projDir, stdio: "ignore" }
        let child = execSync(command, options)
        // if (child.....) reject(...)          // TODO 
      } catch (e) { reject(e) }
        const ftrStr = fs.readFileSync(this.dryDir)
        resolve(JSON.parse(ftrStr))
    })
  }
}

if (require.main === module) {
  new DryRun().dryrunner().then( (obj) => {     // TODO params
    console.log('${obj[0].uri} Done')
  }, (err)=>{
    console.log('error: ${err}');
  })
}

module.export = DryRun