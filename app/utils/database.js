var moment = require("moment");
var Firestore = require('@google-cloud/firestore');

const db = new Firestore({ projectId: process.env.GCP_PROJECT });

async function get_birthday(username, res) {
  try {
    const userRef = db.collection('users').doc(username);
    const doc = await userRef.get();
    if (!doc.exists) {
      res.sendStatus(404);
    } else {
      return moment.unix(doc.data().birthday);
    }
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
  return null;
}

async function store_birthday(username, birthday) {
  try {
    const docRef = db.collection('users').doc(username);
    await docRef.set({
      birthday: birthday
    });
    return 0;
  } catch (error) {
    console.log(error);
    return 1;
  }
}

module.exports = {
  get_birthday,
  store_birthday
}
