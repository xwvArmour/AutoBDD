#!/usr/bin/env node
'use strict'

var argv = require('minimist')(process.argv.slice(2))
const { spawn, spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs')

// hardcoded path for testing 
const ePath = path.resolve(path.join(process.env.PWD, `../../AutoBDD-vArmour/test-projects/webtest-example/test-webpage`))
const fPath = `features/dropdown_list.feature`
const rPath = path.resolve(path.join(ePath, `../reports/dropdown_list.report`))
const oPath = `/dev/null`

const runCommand = 'xvfb-run'
const baseArgs= ['-a', '-s="-screen 0 1920x1200x16"', 'chimpy', 'chimp.js']

// Run one feature(file) and write result to the megadata $featureInfo
class RunOne {
  constructor (execPath, fPath, rPath, oPath) {
    this.ePath = execPath
    this.fPath = fPath
    this.rPath = rPath
    this.oPath = oPath
  } 

  async run() {
    process.env.chromeDriverVersion="76.0.3809.68" || argv.chromeDriverVersion
    process.env.MOVIE = "0" || argv.MOVIE
    process.env.SCREENSHOT = "1" || argv.SCREENSHOT
    process.env.BROWSER = "CH" || argv.BROWSER
    process.env.DEBUGMODE = "None" || argv.DEBUGMODE
    process.env.DISPLAYSIZE = "1920x1200"     // ???
    process.env.PLATFORM = "Linux" || argv.PLATFORM

    let options = {cwd: this.ePath, env: process.env}
    let params = baseArgs.concat([`${fPath}`, `--format=json:${rPath}`])
    //, `2>&1`, `>`, `${oPath}`])
    
    let worker = spawnSync(runCommand, params, options)
    if (typeof(worker)===`Object`) {
      console.log(`Run command ${runCommand} ${params} ${options} finished with output: 
      ${worker.output.toString()}`)
    } else {
      console.log(`Process didn't get executed? `);
      return
    }
    
    // let worker = await spawn(runCommand, params, options)
    // worker.once('close', async (code, signal) => {
    //   if (signal != null) { console.log('signal=${signal}, code=${code}')}
      
    if (fs.existsSync(this.rPath)) {
        // Generate status -- 
        let result = await this.collect_result()
        if (process.send) { process.send(result) }
        console.log(result[0].elements[0].steps[0].result);
      } else { 
        console.log(`Run feature ${fPath} process error with: 
         ${JSON.parse(worker.stdout)}`)
        if (process.send) { process.send(worker.error) }
      }
  //  })
  }

  async collect_result() {
    return new Promise((resolve, reject) => {
      try {
        let resStr = fs.readFileSync(this.rPath)
        // outStr = fs.readFileSync(this.oPath)
        resolve(JSON.parse(resStr))
      } catch (e) { reject(e)}
    })
  }
}

if (require.main === module) {
  new RunOne(ePath, fPath, rPath, oPath).run()
}