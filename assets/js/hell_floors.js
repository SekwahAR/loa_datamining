function showTab(id) {
    document.querySelectorAll('.table-wrap').forEach(e => e.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(e => e.classList.remove('active'));

    document.getElementById(id).classList.remove('hidden');

    [...document.querySelectorAll('.tab-btn')]
        .find(b => b.textContent === id)
        .classList.add('active');
}

let filterOn = false;

function toggleSpecial() {
    filterOn = !filterOn;

    document.querySelectorAll("tr.normal-row").forEach(row => {
        row.style.display = filterOn ? "none" : "";
    });

    const btn = document.querySelector(".filter-btn");
    btn.textContent = filterOn ? "Show All Floors" : "Show Specials Only";
}