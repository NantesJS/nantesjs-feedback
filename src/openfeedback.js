const { parse, add } = require('date-fns')
const he = require('he')
const keyById = require('./keyById.js')

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

function convertSpeaker(talk) {
  return talk.speakers.map(speaker => ({
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
  return function convertTalk(talk, idx = 0) {
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

module.exports = {
  convertToOpenFeedbackModel,
  convertSpeaker,
  convertTalkStartingAt,
  getStartDateTime,
}
