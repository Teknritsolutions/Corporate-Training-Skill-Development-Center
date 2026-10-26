/* Homepage 2 has its own ten-section editorial system. */
const icon = (name) => `<i class="bi bi-${name}" aria-hidden="true"></i>`;
const action = (href, label, cls = "h2-action") =>
    `<a class="${cls}" href="${href}">${label}${icon("arrow-right")}</a>`;
const title = (number, kicker, heading, description = "") =>
    `<div class="h2-section-heading"><span class="h2-index">${number}</span><div><span class="h2-kicker">${kicker}</span><h2>${heading}</h2>${description ? `<p>${description}</p>` : ""}</div></div>`;
const section = (id, content, cls = "") =>
    `<section id="${id}" class="h2-section ${cls}"><div class="container">${content}</div></section>`;
const renderHomepage = () => `<div class="home-two">
<section class="premium-hero h2-hero"><img class="hero-photograph" src="../assets/images/heroes/home-2.webp" alt="Senior leaders sharing ideas at a strategy roundtable" width="1536" height="1024" fetchpriority="high"><div class="container hero-stage"><div class="hero-panel"><span class="eyebrow">01 / The capability edition</span><h1>Make your next chapter<br>a stronger one.</h1><p>A considered space for leaders and teams to rethink how they work, practise what matters, and build momentum together.</p><div class="actions">${action("#capability-compass", "Find your starting point", "btn")}${action("#learning-planner", "Plan your learning rhythm", "btn btn-outline")}</div></div><div class="h2-hero-stamp">${icon("compass")}<span>Clear direction.<br>Confident action.</span></div></div></section>
${section(
    "capability-compass",
    title(
        "02",
        "The capability compass",
        "A clearer view of what your team needs.",
        "Look beyond the course list. Start with the everyday moments that deserve more confidence.",
    ) +
        `<div class="h2-grid h2-grid-four">${[
            [
                "compass",
                "Direction",
                "Can everyone explain what matters most?",
                "Shared priorities",
                "Name one decision your team needs to make more confidently.",
            ],
            [
                "chat-square-dots",
                "Dialogue",
                "Do important conversations move work forward?",
                "Better conversations",
                "Identify one conversation your team tends to postpone.",
            ],
            [
                "intersect",
                "Connection",
                "Does work travel smoothly between people?",
                "Stronger handovers",
                "Find one point where context regularly gets lost.",
            ],
            [
                "arrow-repeat",
                "Adaptability",
                "Can your team test, reflect, and adjust?",
                "Small experiments",
                "Choose one habit worth challenging this month.",
            ],
        ]
            .map(
                ([i, h, p, tag, n]) =>
                    `<article class="h2-tile h2-compass-tile"><span class="h2-icon">${icon(i)}</span><h3>${h}</h3><p>${p}</p><div class="h2-tile-note"><span class="h2-label">${tag}</span><p>${n}</p></div></article>`,
            )
            .join("")}</div>`,
)}
${section("decision-lab", title("03", "Inside the decision lab", "Practise the moment before it matters.") + `<div class="h2-duo"><figure class="h2-photo-panel"><img src="../assets/images/executive-program.webp" alt="A coach guiding a small group through a leadership simulation" width="1200" height="800" loading="lazy"><figcaption>${icon("bounding-box")}A safe place to test a different response.</figcaption></figure><div class="h2-scenario-panel"><span class="h2-label">A workplace scenario</span><h3>Two priorities. One stretched team.</h3><p>A deadline moves forward while another project needs the same people. What does a thoughtful leader do next?</p><div class="h2-scenario-row"><span>01</span><div><h4>Surface the trade-off</h4><p>Make the impact visible before promising a solution.</p></div></div><div class="h2-scenario-row"><span>02</span><div><h4>Invite another perspective</h4><p>Ask what the team sees that the plan might miss.</p></div></div><div class="h2-scenario-row"><span>03</span><div><h4>Agree the next move</h4><p>Choose a clear owner, boundary, and review point.</p></div></div>${action("customized-training.html", "Build a scenario for your team")}</div></div>`, "h2-soft")}
${section(
    "role-playbooks",
    title(
        "04",
        "Role transition playbooks",
        "Different responsibilities. A more deliberate start.",
    ) +
        `<div class="h2-grid h2-grid-three">${[
            [
                "person-badge",
                "From contributor to manager",
                "Lead the work without doing all the work.",
                [
                    "Delegate with a clear definition of done",
                    "Make one-to-ones useful and consistent",
                    "Give feedback while the moment is fresh",
                ],
                "leadership",
            ],
            [
                "diagram-3",
                "From specialist to project lead",
                "Create progress across different perspectives.",
                [
                    "Build a shared picture of the outcome",
                    "Resolve dependencies before they stall",
                    "Make decisions easy to find and follow",
                ],
                "communication",
            ],
            [
                "signpost-split",
                "From team lead to change sponsor",
                "Help people make sense of what comes next.",
                [
                    "Explain the reason behind the change",
                    "Listen for friction without defensiveness",
                    "Recognise progress before perfection",
                ],
                "leadership",
            ],
        ]
            .map(
                ([i, h, p, list, program]) =>
                    `<article class="h2-tile h2-playbook"><span class="h2-icon">${icon(i)}</span><h3>${h}</h3><p>${p}</p><ul>${list.map((x) => `<li>${icon("check2")}<span>${x}</span></li>`).join("")}</ul>${action("program-details.html?program=" + program, "Explore the relevant skills")}</article>`,
            )
            .join("")}</div>`,
)}
${section("learning-planner", title("05", "The learning rhythm planner", "Make development fit the working week.", "Explore a simple time commitment before designing your team journey.") + `<div class="h2-duo h2-planner"><div class="h2-planner-controls"><span class="h2-icon">${icon("hourglass-split")}</span><h3>Start with the space you have.</h3><label for="h2-team-size">People in your team <output id="h2-team-output" for="h2-team-size">12</output></label><input id="h2-team-size" type="range" min="4" max="40" value="12" step="1"><label for="h2-weekly-minutes">Minutes per person, each week <output id="h2-minutes-output" for="h2-weekly-minutes">45</output></label><input id="h2-weekly-minutes" type="range" min="15" max="90" value="45" step="15"><p class="h2-planner-note">An indicative time calculation, not a course quote or a promise of learning outcomes.</p></div><div class="h2-planner-result" aria-live="polite" aria-atomic="true"><span class="h2-label">Your four-week learning rhythm</span><div class="h2-result-number"><strong data-learning-hours>36</strong><span>team learning hours</span></div><div class="h2-time-grid"><div><strong data-practice-minutes>30</strong><span>minutes to practise</span></div><div><strong data-reflection-minutes>15</strong><span>minutes to reflect</span></div></div><p>Protect a small, repeatable slot. Keep practice connected to a real piece of work.</p>${action("customized-training.html", "Shape this into a team journey")}</div></div>`, "h2-soft")}
${section(
    "experiment-studio",
    title("06", "The experiment studio", "Turn a good intention into something observable.") +
        `<div class="h2-duo h2-experiment"><div class="h2-experiment-panel"><div class="h2-experiment-heading"><span class="h2-icon">${icon("lightbulb")}</span><div><span class="h2-label">A one-week experiment</span><h3>Make your next meeting more useful.</h3></div></div>${[
            ["Change one thing", "Send a one-sentence decision question with the invitation."],
            [
                "Watch what happens",
                "Notice whether people arrive with a clearer view of the purpose.",
            ],
            ["Keep the evidence", "Capture the decision, its owner, and what will happen next."],
        ]
            .map(
                ([h, p], i) =>
                    `<div class="h2-experiment-step"><span>0${i + 1}</span><div><h4>${h}</h4><p>${p}</p></div></div>`,
            )
            .join(
                "",
            )}<div class="h2-insight">${icon("journal-check")}Small enough to try. Clear enough to learn from.</div></div><figure class="h2-photo-panel"><img src="../assets/images/learning-experience.webp" alt="Professionals working with notebooks and practical learning worksheets" width="1200" height="800" loading="lazy"><figcaption>${icon("pencil-square")}Real work becomes the learning material.</figcaption></figure></div>`,
)}
${section(
    "coaching-council",
    title(
        "07",
        "Your coaching council",
        "Three perspectives. More room to think.",
        "Illustrative facilitator profiles, each bringing a different lens to team development.",
    ) +
        `<div class="h2-grid h2-grid-three">${[
            [
                "Maya Patel",
                "Leadership & culture",
                "trainer-maya",
                "person-video3",
                "How can I create the conditions for others to do their best work?",
                "Bring a people challenge. Leave with a clearer conversation.",
            ],
            [
                "James Carter",
                "Communication & influence",
                "trainer-james",
                "chat-quote",
                "What does the other person need to understand before we can move forward?",
                "Bring a difficult message. Explore a more useful way to say it.",
            ],
            [
                "Elena Torres",
                "Digital working habits",
                "trainer-elena",
                "window-stack",
                "Where could a simpler tool or workflow remove unnecessary effort?",
                "Bring a recurring frustration. Find a small improvement worth testing.",
            ],
        ]
            .map(
                ([name, role, img, i, q, p]) =>
                    `<article class="h2-coach"><div class="h2-coach-portrait"><img src="../assets/images/${img}.webp" alt="Fictional facilitator ${name}" width="1200" height="800" loading="lazy"><span class="h2-coach-icon">${icon(i)}</span></div><div class="h2-coach-copy"><span class="h2-label">${role}</span><h3>${name}</h3><blockquote>&ldquo;${q}&rdquo;</blockquote><p>${p}</p></div></article>`,
            )
            .join("")}</div>`,
    "h2-soft",
)}
${section(
    "working-agreements",
    title("08", "The team agreement board", "Make the unwritten rules work for everyone.") +
        `<div class="h2-agreement-board"><div class="h2-board-header"><span>${icon("pin-angle")} A conversation starter for your next team session</span><span class="h2-board-tag">Four agreements to explore</span></div><div class="h2-grid h2-grid-four">${[
            [
                "flag",
                "Decisions",
                "Who decides, who contributes, and where do we record the outcome?",
                "Name the decision owner.",
            ],
            [
                "chat-left-heart",
                "Feedback",
                "How do we raise a concern early, clearly, and with respect?",
                "Agree a useful feedback rhythm.",
            ],
            [
                "box-arrow-in-right",
                "Handovers",
                "What context does the next person need to keep work moving?",
                "Define a complete handover.",
            ],
            [
                "bell-slash",
                "Focus",
                "When can we protect attention, and what counts as truly urgent?",
                "Protect a shared focus window.",
            ],
        ]
            .map(
                ([i, h, p, n]) =>
                    `<article class="h2-agreement"><span class="h2-icon">${icon(i)}</span><h3>${h}</h3><p>${p}</p><div class="h2-agreement-footer">${icon("check2-circle")}<span>${n}</span></div></article>`,
            )
            .join("")}</div></div>`,
)}
${section(
    "takeaway-toolkit",
    title(
        "09",
        "The take-away toolkit",
        "Useful pages for the work between workshops.",
        "Three simple, editable text templates. Download one and make it your own.",
    ) +
        `<div class="h2-grid h2-grid-three">${[
            [
                "file-earmark-text",
                "Decision brief",
                "Turn a complex discussion into one clear decision.",
                "decision-brief",
                "Purpose / options / owner",
            ],
            [
                "chat-square-text",
                "Feedback preparation",
                "Prepare a specific, respectful conversation.",
                "feedback-preparation",
                "Situation / impact / next step",
            ],
            [
                "arrow-counterclockwise",
                "Team reflection",
                "Keep what worked. Change what needs attention.",
                "team-reflection",
                "Notice / learn / experiment",
            ],
        ]
            .map(
                ([i, h, p, file, meta]) =>
                    `<article class="h2-tile h2-tool"><div class="h2-tool-top"><span class="h2-icon">${icon(i)}</span><span class="h2-filetype">TXT<br>Template</span></div><h3>${h}</h3><p>${p}</p><div class="h2-tool-meta">${meta}</div><a class="h2-action" href="../assets/resources/${file}.txt" download>Download template${icon("download")}</a></article>`,
            )
            .join("")}</div>`,
    "h2-soft",
)}
${section(
    "journey-brief",
    title("10", "Your next conversation", "Bring one challenge. Build a useful starting brief.") +
        `<div class="h2-brief"><div class="h2-brief-main"><span class="h2-icon">${icon("briefcase")}</span><h3>A focused conversation starts with a little context.</h3><p>You do not need a complete training plan. Bring a situation your team wants to handle better, and a picture of what better would look like.</p>${action("contact.html", "Discuss your team challenge", "btn")}</div><div class="h2-brief-checklist"><h3>Three things to bring</h3>${[
            ["The moment", "Where does the challenge show up in everyday work?"],
            ["The people", "Who needs to act, collaborate, or lead differently?"],
            ["The difference", "What would you notice if things were working better?"],
        ]
            .map(
                ([h, p], i) =>
                    `<div class="h2-brief-row"><span>0${i + 1}</span><div><h4>${h}</h4><p>${p}</p></div></div>`,
            )
            .join("")}</div></div>`,
)}
</div>`;

// Keep the photographs at their natural ratio; present the detailed steps in a shared row below.
module.exports = () => {
    let html = renderHomepage();
    for (const [id, stepClass] of [
        ["decision-lab", "h2-scenario-row"],
        ["experiment-studio", "h2-experiment-step"],
    ]) {
        const section = new RegExp('<section id="' + id + '"[\\s\\S]*?<\\/section>');
        html = html.replace(section, (content) => {
            const step = new RegExp(
                '<div class="' + stepClass + '">[\\s\\S]*?<\\/p><\\/div><\\/div>',
                "g",
            );
            const rows = content.match(step) || [];
            if (!rows.length) return content;
            if (id === "experiment-studio")
                content = content.replace(
                    '<div class="h2-insight">',
                    '<p class="h2-experiment-prompt">Choose one real meeting this week. Try a clearer invitation, notice what changes, and bring one useful observation back to the team.</p><div class="h2-insight">',
                );
            return content
                .replace(step, "")
                .replace(
                    /<\/div><\/section>$/,
                    '<div class="h2-step-grid">' + rows.join("") + "</div></div></section>",
                );
        });
    }
    return html;
};
