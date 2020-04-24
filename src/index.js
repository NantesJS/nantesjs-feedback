require('dotenv').config()

const getMeetupFileContent = require('./getMeetupFileContent.js')
const yaml = require('js-yaml')
const { convertToOpenFeedbackModel } = require('./openfeedback.js')
const createGist = require('./createGist.js')

getMeetupFileContent()
  .then(yaml.safeLoad)
  .then(convertToOpenFeedbackModel)
  .then(createGist)
  .then(console.log)
  .catch(console.error)
