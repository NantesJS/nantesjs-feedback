const test = require('ava')
const keyById = require('./keyById.js')

test('should return an object with id as key', t => {
  const talks = [
    { id: 'id1', title: 'talk 1' },
    { id: 'id2', title: 'talk 2' },
  ]
  const expectedTalksById = {
    id1: { id: 'id1', title: 'talk 1' },
    id2: { id: 'id2', title: 'talk 2' },
  }

  const talksById = keyById(talks)

  t.deepEqual(talksById, expectedTalksById)
})
