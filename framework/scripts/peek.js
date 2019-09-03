#!/usr/bin/env node

const fs = require('fs')
var obj

exports.getobj = function(fname) {
  fstr = fs.readFileSync(fname)
  obj = JSON.parse(fstr)
  return obj
}