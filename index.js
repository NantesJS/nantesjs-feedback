require('dotenv').config()

const fs = require('fs')
const yaml = require('js-yaml')
const { parse, add } = require('date-fns')
const { Octokit } = require('@octokit/rest')
const he = require('he')

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

function convertToOpenFeedbackModel(meetup) {
  const startDateTime = getStartDateTime(meetup.date)
  const convertTalk = convertTalkStartingAt(startDateTime)

  const sessions = meetup.talks.map(convertTalk)
  const speakers = meetup.talks.flatMap(convertSpeaker)

  return {
    sessions: keyById(sessions),
    speakers: keyById(speakers),
  }
}

function convertSpeaker(meetup) {
  return meetup.speakers.map(speaker => ({
    id: speaker.id,
    name: speaker.name,
    photoUrl: `https://avatars.io/twitter/${speaker.link}`,
    socials: [{
      name: 'twitter',
      link: `https://twitter.com/${speaker.link}`,
    }],
  }))
}

function convertTalkStartingAt(startDateTime) {
  return function convertTalk(talk, idx) {
    const startTime = add(startDateTime, { minutes: 45 * idx })
    const endTime = add(startTime, { minutes: 45 })

    const speakers = talk.speakers.map(speaker => speaker.id)

    return {
      id: talk.id,
      title: he.decode(talk.title),
      startTime,
      endTime,
      speakers,
      trackTitle: 'main',
    }
  }
}

function getStartDateTime(date) {
  const startDate = parse(date, 'dd/MM/yyyy', new Date())
  return add(startDate, { hours: 19 })
}

function keyById(arr) {
  return arr.reduce((acc, obj) => ({
    ...acc,
    [obj.id]: obj,
  }), {})
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
