/**
 * Demo-stream fixtures for the simulator panel, keyed by use case id — the
 * clickdummy twin of what the real PoC reads live from the demo-data
 * generator's registry (GET /simulations). Stream names, topics and payload
 * shapes mirror the real packages so the dummy demos the same story.
 *
 * A use case with NO entry here renders no panel at all — offering a control
 * that can only answer "nothing to do" reads as an error (real-PoC finding 36).
 *
 * Which use cases those are is a limit of the current generator, NOT a property
 * of master data. A tree register changes constantly — plantings, fellings,
 * condition surveys — and simulating it would exercise the SQL/cron path end to
 * end, which is arguably the better demo. What stops it today is that such a
 * generator would have to WRITE into a Fachverfahren database rather than
 * publish to a broker: it needs write credentials on someone's system of
 * record, its rows accumulate and need a reset path, and a realistic cadence
 * (weekly, seasonal) is invisible in a five-minute demo unless the time
 * compression is stated out loud. Those are different requirements, not a
 * different config — see the task candidate in ptf-meta-stuff.
 */

export interface DemoStream {
  name: string;
  topic: string;
  intervalSeconds: number;
  active: boolean;
  publishedCount: number;
  /** Numeric fields get jittered by the panel's tick, timestamp is refreshed. */
  samplePayload: Record<string, string | number>;
}

export const DEMO_STREAMS: Record<string, DemoStream[]> = {
  "musterhausen-trafficcounter": [
    {
      name: "zaehlstelle-hafen",
      topic: "openurbanapps/verkehrszaehlung",
      intervalSeconds: 10,
      active: true,
      publishedCount: 8412,
      samplePayload: {
        counterId: "Z-004",
        timestamp: "2026-08-28T11:58:12.000Z",
        vehicleCount: 28,
        avgSpeedKmh: 31.8,
        direction: "inbound",
      },
    },
    {
      name: "zaehlstelle-promenade",
      topic: "openurbanapps/verkehrszaehlung",
      intervalSeconds: 10,
      active: true,
      publishedCount: 8409,
      samplePayload: {
        counterId: "Z-001",
        timestamp: "2026-08-28T11:58:12.000Z",
        vehicleCount: 40,
        avgSpeedKmh: 25.7,
        direction: "outbound",
      },
    },
    {
      name: "zaehlstelle-ring",
      topic: "openurbanapps/verkehrszaehlung",
      intervalSeconds: 10,
      active: true,
      publishedCount: 8410,
      samplePayload: {
        counterId: "Z-003",
        timestamp: "2026-08-28T11:58:12.000Z",
        vehicleCount: 120,
        avgSpeedKmh: 43.8,
        direction: "outbound",
      },
    },
    {
      name: "zaehlstelle-wolbecker",
      topic: "openurbanapps/verkehrszaehlung",
      intervalSeconds: 10,
      active: false,
      publishedCount: 6231,
      samplePayload: {
        counterId: "Z-002",
        timestamp: "2026-08-28T09:41:52.000Z",
        vehicleCount: 77,
        avgSpeedKmh: 35.1,
        direction: "outbound",
      },
    },
  ],
  // "tree-register-starter" deliberately absent: an SQL master-data package
  // bundles no simulations — no panel, rather than a panel that apologises.
};
