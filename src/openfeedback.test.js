const test = require('ava')
const {
  getStartDateTime,
  convertSpeaker,
  convertTalkStartingAt,
  convertToOpenFeedbackModel,
} = require('./openfeedback.js')

test('it should return 16/04/2020 at 19:00', t => {
  const date = '16/04/2020'
  const expectedDate = new Date('2020-04-16 19:00')

  const startDateTime = getStartDateTime(date)

  t.deepEqual(expectedDate, startDateTime)
})

test('it should return expected speakers structure', t => {
  const talk = {
    speakers: [
      { id: 'speaker1', name: 'Jane Doe', link: 'jane_doe' },
      { id: 'speaker2', name: 'John Doe', link: 'john_doe' },
    ],
  }
  const expectedSpeakers = [
    {
      id: 'speaker1', name: 'Jane Doe', photoUrl: 'https://avatars.io/twitter/jane_doe',
      socials: [{ name: 'twitter', link: 'https://twitter.com/jane_doe' }],
    },
    {
      id: 'speaker2', name: 'John Doe', photoUrl: 'https://avatars.io/twitter/john_doe',
      socials: [{ name: 'twitter', link: 'https://twitter.com/john_doe' }],
    },
  ]

  const speakers = convertSpeaker(talk)

  t.deepEqual(expectedSpeakers, speakers)
})

test('it should return expected talks structure', t => {
  const date = new Date('2020-04-16 19:00')
  const talk = {
    id: 'talk 1',
    title: 'mon premier talk',
    speakers: [{ id: 'speaker1' }],
  }
  const expectedTalk = {
    id: 'talk 1',
    title: 'mon premier talk',
    startTime: date,
    endTime: new Date('2020-04-16 19:45'),
    trackTitle: 'main',
    speakers: ['speaker1'],
  }

  const convertedTalk = convertTalkStartingAt(date)(talk)

  t.deepEqual(expectedTalk, convertedTalk)
})

test('it should return talk with 45 minutes delay', t => {
  const date = new Date('2020-04-16 19:00')
  const talk = {
    id: 'talk 1',
    title: 'mon premier talk',
    speakers: [{ id: 'speaker1' }],
  }
  const expectedTalk = {
    id: 'talk 1',
    title: 'mon premier talk',
    startTime: new Date('2020-04-16 19:45'),
    endTime: new Date('2020-04-16 20:30'),
    trackTitle: 'main',
    speakers: ['speaker1'],
  }
  const talkIndex = 1 // zeo-based index

  const convertedTalk = convertTalkStartingAt(date)(talk, talkIndex)

  t.deepEqual(expectedTalk, convertedTalk)
})

test('it should return expected meetup structure', t => {
  const meetup = {
    date: '16/04/2020',
    talks: [{
      id: 'talk1',
      title: 'mon premier talk',
      speakers: [{ id: 'speaker1', name: 'Jane Doe', link: 'jane_doe' }],
    }, {
      id: 'talk2',
      title: 'mon second talk',
      speakers: [{ id: 'speaker2', name: 'Wonder Woman', link: 'wonder_woman' }],
    }],
  }
  const expectedMeetup = {
    sessions: {
      talk1: {
        id: 'talk1',
        title: 'mon premier talk',
        startTime: new Date('2020-04-16 19:00'),
        endTime: new Date('2020-04-16 19:45'),
        trackTitle: 'main',
        speakers: ['speaker1'],
      },
      talk2: {
        id: 'talk2',
        title: 'mon second talk',
        startTime: new Date('2020-04-16 19:45'),
        endTime: new Date('2020-04-16 20:30'),
        trackTitle: 'main',
        speakers: ['speaker2'],
      },
    },
    speakers: {
      speaker1: {
        id: 'speaker1', name: 'Jane Doe', photoUrl: 'https://avatars.io/twitter/jane_doe',
        socials: [{ name: 'twitter', link: 'https://twitter.com/jane_doe' }],
      },
      speaker2: {
        id: 'speaker2', name: 'Wonder Woman', photoUrl: 'https://avatars.io/twitter/wonder_woman',
        socials: [{ name: 'twitter', link: 'https://twitter.com/wonder_woman' }],
      },
    }
  }

  const openfeedbackEvent = convertToOpenFeedbackModel(meetup)

  t.deepEqual(expectedMeetup, openfeedbackEvent)
})
