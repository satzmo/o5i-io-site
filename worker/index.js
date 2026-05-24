// o5i.io edge worker: serve static assets + collect cookieless dwell-time beacons.
// Static assets are served first by the platform; this Worker runs for /_da
// (dwell analytics) and anything that doesn't match an asset.

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/_da" && request.method === "POST") {
      try {
        const d = await request.json();
        // clamp dwell to [0, 30min] ms; scroll to [0,100]
        const dwell = Math.min(Math.max(parseInt(d.t, 10) || 0, 0), 1_800_000);
        const scroll = Math.min(Math.max(parseInt(d.s, 10) || 0, 0), 100);
        const cf = request.cf || {};
        env.o5i_io_analytic_engine.writeDataPoint({
          // blobs: path, country, deviceType(client), os(client), botFlag(headless?),
          //        referred?, city, region(시·도), colo(CF edge PoP) — geo from request.cf
          blobs: [
            String(d.p || url.pathname).slice(0, 64),
            cf.country || "??",
            String(d.dt || "?").slice(0, 16),
            String(d.os || "?").slice(0, 24),
            d.hl ? "headless" : "normal",
            d.r ? "ref" : "direct",
            String(cf.city || "?").slice(0, 48),
            String(cf.region || "?").slice(0, 48),
            String(cf.colo || "?").slice(0, 8),
          ],
          doubles: [dwell, scroll],
          indexes: [String(d.p || url.pathname).slice(0, 32)],
        });
      } catch (_) {
        // swallow: a malformed beacon must never error the edge
      }
      return new Response(null, { status: 204 });
    }

    // everything else → static assets (index.html, favicon, etc.)
    return env.ASSETS.fetch(request);
  },
};
