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