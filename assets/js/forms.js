(() => {
    document.addEventListener("click", (event) => {
        const toggle = event.target.closest("[data-password-toggle]");
        if (!toggle) return;
        const input = toggle.previousElementSibling;
        input.type = input.type === "password" ? "text" : "password";
        toggle.setAttribute(
            "aria-label",
            input.type === "password" ? "Show password" : "Hide password",
        );
        toggle.innerHTML = `<i class="bi bi-${input.type === "password" ? "eye" : "eye-slash"}" aria-hidden="true"></i>`;
    });
    document.querySelectorAll("[data-demo-form], [data-auth-form]").forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!form.reportValidity()) return;
            const data = Object.fromEntries(new FormData(form));
            const status = form.querySelector(".form-status");
            status.classList.remove("error");
            const fail = (message) => {
                status.textContent = message;
                status.classList.add("error");
            };
            try {
                if (form.dataset.authForm === "register") {
                    if (data.password !== data.confirm)
                        return fail("Your passwords do not match. Please check both fields.");
                    localStorage.setItem(
                        "elevora-profile",
                        JSON.stringify({
                            name: data.name.trim(),
                            company: data.company.trim(),
                            email: data.email.trim(),
                        }),
                    );
                    status.textContent =
                        "Demo profile created. Use the sample credentials on the login page to enter the dashboard. Your password was not saved.";
                    form.reset();
                } else if (form.dataset.authForm === "login") {
                    if (
                        data.email.toLowerCase() !== "hr@elevora.example" ||
                        data.password !== "Elevora2026!"
                    )
                        return fail(
                            "Use the demo email hr@elevora.example and password Elevora2026!.",
                        );
                    (data.remember ? localStorage : sessionStorage).setItem(
                        "elevora-demo-session",
                        "true",
                    );
                    location.href = "dashboard/index.html";
                } else if (form.dataset.authForm === "forgot-password") {
                    status.textContent =
                        "Demo recovery: return to login and use hr@elevora.example with Elevora2026!. No reset email has been sent.";
                } else {
                    if (data.date && data.date < new Date().toLocaleDateString("en-CA"))
                        return fail("Please choose a preferred date today or later.");
                    const key =
                        form.dataset.demoForm === "newsletter"
                            ? "elevora-subscriptions"
                            : "elevora-inquiries";
                    const saved = JSON.parse(localStorage.getItem(key) || "[]");
                    saved.push({ ...data, created: new Date().toISOString() });
                    localStorage.setItem(key, JSON.stringify(saved));
                    status.textContent =
                        form.dataset.demoForm === "newsletter"
                            ? "Demo subscription saved in this browser. No email will be sent."
                            : "Thank you. Your demo inquiry has been saved in this browser. No message was sent.";
                    form.reset();
                }
            } catch {
                fail("Browser storage is unavailable. Enable site storage and try again.");
            }
        });
    });
})();
