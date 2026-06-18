// inject.js — runs in the page's MAIN world at document_start.
// Overrides navigator.geolocation so sites receive spoofed coordinates.
(function () {
  'use strict';
  if (window.__teleportInstalled) return;
  window.__teleportInstalled = true;

  let spoof = null;        // { enabled, lat, lng, accuracy, label }
  let ready = false;       // have we received the first state from the bridge?
  const pending = [];      // calls made before the first state arrives
  const watchers = new Map(); // ourId -> { success, error, options, realId }
  let nextId = 1;

  const geo = navigator.geolocation;
  const origGet   = geo ? geo.getCurrentPosition.bind(geo) : null;
  const origWatch = geo ? geo.watchPosition.bind(geo)      : null;
  const origClear = geo ? geo.clearWatch.bind(geo)         : null;

  const isOn = () => !!(spoof && spoof.enabled);

  function position() {
    return {
      coords: {
        latitude: spoof.lat,
        longitude: spoof.lng,
        accuracy: spoof.accuracy || 20,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };
  }

  function getCurrentPosition(success, error, options) {
    const run = () => {
      if (isOn()) {
        try { success(position()); } catch (_) {}
      } else if (origGet) {
        origGet(success, error, options);
      } else if (typeof error === 'function') {
        error({ code: 2, message: 'Position unavailable', PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 });
      }
    };
    ready ? run() : pending.push(run);
  }

  function watchPosition(success, error, options) {
    const id = nextId++;
    const entry = { success, error, options, realId: null };
    watchers.set(id, entry);
    const start = () => {
      if (isOn()) {
        try { success(position()); } catch (_) {}
      } else if (origWatch) {
        entry.realId = origWatch(success, error, options);
      }
    };
    ready ? start() : pending.push(start);
    return id;
  }

  function clearWatch(id) {
    const entry = watchers.get(id);
    if (entry) {
      if (entry.realId != null && origClear) origClear(entry.realId);
      watchers.delete(id);
    } else if (origClear) {
      origClear(id);
    }
  }

  // When the spoof state changes live, keep active watches in sync.
  function refreshWatchers() {
    watchers.forEach((entry) => {
      if (isOn()) {
        if (entry.realId != null && origClear) { origClear(entry.realId); entry.realId = null; }
        try { entry.success(position()); } catch (_) {}
      } else if (entry.realId == null && origWatch) {
        entry.realId = origWatch(entry.success, entry.error, entry.options);
      }
    });
  }

  window.addEventListener('message', (e) => {
    if (e.source !== window) return;
    const d = e.data;
    if (!d || d.__teleport !== true || !('payload' in d)) return;
    spoof = d.payload;
    if (!ready) {
      ready = true;
      while (pending.length) { try { pending.shift()(); } catch (_) {} }
    } else {
      refreshWatchers();
    }
  });

  if (geo) {
    try {
      geo.getCurrentPosition = getCurrentPosition;
      geo.watchPosition = watchPosition;
      geo.clearWatch = clearWatch;
    } catch (_) {
      // Some hardened pages freeze the object; nothing we can do there.
    }
  }
})();
