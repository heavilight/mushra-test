/*************************************************************************
         (C) Copyright AudioLabs 2017

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law.

**************************************************************************/

function DataSender(config) {
  this.target = config.remoteService;
}

DataSender.prototype.send = function(_session) {
  // --- Firebase (primary) ---
  // Fire-and-forget: async write so the UI isn't blocked.
  // sendToFirebase is defined in firebase-config.js; if it's null the file
  // either hasn't been configured yet or initialisation failed.
  var firebaseOk = false;
  if (typeof window.sendToFirebase === 'function') {
    try {
      window.sendToFirebase(_session);
      firebaseOk = true;
    } catch (e) {
      console.warn('[DataSender] Firebase send error:', e);
    }
  }

  // --- PHP backend (secondary / local fallback) ---
  var sessionJSON = JSON.stringify(_session);
  var httpReq = new XMLHttpRequest();
  var params = "sessionJSON=" + sessionJSON;
  try {
    httpReq.open("POST", config.remoteService, false);  // synchronous
    httpReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpReq.send(params);
  } catch (e) {
    // PHP backend unreachable – that's fine if Firebase succeeded.
    console.log('[DataSender] PHP backend unavailable:', e);
    return !firebaseOk;  // false = success when Firebase saved the data
  }
  if (httpReq.responseText !== "" || httpReq.status !== 200) {
    console.log('[DataSender] PHP response:', httpReq.responseText);
    return !firebaseOk;
  }
  return false;  // success
};
