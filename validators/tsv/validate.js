const utils = require('../../utils')
const tsv = require('./tsv')

const validate = (
  files,
  fileList,
  tsvs,
  events,
  //participants,
  //phenotypeParticipants,
  stimuli,
) => {
  let issues = []
  let participants = []
  let phenotypeParticipants = []
  // validate tsv
  const tsvPromises = files.map(function(file) {
    return new Promise(resolve => {
      utils.files
        .readFile(file)
        .then(contents => {
          // Push TSV to list for custom column verification after all data dictionaries have been read
          tsvs.push({
            file: file,
            contents: contents,
          })
          if (file.name.endsWith('_events.tsv')) {
            events.push({
              file: file,
              path: file.relativePath,
              contents: contents,
            })
          }
          tsv(file, contents, fileList, function(
            tsvIssues,
            participantList,
            stimFiles,
          ) {
            if (participantList) {
              if (file.name.endsWith('participants.tsv')) {
                //console.log('Participants!: ' + participantList)
                participants.push(participantList)
              } else if (file.relativePath.includes('phenotype/')) {
                //console.log('Phenotype Participants!: ' + participantList)
                phenotypeParticipants.push(participantList)
              }
            }
            if (stimFiles && stimFiles.length) {
              // add unique new events to the stimuli.events array
              stimuli.events = [...new Set([...stimuli.events, ...stimFiles])]
            }
            issues = issues.concat(tsvIssues)
            return resolve()
          })
        })
        .catch(issue => {
          issues = issues.concat(issue)
          return resolve()
        })
    })
  })

  return new Promise(resolve =>
    Promise.all(tsvPromises).then(() => {
      const results = {
        issues: issues,
        participants: participants,
        phenotypeParticipants: phenotypeParticipants,
      }
      //console.log('Participants (in promise): ' + JSON.stringify(participants))
      //console.log('In Phenotype Particpipants (in promise): ' + JSON.stringify(phenotypeParticipants))
      resolve(results)
    }),
  )
}

module.exports = validate
