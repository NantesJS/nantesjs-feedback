function keyById(arr) {
  return arr.reduce((acc, obj) => ({
    ...acc,
    [obj.id]: obj,
  }), {})
}

module.exports = keyById
