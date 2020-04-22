const fs = require('fs')

function getMeetupFileContent() {
  if (process.argv.length < 3) {
    console.error('Veuillez préciser le chemin vers le fichier meetup.md')
    console.error(`USAGE: node index.js path/to/meetup.md`)

    process.exit(1)
  }

  const meetupFile = process.argv[2]

  return fs.promises.access(meetupFile, fs.constants.R_OK)
    .then(() => fs.promises.readFile(meetupFile, 'utf-8'))
}

module.exports = getMeetupFileContent
