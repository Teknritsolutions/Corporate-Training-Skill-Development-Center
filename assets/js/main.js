(() => {
    document.querySelector("[data-copy-link]")?.addEventListener("click", async () => {
        const status = document.querySelector("[data-copy-status]");
        try {
            await navigator.clipboard.writeText(location.href);
            status.textContent = "Article link copied.";
        } catch {
            status.textContent = "Copy this address: " + location.href;
        }
    });
})();
