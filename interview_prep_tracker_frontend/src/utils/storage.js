const STORAGE_KEY = "ipt:data";
const SCHEMA_VERSION = 1;

function clamp0to100(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

// PUBLIC_INTERFACE
export function createDefaultModel(now = new Date()) {
  /** Create the default persisted model for first-time users. */
  const iso = now.toISOString();
  return {
    version: SCHEMA_VERSION,
    lastUpdatedAt: iso,
    skills: {
      dsa: {
        id: "dsa",
        name: "DSA",
        progress: 35,
        target: 70,
        history: [{ at: iso, progress: 35, note: "Initialized" }],
      },
      systemDesign: {
        id: "systemDesign",
        name: "System Design",
        progress: 25,
        target: 65,
        history: [{ at: iso, progress: 25, note: "Initialized" }],
      },
      frontend: {
        id: "frontend",
        name: "Frontend",
        progress: 40,
        target: 75,
        history: [{ at: iso, progress: 40, note: "Initialized" }],
      },
    },
  };
}

function isValidModelShape(candidate) {
  if (!candidate || typeof candidate !== "object") return false;
  if (candidate.version !== SCHEMA_VERSION) return false;
  if (!candidate.skills || typeof candidate.skills !== "object") return false;
  const requiredKeys = ["dsa", "systemDesign", "frontend"];
  return requiredKeys.every((k) => candidate.skills[k] && typeof candidate.skills[k] === "object");
}

function normalizeModel(model) {
  const nowIso = new Date().toISOString();
  const fallback = createDefaultModel(new Date());
  if (!isValidModelShape(model)) return fallback;

  const normalized = { ...model };
  normalized.lastUpdatedAt = typeof model.lastUpdatedAt === "string" ? model.lastUpdatedAt : nowIso;

  normalized.skills = { ...model.skills };
  ["dsa", "systemDesign", "frontend"].forEach((k) => {
    const s = model.skills[k];
    normalized.skills[k] = {
      id: s.id || fallback.skills[k].id,
      name: s.name || fallback.skills[k].name,
      progress: clamp0to100(s.progress),
      target: clamp0to100(s.target),
      history: Array.isArray(s.history) ? s.history.slice(0, 200) : fallback.skills[k].history,
    };
  });

  return normalized;
}

// PUBLIC_INTERFACE
export function loadModel() {
  /** Load persisted model from localStorage. Returns defaults if missing/invalid. */
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultModel(new Date());
    const parsed = JSON.parse(raw);
    return normalizeModel(parsed);
  } catch (_e) {
    return createDefaultModel(new Date());
  }
}

// PUBLIC_INTERFACE
export function saveModel(model) {
  /** Save model to localStorage. Errors are swallowed to keep UI usable in restricted environments. */
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(model));
  } catch (_e) {
    // no-op
  }
}

// PUBLIC_INTERFACE
export function resetModel() {
  /** Reset persisted model back to defaults. */
  const next = createDefaultModel(new Date());
  saveModel(next);
  return next;
}
