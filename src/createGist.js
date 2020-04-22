const { Octokit } = require('@octokit/rest')

function createGist(content) {
  const client = new Octokit({ auth: process.env.GITHUB_TOKEN })

  return client.gists.create({
    files: {
      'openfeedback.json': {
        content: JSON.stringify(content),
      }
    }
  }).then(response => {
    return response.data.files['openfeedback.json'].raw_url
  })
}

module.exports = createGist
