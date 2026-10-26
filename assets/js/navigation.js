(() => {
    const root = document.documentElement;
    const nav = document.getElementById("primary-nav");
    const toggle = document.querySelector(".menu-toggle");
    const mobile = matchMedia("(max-width: 1250px)");
    let closeMenu = () => {};
    if (nav && toggle) {
        const close = document.createElement("button");
        close.type = "button";
        close.className = "nav-close icon-button";
        close.setAttribute("aria-label", "Close navigation");
        close.innerHTML = '<i class="bi bi-x-lg" aria-hidden="true"></i>';
        const heading = document.createElement("div");
        heading.className = "nav-heading";
        const brand = document.querySelector(".site-header .brand")?.cloneNode(true);
        if (brand) heading.append(brand);
        heading.append(close);
        nav.prepend(heading);
        const backdrop = document.createElement("div");
        backdrop.className = "nav-backdrop";
        backdrop.hidden = true;
        document.body.append(backdrop);
        const setMenu = (open, restoreFocus = true) => {
            nav.classList.toggle("open", open);
            toggle.setAttribute("aria-expanded", String(open));
            document.body.classList.toggle("nav-open", open);
            backdrop.hidden = !open;
            if (open) close.focus();
            else if (restoreFocus) toggle.focus();
        };
        closeMenu = () => setMenu(false);
        toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
        close.addEventListener("click", closeMenu);
        backdrop.addEventListener("click", closeMenu);
        nav.addEventListener("click", (event) => {
            if (mobile.matches && event.target.closest("a")) setMenu(false, false);
        });
        mobile.addEventListener("change", () => setMenu(false, false));
        document.addEventListener("keydown", (event) => {
            if (!mobile.matches || !nav.classList.contains("open") || event.key !== "Tab") return;
            const items = [...nav.querySelectorAll("a, button")].filter((item) => item.getClientRects().length);
            const first = items[0];
            const last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
    }
    const syncControls = () => {
        document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
            const dark = root.dataset.theme === "dark";
            button.setAttribute("aria-pressed", String(dark));
            button.setAttribute(
                "aria-label",
                dark ? "Switch to light mode" : "Switch to dark mode",
            );
            button.innerHTML = `<i class="bi bi-${dark ? "sun" : "moon"}" aria-hidden="true"></i>`;
        });
        document
            .querySelectorAll("[data-rtl-toggle]")
            .forEach((button) => button.setAttribute("aria-pressed", String(root.dir === "rtl")));
    };
    const save = (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch {
            /* Preferences still work for this page. */
        }
    };
    document.addEventListener("click", (event) => {
        if (event.target.closest("[data-theme-toggle]")) {
            root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
            save("elevora-theme", root.dataset.theme);
            syncControls();
            document.dispatchEvent(new Event("themechange"));
        }
        if (event.target.closest("[data-rtl-toggle]")) {
            root.dir = root.dir === "rtl" ? "ltr" : "rtl";
            save("elevora-direction", root.dir);
            syncControls();
        }
        const trigger = event.target.closest(".nav-dropdown > button");
        document.querySelectorAll(".nav-dropdown > button").forEach((button) => {
            const open = button === trigger && button.getAttribute("aria-expanded") !== "true";
            button.setAttribute("aria-expanded", String(open));
            document.getElementById(button.getAttribute("aria-controls")).hidden = !open;
        });
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            const open = document.querySelector(".nav-dropdown > button[aria-expanded=true]");
            if (open) {
                open.setAttribute("aria-expanded", "false");
                document.getElementById(open.getAttribute("aria-controls")).hidden = true;
                open.focus();
            } else {
                if (nav?.classList.contains("open")) closeMenu();
            }
        }
        if (event.key === "ArrowDown" && event.target.matches(".nav-dropdown > button")) {
            event.preventDefault();
            event.target.setAttribute("aria-expanded", "true");
            const panel = document.getElementById(event.target.getAttribute("aria-controls"));
            panel.hidden = false;
            panel.querySelector("a").focus();
        }
    });
    const current = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".primary-nav a").forEach((anchor) => {
        if (anchor.getAttribute("href")?.split("?")[0] === current) {
            anchor.classList.add("active");
            anchor.setAttribute("aria-current", "page");
            anchor.closest(".nav-dropdown")?.querySelector("button").classList.add("active");
        }
    });
    addEventListener(
        "scroll",
        () => document.querySelector(".site-header")?.classList.toggle("scrolled", scrollY > 10),
        { passive: true },
    );
    document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
        const button = dropdown.querySelector("button");
        const panel = dropdown.querySelector(".dropdown-panel");
        const setOpen = (open) => {
            button.setAttribute("aria-expanded", String(open));
            panel.hidden = !open;
        };
        dropdown.addEventListener("mouseenter", () => {
            if (matchMedia("(hover: hover) and (min-width: 1251px)").matches) setOpen(true);
        });
        dropdown.addEventListener("mouseleave", () => {
            if (
                matchMedia("(hover: hover) and (min-width: 1251px)").matches &&
                !dropdown.contains(document.activeElement)
            )
                setOpen(false);
        });
        dropdown.addEventListener("focusout", (event) => {
            if (!dropdown.contains(event.relatedTarget)) setOpen(false);
        });
    });
    syncControls();
})();
