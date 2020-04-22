require('dotenv').config()

const fs = require('fs')
const yaml = require('js-yaml')
const { Octokit } = require('@octokit/rest')
const { convertToOpenFeedbackModel } = require('./openfeedback.js')

getMeetupFile()
  .then(meetupFile => fs.promises.readFile(meetupFile, 'utf-8'))
  .then(yaml.safeLoad)
  .then(convertToOpenFeedbackModel)
  .then(createGist)
  .then(getRawUrl)
  .then(console.log)
  .catch(console.error)

function getRawUrl(createGistResponse) {
  return createGistResponse.data.files['openfeedback.json'].raw_url
}

function createGist(openFeedbackModel) {
  const client = new Octokit({ auth: process.env.GITHUB_TOKEN })

  return client.gists.create({
    files: {
      'openfeedback.json': {
        content: JSON.stringify(openFeedbackModel),
      }
    }
  })
}

function getMeetupFile() {
  if (process.argv.length < 3) {
    console.error('Veuillez préciser le chemin vers le fichier meetup.md')
    console.error(`USAGE: node index.js path/to/meetup.md`)

    process.exit(1)
  }

  const meetupFile = process.argv[2]

  return fs.promises.access(meetupFile, fs.constants.R_OK).then(() => meetupFile)
}
