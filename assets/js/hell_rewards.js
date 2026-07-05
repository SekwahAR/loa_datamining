// ---------------- GLOBAL ----------------
window.toggleDetails = function (btn) {
  const details = btn.nextElementSibling;
  details.classList.toggle('hidden');
  btn.textContent = details.classList.contains('hidden') ? 'Show' : 'Hide';
};

// ---------------- INIT ----------------
const tables = [...document.querySelectorAll('.reward-table')];
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
function updateILevels() {
  const mode = modeSelect.value;

  const prev = ilevelSelect.value;

  const ilevels = unique('ilevel').filter(i =>
    tables.some(t =>
      t.dataset.mode === mode &&
      t.dataset.ilevel === i
    )
  );

  const sorted = ilevels.sort((a, b) => Number(a) - Number(b));

  fillSelect(ilevelSelect, sorted);

  if (sorted.includes(prev)) {
    ilevelSelect.value = prev;
  } else if (sorted.length) {
    ilevelSelect.value = sorted[sorted.length - 1];
  }

  updateTable();
}

function updateTable() {
  const mode = modeSelect.value;
  const ilevel = ilevelSelect.value;

  tables.forEach(t => {
    t.style.display =
      (t.dataset.mode === mode &&
       t.dataset.ilevel === ilevel)
      ? "block"
      : "none";
  });
}

// ---------------- EVENTS ----------------
modeSelect.onchange = updateILevels;
ilevelSelect.onchange = updateTable;

//---------------- SMART DEFAULTS ----------------
const modes = unique("mode");

fillSelect(modeSelect, modes);

modeSelect.value = modes.includes("Destiny")
    ? "Destiny"
    : modes[0];

updateILevels();