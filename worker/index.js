// o5i.io edge worker: serve static assets.
// The cookieless dwell-time beacon (/_da → Analytics Engine) was removed on
// 2026-07-21 — site analytics collection is discontinued. This Worker now only
// passes requests through to the static assets.

export default {
  async fetch(request, env, ctx) {
    return env.ASSETS.fetch(request);
  },
};
