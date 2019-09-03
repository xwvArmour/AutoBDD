#!/usr/bin/env node

// process commandline arguments
// example usage: $ ./runner -project webtest-example -scratch 1
var argv = require('minimist')(process.argv.slice(2))   
const project = argv.project || 'webtest-example'
const fromScratch = argv.scratch

const { fork } = require('child_process')
const fs = require('fs')
const path = require('path')

const DryRun = require('./dryrunner.js')
// base directory for all test-suite
const projBase = path.resolve(process.env.PWD, `../../test-projects`)

// Format a date to use as test reports dir name 
const dateFormatter = options = { year: '2-digit', 
  month: 'numeric', day: 'numeric', hour: 'numeric', 
  minute: 'numeric', hour12: false }

// make unique dir for this run. 
function makeReportDir() {
  dName = new Date().toLocaleString('en-us', dateFormatter)
  dName = `${dName.replace(/[^0-9]/g, '')}-reports`
  return new Promise((resolve, reject) => {
    try {
      fs.mkdir(path.join(projectPath, dName), { recursive: true })
    } catch (e) { reject(e) }
      resolve(dName)
  }) }

// Scheduler. It: 
// 1. makes a directory named `reports` under $project directory, 
// 2. calls DryRun() to collect features and returns a featurePool as an array of featureInfo JSONs
// 3. for each featureInfo JSON in featurePool, fork a process and makes `./runone.js` to run the one feature file. 
// 4. insert the JSON that child process `./runone.js` sends back to featureInfo
// 5. when all featureInfos are processed, write back featurePool to dryrun file(dry.json under project directory)
function run() {
  // Make unique report directory under project 
  // directory(aka, pPath defined below}) and return its name
  let reportDir = await makeReportDir().catch(err => { 
      console.log(`Failed to make reporter dir: ${err}`)
      return
    })           
  
  let pPath = path.join(projBase, project)        // project path
  let dPath = path.join(pPath, `dry.json`)        // Dryrun report path

  new DryRun(pPath, dPath, fromScratch).dryrunner().then(featurePool => {
    return new Promise((resolve, reject) => {
      featurePool.forEach(featureInfo => {
      // The following block run one feature, return its return object
      fName = featureInfo.id
      pathArr = featureInfo.uri.split(path.sep).then(pathArr => {     // TODO use /features/ as seperator? 
        execPath = path.join(projectPath, pathArr[0])
        fPath = featureInfo.uri.slice(pathArr[0].length + 1)
      })
    
      rPath = path.join(projectPath, reportDir, `${fName}.report`)    // write running feature results to rPath
      oPath = path.join(projectPath, reportDir, `${fName}.out`)       // write running feature output to oPath

      let params = [fPath, rPath, oPath]
      let options = {
        cwd: execPath,
        stdio: ['pipe', 'pipe', 'pipe', 'ipc']
      }
      let child = fork(`./runone.js`, params, options)
      // child should send back the run feature result as an object, 
      // if an error is thrown, the messasge should be of type `Error`
      child.once('message', message => {
        if (typeof(message) === `Error`) {
          console.log(`Run feature @${featureInfo.uri} failed? `);
        } else if (typeof(message) === `Object`) {
          featureInfo.runresult = message
          featureInfo.runstatus = child.status       // TODO: insert the run test status? 
          // TODO what else to insert to megadata? 
        } else { console.log("Unknown problem") }
        resolve()
      })
    })
  })}, err => {
    console.log(`Dry run failed? ${err}`);
    return
  }).then( () => {
    // Write updated json(featurePool) back to the dryrun result file and we're done
    let update = fs.writeFileSync(`${dPath}`, JSON.stringify((featurePool, null, 2), `utf-8`))
    console.log("All Done! ");
  })
}


run().then(() => { console.log("Done") })