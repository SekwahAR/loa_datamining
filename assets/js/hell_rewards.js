document.addEventListener('DOMContentLoaded', () => {

  window.toggleDetails = function (b) {
      const d = b.nextElementSibling;
      d.classList.toggle('hidden');
      b.textContent = d.classList.contains('hidden') ? 'Show' : 'Hide';
    };


  const tables = [...document.querySelectorAll('.reward-table')];

  const seasonSelect = document.getElementById('seasonSelect');
  const modeSelect   = document.getElementById('modeSelect');
  const ilevelSelect = document.getElementById('ilevelSelect');

  function unique(attr) {
    return [...new Set(tables.map(t => t.dataset[attr]))];
  }

  function fillSelect(select, values) {
    select.innerHTML = values
      .map(v => `<option value="${v}">${v}</option>`)
      .join('');
  }

  fillSelect(seasonSelect, unique('season'));

  function updateModes() {
    const season = seasonSelect.value;
    const modes = unique('mode').filter(m =>
      tables.some(t => t.dataset.season === season && t.dataset.mode === m)
    );
    fillSelect(modeSelect, modes);
    updateILevels();
  }

  function updateILevels() {
    const season = seasonSelect.value;
    const mode   = modeSelect.value;
    const ilevels = unique('ilevel').filter(i =>
      tables.some(t =>
        t.dataset.season === season &&
        t.dataset.mode === mode &&
        t.dataset.ilevel === i
      )
    );
    fillSelect(ilevelSelect, ilevels);
    updateTable();
  }

  function updateTable() {
    const s = seasonSelect.value;
    const m = modeSelect.value;
    const i = ilevelSelect.value;

    tables.forEach(t => {
      t.style.display =
        t.dataset.season === s &&
        t.dataset.mode === m &&
        t.dataset.ilevel === i
          ? 'block'
          : 'none';
    });
  }

  seasonSelect.onchange = updateModes;
  modeSelect.onchange   = updateILevels;
  ilevelSelect.onchange = updateTable;

  updateModes(); // initial render
});