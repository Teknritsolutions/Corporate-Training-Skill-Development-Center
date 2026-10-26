/* Apply preferences before CSS paints; storage may be unavailable in private contexts. */
(() => {
    try {
        document.documentElement.dataset.theme =
            localStorage.getItem("elevora-theme") ||
            (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        document.documentElement.dir = localStorage.getItem("elevora-direction") || "ltr";
    } catch {
        document.documentElement.dataset.theme = "light";
    }
})();
