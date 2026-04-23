// ---------------- GLOBAL ----------------
window.toggleDetails = function (btn) {
  const details = btn.nextElementSibling;
  details.classList.toggle('hidden');
  btn.textContent = details.classList.contains('hidden') ? 'Show' : 'Hide';
};

// ---------------- INIT ----------------
const tables = [...document.querySelectorAll('.reward-table')];

const seasonSelect = document.getElementById('seasonSelect');
const modeSelect   = document.getElementById('modeSelect');
const ilevelSelect = document.getElementById('ilevelSelect');

// ---------------- HELPERS ----------------
function unique(attr) {
  return [...new Set(
    tables
      .map(t => t.dataset[attr])
      .filter(v => typeof v === "string" && v.trim() !== "")
  )];
}

function fillSelect(select, values) {
  select.innerHTML = values
    .map(v => `<option value="${v}">${v}</option>`)
    .join('');
}

// Extract number safely (for sorting like "1730 New")
function extractNumber(str) {
  return parseInt(str?.match(/\d+/)?.[0] || 0);
}

// ---------------- FILTER LOGIC ----------------
function updateModes() {
  const season = seasonSelect.value;

  const modes = unique('mode').filter(m =>
    tables.some(t =>
      t.dataset.season === season &&
      t.dataset.mode === m
    )
  );

  fillSelect(modeSelect, modes);

  // default selection safety
  if (!modes.includes(modeSelect.value)) {
    modeSelect.value = modes[0];
  }

  updateILevels();
}

function updateILevels() {
  const season = seasonSelect.value;
  const mode   = modeSelect.value;

  const prev = ilevelSelect.value;

  const ilevels = unique('ilevel').filter(i =>
    tables.some(t =>
      t.dataset.season === season &&
      t.dataset.mode === mode &&
      t.dataset.ilevel === i
    )
  );

  // sort numerically
  const sorted = ilevels.sort((a, b) => extractNumber(a) - extractNumber(b));

  fillSelect(ilevelSelect, sorted);

  // preserve selection if possible
  if (sorted.includes(prev)) {
    ilevelSelect.value = prev;
  }

  updateTable();
}

function updateTable() {
  const s = seasonSelect.value;
  const m = modeSelect.value;
  const i = ilevelSelect.value;

  tables.forEach(t => {
    const match =
      t.dataset.season === s &&
      t.dataset.mode === m &&
      t.dataset.ilevel === i;

    t.style.display = match ? 'block' : 'none';
  });
}

// ---------------- EVENTS ----------------
seasonSelect.onchange = updateModes;
modeSelect.onchange   = updateILevels;
ilevelSelect.onchange = updateTable;

// ---------------- DEFAULTS ----------------
function setSmartDefaults() {
  // --- Seasons ---
  const seasons = unique('season');

  const sortedSeasons = seasons.sort(
    (a, b) => extractNumber(a) - extractNumber(b)
  );

  fillSelect(seasonSelect, sortedSeasons);

  // highest season
  seasonSelect.value = sortedSeasons[sortedSeasons.length - 1];

  // --- Modes ---
  updateModes();

  const modes = [...modeSelect.options].map(o => o.value);

  // prefer Destiny if exists
  modeSelect.value = modes.includes("Destiny")
    ? "Destiny"
    : modes[0];

  // --- iLevels ---
  updateILevels();

  const ilevels = [...ilevelSelect.options].map(o => o.value);

  const sortedIlevels = ilevels.sort(
    (a, b) => extractNumber(a) - extractNumber(b)
  );

  // highest ilevel
  ilevelSelect.value = sortedIlevels[sortedIlevels.length - 1];

  // --- Final render ---
  updateTable();
}

// ---------------- START ----------------
setSmartDefaults();