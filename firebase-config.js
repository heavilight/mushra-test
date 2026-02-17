// =============================================================================
// Firebase Configuration for webMUSHRA
// =============================================================================
//
// SETUP STEPS (one-time, ~5 minutes, no credit card required):
//
// 1. Go to https://console.firebase.google.com and sign in with a Google account.
// 2. Click "Add project", give it a name (e.g. "mushra-test"), skip Google Analytics.
// 3. In the project dashboard, click the </> (Web) icon to register a web app.
//    Give it a nickname and click "Register app".
// 4. Copy the firebaseConfig object shown and paste it below, replacing the
//    placeholder values.
// 5. In the left sidebar go to Build > Firestore Database.
//    Click "Create database", choose "Start in test mode" (allows unauthenticated
//    writes for 30 days – enough to run your study; you can extend in the Rules tab).
//    Pick a region close to you, click "Enable".
// 6. (Optional, recommended) After your study, update the Firestore Rules to
//    lock down writes:
//
//      rules_version = '2';
//      service cloud.firestore {
//        match /databases/{database}/documents {
//          match /mushra_results/{docId} {
//            allow create: if true;   // anyone can submit
//            allow read, update, delete: if false;
//          }
//        }
//      }
//
// 7. Results appear in Firestore Console under the "mushra_results" collection.
//    You can export them as JSON/CSV from the console or via the Admin SDK.
//
// =============================================================================


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuKzpwdDucm_HjzBjXbDtvfNPLtVoPwhQ",
  authDomain: "audio-compression-mushra.firebaseapp.com",
  projectId: "audio-compression-mushra",
  storageBucket: "audio-compression-mushra.firebasestorage.app",
  messagingSenderId: "500703513719",
  appId: "1:500703513719:web:a5762730dec928c82c0a72"
};

// --- Do not edit below this line ---

(function () {
  try {
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();

    // Exposed globally so DataSender can call it
    window.sendToFirebase = function (session) {
      var payload = {
        testId:      session.testId,
        uuid:        session.uuid,
        submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
        participant: JSON.parse(JSON.stringify({
          fields:    session.participant.name    || [],
          responses: session.participant.response || []
        })),
        trials: JSON.parse(JSON.stringify((session.trials || []).map(function (trial) {
          return {
            id:        trial.id   || null,
            type:      trial.type || null,
            responses: (trial.responses || []).map(function (r) {
              return {
                stimulusId: r.stimulus ? r.stimulus.id       : null,
                filepath:   r.stimulus ? r.stimulus.filepath : null,
                score:      r.score   !== undefined ? r.score   : null,
                comment:    r.comment !== undefined ? r.comment : null,
                time:       r.time    !== undefined ? r.time    : null
              };
            })
          };
        })))
      };

      return db.collection('mushra_results')
        .add(payload)
        .then(function (ref) {
          console.log('[Firebase] Results saved – document id:', ref.id);
        })
        .catch(function (err) {
          console.error('[Firebase] Write failed:', err);
          throw err;
        });
    };

    console.log('[Firebase] Initialized successfully.');
  } catch (e) {
    console.warn('[Firebase] Initialization failed – results will only be saved locally via PHP.', e);
    window.sendToFirebase = null;
  }
})();
