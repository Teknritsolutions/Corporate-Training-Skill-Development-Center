(() => {
    const team = document.querySelector("#h2-team-size");
    const minutes = document.querySelector("#h2-weekly-minutes");
    if (!team || !minutes) return;
    const update = () => {
        const count = Number(team.value),
            weekly = Number(minutes.value);
        document.querySelector("#h2-team-output").textContent = count;
        document.querySelector("#h2-minutes-output").textContent = weekly;
        document.querySelector("[data-learning-hours]").textContent = new Intl.NumberFormat("en", {
            maximumFractionDigits: 1,
        }).format((count * weekly * 4) / 60);
        const reflection = Math.round(weekly / 3);
        document.querySelector("[data-practice-minutes]").textContent = weekly - reflection;
        document.querySelector("[data-reflection-minutes]").textContent = reflection;
    };
    team.addEventListener("input", update);
    minutes.addEventListener("input", update);
    update();
})();
