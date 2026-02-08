function showTab(tabId) {
    // Hide all tables
    document.querySelectorAll(".table-wrap").forEach(el => {
        el.classList.add("hidden");
    });

    // Remove active state from buttons
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    // Show selected tab
    const target = document.getElementById(tabId);
    if (target) {
        target.classList.remove("hidden");
    }

    // Activate button
    document.querySelectorAll(".tab-btn").forEach(btn => {
        if (btn.getAttribute("onclick")?.includes(`'${tabId}'`)) {
            btn.classList.add("active");
        }
    });
}

// Ensure default tab is visible on load
document.addEventListener("DOMContentLoaded", () => {
    showTab("generic");
});