const STORAGE_KEY = "loa_completed_achievements";
const EXPORT_META_KEY = "loa_completed_export_meta";

let activeCategory = null;

function loadCompleted() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}

function saveCompleted(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function saveExportMeta() {
    localStorage.setItem(
        EXPORT_META_KEY,
        JSON.stringify({ lastExport: new Date().toISOString() })
    );
}

function loadExportMeta() {
    try {
        return JSON.parse(localStorage.getItem(EXPORT_META_KEY)) || {};
    } catch {
        return {};
    }
}

function updateExportHint() {
    const hint = document.getElementById("export-hint");
    if (!hint) return;

    const meta = loadExportMeta();
    if (!meta.lastExport) {
        hint.textContent = "No exports yet";
        return;
    }

    const dt = new Date(meta.lastExport);
    hint.textContent = `Last export: ${dt.toLocaleString()}`;
}

function exportProgress() {
    const completed = loadCompleted();
    const payload = {
        exportedAt: new Date().toISOString(),
        completed
    };

    const blob = new Blob(
        [JSON.stringify(payload, null, 2)],
        { type: "application/json" }
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "lost_ark_achievement_progress.json";
    a.click();

    saveExportMeta();
    updateExportHint();
}

function importProgress(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);
            if (!data.completed || typeof data.completed !== "object") {
                alert("Invalid progress file");
                return;
            }

            saveCompleted(data.completed);
            applyCompletedState();
            renderCategorySummary();
            filterTable();
        } catch {
            alert("Failed to import progress file");
        }
    };

    reader.readAsText(file);
}


function applyCompletedState() {
    const completed = loadCompleted();
    document.querySelectorAll("tr[data-id]").forEach(row => {
        const id = row.dataset.id;
        const isDone = !!completed[id];
        row.dataset.completed = isDone ? "yes" : "no";
        row.classList.toggle("completed", isDone);
        const cb = row.querySelector(".completed-checkbox");
        if (cb) cb.checked = isDone;
    });
}

function filterTable() {
    const text = document.getElementById("search-box").value.toLowerCase();
    const fEnabled = document.getElementById("filter-enabled").value;
    const fHidden = document.getElementById("filter-hidden").value;
    const fCompleted = document.getElementById("filter-completed").value;
    const fCat = activeCategory;

    document
      .querySelectorAll(".ach-table:not(.hidden) tbody tr")
      .forEach(row => {

        let visible = true;

        if (fEnabled !== "any" && row.dataset.enabled !== fEnabled) visible = false;
        if (fHidden !== "any" && row.dataset.hidden !== fHidden) visible = false;
        if (fCompleted !== "any" && row.dataset.completed !== fCompleted) visible = false;
        if (!row.textContent.toLowerCase().includes(text)) visible = false;
        if (fCat && row.dataset.catMain !== fCat) visible = false;

        row.style.display = visible ? "" : "none";
    });
}

document.addEventListener("change", e => {
    if (!e.target.classList.contains("completed-checkbox")) return;

    const id = e.target.dataset.id;
    const completed = loadCompleted();
    completed[id] = e.target.checked;
    saveCompleted(completed);
    applyCompletedState();
    renderCategorySummary();
});

window.addEventListener("load", () => {
    applyCompletedState();
    renderCategorySummary();
    filterTable();
    updateExportHint();
});


function showTab(btn, tab) {
    const tableAll = document.getElementById("ach-table-all");
    const tableNew = document.getElementById("ach-table-new");

    tableAll.classList.add("hidden");
    tableNew.classList.add("hidden");

    document.querySelectorAll(".tab-btn").forEach(b => {
        b.classList.remove("active");
    });

    btn.classList.add("active");

    if (tab === "all") {
        tableAll.classList.remove("hidden");
    } else {
        tableNew.classList.remove("hidden");
    }

    filterTable();
}

function computeCategoryStats() {
    const completed = loadCompleted();
    const stats = {};

    document.querySelectorAll("tr[data-cat-main]").forEach(row => {
        const main = row.dataset.catMain;
        const sub = row.dataset.catSub;
        const id = row.dataset.id;

        if (!stats[main]) {
            stats[main] = {
                total: 0,
                completed: 0,
                subs: {}
            };
        }

        stats[main].total++;

        if (completed[id]) {
            stats[main].completed++;
        }

        if (!stats[main].subs[sub]) {
            stats[main].subs[sub] = { total: 0, completed: 0 };
        }

        stats[main].subs[sub].total++;
        if (completed[id]) {
            stats[main].subs[sub].completed++;
        }
    });

    return stats;
}

function clearCategoryFilter() {
    activeCategory = null;
    document
      .querySelectorAll(".ach-table:not(.hidden) tbody tr")
      .forEach(row => {
          row.style.display = "";
      });
	renderCategorySummary(); // re-render category to account for "default" state (all)
    filterTable(); // reapply text / dropdown filters
}


function renderCategorySummary() {
    const stats = computeCategoryStats();
    const container = document.getElementById("category-summary");
    container.innerHTML = "";

    // ALL COUNTER
    let total = 0;
    let completed = 0;

    Object.values(stats).forEach(cat => {
        total += cat.total;
        completed += cat.completed;
    });

    const allDiv = document.createElement("div");
    allDiv.className = "category-item";
    allDiv.innerHTML = `<strong>All</strong>: ${completed} / ${total}`;
    allDiv.onclick = () => clearCategoryFilter();
    if (!activeCategory) {
        allDiv.classList.add("active");
    }
    container.appendChild(allDiv);


    // CATEGORY COUNTERS
    Object.entries(stats).forEach(([catId, data]) => {
        const div = document.createElement("div");
        div.className = "category-item";
        div.dataset.catMain = catId;
        
        if (activeCategory === catId) {
            div.classList.add("active");
        }
        div.innerHTML = `<strong>${getCategoryName(catId)}</strong>: ${data.completed} / ${data.total}`;
        div.onclick = () => filterByCategory(catId);
        container.appendChild(div);
    });
}


function getCategoryName(catId) {
    const row = document.querySelector(`tr[data-cat-main="${catId}"]`);
    if (!row) return catId;
    const cell = row.querySelector(".col-cat");
    return cell ? cell.textContent.split(" / ")[0] : catId;
}

function filterByCategory(catMain) {
    activeCategory = catMain;

    document.querySelectorAll(".category-item").forEach(el => {
        el.classList.toggle(
            "active",
            el.dataset.catMain === catMain
        );
    });

    filterTable();
}