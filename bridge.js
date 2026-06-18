// bridge.js — runs in the ISOLATED world of every frame at document_start.
// Reads the single saved pin from chrome.storage and relays it to the page,
// then keeps the page updated whenever the popup changes the setting.
(function () {
  'use strict';

  function relay() {
    try {
      chrome.storage.local.get(['spoof'], (res) => {
        const payload = (res && res.spoof) ? res.spoof : { enabled: false };
        window.postMessage({ __teleport: true, payload }, '*');
      });
    } catch (_) {}
  }

  relay();

  if (chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.spoof) relay();
    });
  }
})();
