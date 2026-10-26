(() => {
    const params = new URLSearchParams(location.search);
    if (document.querySelector("[data-program-title]")) {
        const requested = params.get("program") || document.body.dataset.program;
        const program =
            window.ElevoraPrograms.find((item) => item.id === requested) ||
            window.ElevoraPrograms[0];
        document.querySelectorAll("[data-program-title]").forEach(node => node.textContent = program.title);
        document.querySelector("[data-program-description]").textContent = program.description;
        document.querySelector("[data-program-duration]").textContent = program.duration;
        document.title = `${program.title} | Elevora`;
        document.querySelector("meta[name=description]").content = program.description;
        const descriptions = {
            communication: ["Listen for meaning, ask useful questions, and check understanding before responding.", "Structure concise emails and updates so your audience can quickly find the message and next step.", "Shape a clear presentation, use a confident delivery style, and respond to audience questions.", "Give specific feedback and handle sensitive conversations with empathy and clear expectations."],
            leadership: ["Recognise your leadership habits, clarify your values, and choose a personal development priority.", "Use open questions and constructive feedback to help colleagues find solutions and grow.", "Set clear outcomes, agree ownership, and follow up without taking over the work.", "Explain the purpose of change, listen to concerns, and help your team take practical next steps."],
            sales: ["Ask purposeful questions to understand customer priorities, challenges, and decision criteria.", "Connect your offer to a customer's needs and explain value using a relevant business example.", "Explore the concern behind an objection and respond with clarity rather than pressure.", "Prepare your priorities, explore trade-offs, and agree a clear, mutually useful next step."],
            technical: ["Build confidence with everyday digital tools, collaboration practices, and responsible information handling.", "Organise data, map a repeatable workflow, and identify opportunities to reduce manual effort.", "Work with colleagues to solve a realistic workplace challenge using the tools you have practised.", "Demonstrate your approach, explain your decisions, and identify the next skill to develop."]
        };
        document.querySelector("[data-program-modules]").innerHTML = program.modules.map((title, index) =>
            '<details class="program-module"><summary><span class="module-number">0' + (index + 1) + '</span><span class="module-label"><strong>' + title + '</strong><span>' + descriptions[program.id][index] + '</span></span><i class="bi bi-plus-lg" aria-hidden="true"></i></summary><div class="module-body"><p>Put this skill into practice through a guided workplace exercise, peer discussion, and facilitator feedback. Finish by choosing one action to apply in your role.</p></div></details>'
        ).join("");
        if (!document.body.dataset.program) {
            const intros = {"communication":{"slug":"communication-skills","image":"communication-workshop","intro":"Build the habits that make everyday communication clearer: listen with intention, organise your ideas, and adapt your message to the people in front of you. Guided practice helps your team handle presentations, written updates, and difficult conversations with greater confidence.","focus":"Clear conversations. Stronger collaboration."},"leadership":{"slug":"leadership-development","image":"leadership-workshop","intro":"Develop a practical approach to leading people, from setting clear expectations to coaching performance and navigating change. Reflect on your leadership style, practise everyday management conversations, and build an action plan that supports your team.","focus":"Lead with clarity. Help your team grow."},"sales":{"slug":"sales-excellence","image":"sales-coaching","intro":"Strengthen every stage of the customer conversation, from understanding a real business need to explaining value and agreeing the next step. Practise discovery, objection handling, and negotiation through realistic scenarios with constructive feedback.","focus":"Understand the customer. Build lasting value."},"technical":{"slug":"technical-upskilling","image":"technical-lab","intro":"Build confidence with the digital tools and workflows your team uses every day. Guided exercises connect digital foundations, data handling, and process improvement to an applied team project, helping learners turn new knowledge into useful working habits.","focus":"Practical digital skills for everyday work."}};
            const copy = document.querySelector('.vh-program-details .vh-copy');
            if (copy && !copy.querySelector('.program-intro')) { const intro = document.createElement('p'); intro.className = 'program-intro'; intro.textContent = intros[program.id].intro; copy.querySelector('.vh-action').before(intro); }
            const photo = document.querySelector('.vh-program-details .vh-photo');
            if (photo) { photo.src = '../assets/images/programs/' + program.id + '-hero.webp'; photo.alt = program.title + ' workshop for working professionals'; }
        }

    }
    document.querySelectorAll("[data-filter-controls]").forEach((controls) => {
        const list = document.getElementById(controls.dataset.filterControls);
        const items = [...list.children];
        const pager = document.querySelector(`[data-pagination="${list.id}"]`);
        const pageSize = Number(list.dataset.pageSize) || items.length;
        let page = 1;
        function update() {
            const search = controls.querySelector("[data-search-input]").value.trim().toLowerCase();
            const category = controls.querySelector("[data-category-input]").value;
            const matches = items.filter(
                (item) =>
                    (!search || item.dataset.search.includes(search)) &&
                    (category === "all" || item.dataset.category === category),
            );
            items.forEach((item) => (item.hidden = true));
            matches
                .slice((page - 1) * pageSize, page * pageSize)
                .forEach((item) => (item.hidden = false));
            document.querySelector(`[data-empty-for="${list.id}"]`).hidden = matches.length > 0;
            if (pager) {
                pager.innerHTML = Array.from(
                    { length: Math.ceil(matches.length / pageSize) },
                    (_, i) =>
                        `<button type="button" class="icon-button" data-page="${i + 1}" ${page === i + 1 ? 'aria-current="page"' : ""} aria-label="Page ${i + 1}">${i + 1}</button>`,
                ).join("");
            }
        }
        controls.addEventListener("input", () => {
            page = 1;
            update();
        });
        pager?.addEventListener("click", (event) => {
            const button = event.target.closest("[data-page]");
            if (button) {
                page = Number(button.dataset.page);
                update();
            }
        });
        update();
    });
})();
