const utils = require('../../utils')
const Issue = utils.issues.Issue

const participantsInSubjects = (participants, subjects) => {
  //console.log('Test')
  // console.log('Participants (inSubjects): ' + participants)
  // console.log('Subjects: ' + subjects)
  const issues = []
  if (participants) {
    const participantsFromFile = participants.sort()
    //console.log('From file: ' + participantsFromFile)
    const participantsFromFolders = subjects.sort()
    //console.log('From folders: ' + participantsFromFolders)
    if (
      !utils.array.equals(participantsFromFolders, participantsFromFile, true)
    ) {
      //console.log('Issue 49 - subject mismatch')
      issues.push(
        new Issue({
          code: 49,
          evidence:
            'participants.tsv: ' +
            participantsFromFile.join(', ') +
            ' folder structure: ' +
            participantsFromFolders.join(', '),
          file: participants.file,
        }),
      )
    }
  }
  return issues
}

const atLeastOneSubject = fileList => {
  const issues = []
  const fileKeys = Object.keys(fileList)
  const hasSubjectDir = fileKeys.some(key => {
    const file = fileList[key]
    return file.relativePath && file.relativePath.startsWith('/sub-')
  })
  if (!hasSubjectDir) {
    issues.push(new Issue({ code: 45 }))
  }
  return issues
}

module.exports = {
  participantsInSubjects,
  atLeastOneSubject,
}
