function showSeason(seasonId) {
    document.querySelectorAll('.season-table').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('active');
    });

    document.getElementById(seasonId).classList.add('active');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.innerText === seasonId) {
            btn.classList.add('active');
        }
    });
}

function toggleRow(el) {
    const td = el.closest("td");
    if (!td) return;

    const container = td.querySelector(".resonance-container");
    if (!container) return;

    container.classList.toggle("active");

    const icon = el.querySelector(".expand-icon");

    if (container.classList.contains("active")) {
        icon.textContent = "▼ Collapse";
    } else {
        icon.textContent = "▶ Expand";
    }
}