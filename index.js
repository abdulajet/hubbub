require('dotenv').config()
const admin = require('firebase-admin')
const serviceAccount = require('./firebase.json')
const topic = 'training'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://hubbub-e7e02.firebaseio.com'
})

module.exports = (robot) => {
  // Your code here
  console.log('Yay, the app was loaded!')

  robot.on('issues.opened', async context => {
    const payload = {
      data: {
        url: context.payload.issue.html_url,
        title: context.payload.issue.title,
        user: context.payload.issue.user.login
      }
    }

    if (context.payload.issue.user.login === 'abdulajet' || context.payload.issue.user.login === 'joenash') {
      toFirebase(payload)
    }
  })
}

function toFirebase (payload) {
  // Send a message to devices subscribed to the provided topic.
  admin.messaging().sendToTopic(topic, payload)
    .then(function (response) {
      console.log('Successfully sent message:', response)
    })
    .catch(function (error) {
      console.log('Error sending message:', error)
    })
}
