/* Generates independent, readable HTML pages from shared build-time components. */
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const write = (file, text) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), text);
};
const icon = (name) => `<i class="bi bi-${name}" aria-hidden="true"></i>`;
const link = (url, text, cls = "btn") =>
    `<a class="${cls}" href="${url}">${text} ${icon("arrow-right")}</a>`;
const image = (name, alt, cls = "", eager = false) =>
    `<img src="../assets/images/${name}.webp" alt="${alt}" width="1200" height="800" class="${cls}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
const section = (body, cls = "", id = "") =>
    `<section class="section ${cls}"${id ? ` id="${id}"` : ""}><div class="container">${body}</div></section>`;
const heading = (tag, title, desc = "") =>
    `<div class="section-head"><span class="eyebrow">${tag}</span><h2>${title}</h2>${desc ? `<p>${desc}</p>` : ""}</div>`;
const banner = (title, desc, tag = "Built for better work") =>
    section(
        `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>${title}</span></nav><span class="eyebrow">${tag}</span><h1>${title}</h1><p>${desc}</p>`,
        "page-banner",
    );
const check = (items) =>
    `<ul class="checklist">${items.map((item) => `<li>${icon("check-circle-fill")}<span>${item}</span></li>`).join("")}</ul>`;
const box = (title, text, symbol = "diagram-3") =>
    `<article class="card padded"><div class="icon">${icon(symbol)}</div><h3>${title}</h3><p>${text}</p></article>`;
const process = (
    items = [
        ["Assess", "Understand your business goals, workforce needs, and current capabilities."],
        ["Design", "Build a focused learning journey around real workplace challenges."],
        ["Deliver", "Bring learning to life through guided practice and expert feedback."],
        ["Measure", "Track participation, application, and progress against agreed outcomes."],
    ],
) =>
    `<div class="process">${items.map(([t, d]) => `<article><h3>${t}</h3><p>${d}</p></article>`).join("")}</div>`;
const cta = (
    title = "Your people. Their potential. A stronger business.",
    text = "Let’s build a learning journey around the skills your organization needs next.",
) =>
    section(
        `<div class="cta"><div><span class="eyebrow">Let’s move forward</span><h2>${title}</h2><p>${text}</p></div><div class="actions">${link("customized-training.html", "Request a proposal")} ${link("contact.html", "Talk to an advisor", "btn btn-outline")}</div></div>`,
    );
const faq = (
    items = [
        [
            "Can we customize the content?",
            "Yes. We start with your business context, then adapt exercises, examples, and learning outcomes to your teams.",
        ],
        [
            "Which delivery formats are available?",
            "Choose classroom workshops, live virtual sessions, or a blended journey with practical assignments.",
        ],
        [
            "How is learning measured?",
            "A baseline assessment, observed practice, module completion, and a follow-up review provide a clear view of progress.",
        ],
    ],
) =>
    `<div class="faq">${items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>`;
const programs = [
    {
        id: "communication",
        title: "Communication Skills",
        category: "Communication",
        description: "Turn everyday conversations into clear, confident collaboration.",
        icon: "chat-square-text",
        duration: "2 days",
        image: "communication-workshop",
        modules: [
            "Listening with intention",
            "Clear business writing",
            "Presenting with confidence",
            "Feedback and difficult conversations",
        ],
    },
    {
        id: "leadership",
        title: "Leadership Development",
        category: "Leadership",
        description: "Give new and experienced managers the tools to lead with purpose.",
        icon: "people",
        duration: "3 days",
        image: "leadership-workshop",
        modules: [
            "Leading yourself",
            "Coaching your team",
            "Delegation and accountability",
            "Leading through change",
        ],
    },
    {
        id: "sales",
        title: "Sales Excellence",
        category: "Sales",
        description: "Build trusted customer relationships and a more effective sales process.",
        icon: "graph-up-arrow",
        duration: "2 days",
        image: "sales-coaching",
        modules: [
            "Customer discovery",
            "Value conversations",
            "Handling objections",
            "Negotiation practice",
        ],
    },
    {
        id: "technical",
        title: "Technical Upskilling",
        category: "Technical",
        description: "Develop practical digital capabilities for a changing workplace.",
        icon: "laptop",
        duration: "4 days",
        image: "technical-lab",
        modules: [
            "Digital foundations",
            "Data and workflows",
            "Applied team project",
            "Skills demonstration",
        ],
    },
];
write(
    "assets/js/program-data.js",
    `window.ElevoraPrograms = ${JSON.stringify(programs, null, 4)};`,
);
const programCard = (p, withPhoto = false) =>
    `<article class="card flex program-card" data-category="${p.category}" data-search="${p.title.toLowerCase()} ${p.description.toLowerCase()}">${withPhoto ? image(p.image, `${p.title} workshop with business professionals`) : ""}<div class="card-body">${!withPhoto ? `<div class="icon">${icon(p.icon)}</div>` : ""}<span class="category">${p.category} · ${p.duration}</span><h3>${p.title}</h3><p>${p.description}</p>${link(`program-details.html?program=${p.id}`, "Explore program", "text-link")}</div></article>`;
const posts = [
    [
        "manager",
        "Leadership",
        "The first 90 days: helping new managers thrive",
        "A practical framework for turning strong individual contributors into confident team leaders.",
        "insight-leadership",
    ],
    [
        "feedback",
        "Communication",
        "Make feedback a habit, not an annual event",
        "Small conversations can build a more open, effective workplace.",
        "insight-communication",
    ],
    [
        "digital",
        "Technical",
        "Close the digital skills gap with everyday practice",
        "Connect new tools with the real work your teams do every day.",
        "insight-digital",
    ],
    [
        "sales",
        "Sales",
        "Better discovery starts with better questions",
        "Help your sales team move from pitching products to understanding customer priorities.",
    ],
    [
        "impact",
        "Leadership",
        "Measure what changes after the workshop",
        "Use a simple follow-up rhythm to connect learning with workplace behavior.",
    ],
    [
        "hybrid",
        "Communication",
        "Design more inclusive hybrid workshops",
        "Create a shared learning experience for people in the room and online.",
    ],
];
write("assets/js/blog-data.js", `window.ElevoraPosts = ${JSON.stringify(posts, null, 4)};`);
const postCard = (p, photo = false) =>
    `<article class="card flex blog-card" data-category="${p[1]}" data-search="${p[2].toLowerCase()}">${photo && p[4] ? image(p[4], p[3]) : ""}<div class="card-body"><div class="blog-meta"><span>${p[1]}</span><time datetime="2026-10-12">October 12, 2026</time></div><h3>${p[2]}</h3><p>${p[3]}</p></div></article>`;
const clients = `<div class="client-logos" aria-label="Fictional sample clients"><span>northstar<span aria-hidden="true">®</span></span><span>${icon("hexagon")} AcmeWorks</span><span>VERTEX</span><span>lumin.</span><span>${icon("bounding-box")} Cloudshift</span></div>`;
const delivery = (photo) =>
    `<div class="grid cols-3">${[
        [
            "Classroom training",
            "Bring your team together for hands-on workshops and face-to-face coaching.",
            "classroom-learning",
            "building",
        ],
        [
            "Live virtual learning",
            "Expert-led sessions that connect teams wherever they work.",
            "virtual-learning",
            "camera-video",
        ],
        [
            "Hybrid learning",
            "A flexible blend of live learning, guided practice, and team projects.",
            "hybrid-learning",
            "intersect",
        ],
    ]
        .map(([t, d, im, ic]) =>
            photo
                ? `<article class="card flex">${image(im, t + " for working professionals")}<div class="card-body"><h3>${t}</h3><p>${d}</p>${link("customized-training.html", "Find your format", "text-link")}</div></article>`
                : box(t, d, ic),
        )
        .join("")}</div>`;
const industries = () =>
    `<div class="grid cols-3">${[
        ["Technology", "Digital capability, agile collaboration, and technical leadership.", "cpu"],
        [
            "Financial services",
            "Client communication, decision-making, and people leadership.",
            "bank",
        ],
        [
            "Healthcare",
            "Team communication, service excellence, and management skills.",
            "heart-pulse",
        ],
        [
            "Manufacturing",
            "Frontline leadership, problem-solving, and operational teamwork.",
            "gear",
        ],
        ["Retail & consumer", "Customer experience, coaching, and sales effectiveness.", "shop"],
        [
            "Professional services",
            "Consultative conversations, presentations, and project leadership.",
            "briefcase",
        ],
    ]
        .map((a) => box(...a))
        .join("")}</div>`;
const newsletter = () =>
    `<form data-demo-form="newsletter" class="card padded"><h3>A fresh perspective, in your inbox.</h3><p>Subscribe to the demo learning newsletter. No email is actually sent.</p><label>Email address<input type="email" name="email" required placeholder="you@company.com" autocomplete="email"></label><div class="actions"><button class="btn" type="submit">Subscribe ${icon("arrow-right")}</button></div><div class="form-status" role="status"></div></form>`;
const input = (name, label, type = "text", extra = "") =>
    `<label>${label}<input name="${name}" type="${type}" required ${extra}></label>`;
const select = (name, label, options) =>
    `<label>${label}<select name="${name}" required><option value="">Select an option</option>${options.map((o) => `<option>${o}</option>`).join("")}</select></label>`;
const inquiry = (custom = false) =>
    `<form data-demo-form="${custom ? "proposal" : "contact"}" class="form-grid">${input("name", "Contact person", "text", 'autocomplete="name" maxlength="100"')}${input("company", "Company name", "text", 'autocomplete="organization" maxlength="120"')}${input("email", "Business email", "email", 'autocomplete="email"')}${input("phone", "Phone number", "tel", 'autocomplete="tel" pattern="[+0-9 \\(\\)\\-]{7,25}"')}${
        custom
            ? input("department", "Department") +
              select(
                  "topic",
                  "Training topic",
                  programs.map((p) => p.title),
              ) +
              input("employees", "Number of employees", "number", 'min="1" max="10000"') +
              select("mode", "Preferred mode", ["Classroom", "Virtual", "Hybrid"]) +
              input("date", "Preferred date", "date")
            : select("topic", "I’m interested in", [
                  "Corporate training",
                  "Program information",
                  "Partnership",
                  "General inquiry",
              ])
    }<label class="full">${custom ? "Additional requirements" : "Your message"}<textarea name="message" required minlength="10" maxlength="3000" placeholder="Tell us a little about your team and goals."></textarea></label><label class="checkbox-label full"><input type="checkbox" name="consent" required> I agree to be contacted about this inquiry.</label><div class="full"><button type="submit" class="btn">${custom ? "Request a proposal" : "Send inquiry"} ${icon("arrow-right")}</button><p class="muted"><small>Front-end demo: your inquiry stays in this browser. No message is sent.</small></p><div class="form-status" role="status"></div></div></form>`;
const controls = `<button class="icon-button" type="button" data-theme-toggle aria-label="Toggle dark mode" aria-pressed="false">${icon("moon")}</button><button class="icon-button" type="button" data-rtl-toggle aria-label="Toggle RTL layout" aria-pressed="false">${icon("text-right")}<span class="direction-label">RTL</span></button>`;
const brand = (prefix = "../") =>
    `<a class="brand" href="${prefix}pages/index.html" aria-label="Elevora home"><img src="${prefix}assets/images/branding/mark.svg" alt="" width="36" height="36"><span>elevora<small>Corporate learning</small></span></a>`;
const nav = (active) =>
    `<a href="#main" class="skip-link">Skip to content</a><header class="site-header"><div class="container header-inner">${brand()}<nav class="primary-nav" id="primary-nav" aria-label="Main navigation"><div class="nav-dropdown"><button type="button" aria-expanded="false" aria-controls="home-menu">Home ${icon("chevron-down")}</button><div class="dropdown-panel" id="home-menu" hidden><a href="index.html" ${active === "index" ? 'aria-current="page"' : ""}>Home Page 1</a><a href="home-2.html">Home Page 2</a></div></div><a href="about.html">About Us</a><div class="nav-dropdown"><button type="button" aria-expanded="false" aria-controls="program-menu">Programs ${icon("chevron-down")}</button><div class="dropdown-panel" id="program-menu" hidden><a href="programs.html">All Programs</a>${programs.map((p) => `<a href="program-details.html?program=${p.id}">${p.title}</a>`).join("")}</div></div><a href="methodology.html">Methodology</a><a href="clients.html">Clients</a><a href="customized-training.html">Customized Training</a><a href="blog.html">Blog</a><a href="contact.html">Contact</a><a href="dashboard/index.html">Dashboard</a></nav><div class="header-tools">${controls}<button class="icon-button menu-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="Toggle navigation">${icon("list")}</button><a class="btn btn-sm header-login" href="login.html">Login ${icon("arrow-right")}</a></div></div></header>`;
const footer = require("./footer.cjs");
const pages = {};
pages.index = [
    "Corporate training for a future-ready workforce",
    [
        section(
            `<div class="split"><div><span class="eyebrow">Invest in people. Build what’s next.</span><h1>Empower your workforce with <em>future-ready skills.</em></h1><p>Practical learning. Confident teams. Lasting impact. Build the capabilities your people need to thrive in a changing world.</p><div class="actions">${link("programs.html", "Explore programs")}${link("customized-training.html", "Request corporate training", "btn btn-outline")}</div><div class="hero-note">${icon("check-circle-fill")} Expert-led learning <span>·</span> Built around your business</div></div><div class="hero-visual">${image("home1-corporate-training-hero", "Trainer guiding a collaborative corporate workshop", "", true)}<div class="achievement"><div class="icon">${icon("mortarboard")}</div><div><strong>Learning that lasts.</strong><small>Real practice. Real workplace application.</small></div></div></div></div>`,
            "hero",
        ),
        `<section class="trust"><div class="container"><p>Built for ambitious teams.<br><strong>Fictional sample clients</strong></p>${clients}</div></section>`,
        section(
            `<div class="head-row">${heading("Our programs", "The right skills.<br>A world of possibilities.", "Focused programs that help your people do their best work.")} ${link("programs.html", "View all programs", "text-link")}</div><div class="grid cols-4">${programs.map((p) => programCard(p, true)).join("")}</div>`,
        ),
        section(
            `<div class="split">${image("about-center", "Teams learning together at a modern training center", "editorial-image")}<div>${heading("More than a training center", "We help people grow.<br>And businesses move forward.", "Learning works best when it connects to real life. Our approach brings expert guidance, practical experience, and your business context together.")}${check(["Experienced facilitators who understand the workplace", "Learning journeys shaped around your goals", "Practical tools your teams can use from day one"])}${link("about.html", "Get to know Elevora")}</div></div>`,
            "soft",
        ),
        section(
            heading(
                "The Elevora difference",
                "A thoughtful approach.<br>A meaningful difference.",
            ) +
                `<div class="grid cols-3 benefits-grid">${[
                    [
                        "Experienced trainers",
                        "Learn with practitioners who bring real industry perspective.",
                        "person-check",
                    ],
                    [
                        "Relevant curriculum",
                        "Build capabilities that connect directly to your day-to-day work.",
                        "journal-check",
                    ],
                    [
                        "Flexible formats",
                        "Make learning fit your team, schedule, and location.",
                        "calendar2-check",
                    ],
                    [
                        "Measurable outcomes",
                        "Understand progress with clear assessments and follow-up.",
                        "bar-chart",
                    ],
                    [
                        "Customized learning",
                        "Put your business challenges at the heart of every session.",
                        "sliders",
                    ],
                    [
                        "Ongoing support",
                        "Keep momentum with resources, practice, and next steps.",
                        "headset",
                    ],
                ]
                    .map(
                        ([t, d, i]) =>
                            `<article class="benefit"><div class="icon">${icon(i)}</div><h3>${t}</h3><p>${d}</p></article>`,
                    )
                    .join("")}</div>`,
        ),
        section(
            heading(
                "How learning becomes progress",
                "Designed with purpose. Delivered with care.",
            ) + process(),
            "soft",
        ),
        section(
            heading(
                "Learn your way",
                "One standard of quality.<br>More ways to learn.",
                "Wherever your team works, make development part of the everyday.",
            ) + delivery(true),
        ),
        section(
            `<div class="split"><div><span class="eyebrow">A story of progress · fictional case study</span><h2>From individual effort<br>to collective strength.</h2><p>See how a sample operations team could use a focused leadership journey to build confidence, improve collaboration, and create better habits.</p><div class="metrics"><div><strong>92%</strong><small>Sample completion</small></div><div><strong>+28%</strong><small>Sample skills gain</small></div><div><strong>4.8/5</strong><small>Sample feedback</small></div></div><blockquote>“The most valuable part? Bringing what we learned straight back into our daily work.”</blockquote><p><small>Jordan Lee · fictional HR director, Northstar</small></p>${link("clients.html", "Explore client stories", "text-link")}</div>${image("case-study-team", "Operations colleagues reviewing a collaborative project")}</div>`,
            "case",
        ),
        section(
            `<div class="head-row">${heading("The learning journal", "Ideas for a stronger workforce.", "Fresh perspectives on people, performance, and continuous growth.")} ${link("blog.html", "Visit the journal", "text-link")}</div><div class="grid cols-3">${posts
                .slice(0, 3)
                .map((p) => postCard(p, true))
                .join("")}</div>`,
        ),
        cta(),
    ].join(""),
];
pages["home-2"] = ["The capability edition: a stronger way to work", require("./home-two.cjs")()];
pages.about = [
    "About Elevora",
    [
        banner(
            "People first. Progress always.",
            "We believe a stronger business begins with people who have the confidence and skills to grow.",
            "About Elevora",
        ),
        section(
            `<div class="split">${image("company-story", "Learning designers collaborating on a new curriculum", "editorial-image")}<div>${heading("Our story", "Built around a simple belief: people can do remarkable things.", "Elevora is a fictional corporate learning center created to demonstrate a thoughtful, practical training experience.")}<p>Our sample approach starts with listening. We connect business priorities with the skills people use every day, then create a clear path from understanding to application.</p>${check(["Business context before course content", "Practice before perfection", "Progress that continues after the workshop"])}</div></div>`,
        ),
        section(
            heading("What guides us", "Purpose in every learning experience.") +
                `<div class="grid cols-3">${box("Our mission", "Make meaningful professional development accessible, practical, and connected to work.", "compass")}${box("Our vision", "A workplace where everyone has the opportunity and confidence to keep growing.", "binoculars")}${box("Our values", "Listen openly. Design thoughtfully. Include everyone. Measure honestly.", "heart")}</div>`,
            "soft",
        ),
        section(
            heading("An illustrative journey", "Small steps. A growing ambition.") +
                `<div class="timeline">${[
                    [
                        "2020",
                        "A practical beginning",
                        "A sample story: a small group of facilitators starts with communication workshops.",
                    ],
                    [
                        "2022",
                        "Learning without boundaries",
                        "Virtual delivery makes the learning experience available to distributed teams.",
                    ],
                    [
                        "2024",
                        "A broader perspective",
                        "Leadership, sales, and digital skills become connected learning journeys.",
                    ],
                    [
                        "2026",
                        "Built for what comes next",
                        "A sample HR dashboard brings learning planning and progress into one place.",
                    ],
                ]
                    .map(
                        ([y, t, d]) =>
                            `<article><strong>${y}</strong><div><h3>${t}</h3><p>${d}</p></div></article>`,
                    )
                    .join("")}</div>`,
        ),
        section(
            heading(
                "The people behind the approach",
                "Different perspectives. One shared purpose.",
                "Fictional leadership biographies.",
            ) +
                `<div class="grid cols-3">${box("Priya Rao · Learning Director", "Sample biography: designs inclusive learning journeys and supports facilitator development.", "person-badge")}${box("Daniel Brooks · Program Director", "Sample biography: connects business needs with practical curriculum and skills practice.", "person-workspace")}${box("Sofia Chen · Client Partner", "Sample biography: helps training managers turn learning priorities into a clear delivery plan.", "people")}</div>`,
            "soft",
        ),
        cta(
            "Create a culture of continuous growth.",
            "“Learning feels different when it belongs to everyone.” — fictional Elevora participant.",
        ),
    ].join(""),
];
pages.programs = [
    "Training programs",
    [
        banner(
            "Skills for the work ahead.",
            "Explore practical learning journeys in communication, leadership, sales, and digital capability.",
            "Our training programs",
        ),
        section(
            `<div class="filters" data-filter-controls="program-list"><label>Search programs<input type="search" data-search-input placeholder="Search a skill or program"></label><label>Category<select data-category-input><option value="all">All categories</option>${programs.map((p) => `<option>${p.category}</option>`).join("")}</select></label></div>`,
        ),
        section(
            `<div class="consultation"><div><span class="eyebrow">Featured program</span><h2>Lead with clarity.<br>Grow with confidence.</h2><p>Help new managers build strong foundations through our practical leadership development journey.</p></div>${link("program-details.html?program=leadership", "Explore the program")}</div>`,
            "soft",
        ),
        section(
            heading("Find your next step", "Focused learning. Practical outcomes.") +
                `<div id="program-list" class="grid cols-4" data-filter-list>${programs.map((p) => programCard(p)).join("")}</div><p data-empty-for="program-list" hidden>No programs match your search. Try another skill or category.</p>`,
        ),
        section(
            heading("Built to fit your team", "Choose how your people learn.") + delivery(false),
            "soft",
        ),
        cta(
            "Need something more specific?",
            "Bring us your business challenge. We’ll shape a learning journey around it.",
        ),
    ].join(""),
];
pages["program-details"] = [
    "Program details",
    [
        banner(
            "<span data-program-title>Communication Skills</span>",
            "<span data-program-description>Turn everyday conversations into clear, confident collaboration.</span>",
            "Focused professional development",
        ),
        section(
            `<div class="split"><div>${heading("Learning outcomes", "Build capability you can put to work.")}<p>Go beyond knowing the theory. Develop confidence through realistic practice, structured feedback, and a clear action plan.</p></div>${check(["Understand the core concepts and when to apply them", "Practice in scenarios drawn from your workplace", "Receive specific, constructive facilitator feedback", "Leave with a personal plan for continued development"])}</div>`,
        ),
        section(
            heading("Inside the program", "A clear path from insight to action.") +
                `<div data-program-modules class="faq"></div>`,
            "soft",
        ),
        section(
            heading("Program at a glance", "Designed for working professionals.") +
                `<div class="grid cols-3">${box("Flexible delivery", "Classroom, virtual, or hybrid. Choose the format that fits your team.", "camera-video")}${box("Focused duration", "<span data-program-duration>2 days</span>, with optional follow-up coaching and practice.", "clock")}${box("The right audience", "Employees, team leads, and managers looking to strengthen workplace capability.", "people")}</div>`,
        ),
        section(
            `<div class="split"><div>${heading("Your facilitator", "Expert guidance. Room to practice.")}<p>Your sample trainer is matched to your business context and learning goals. Fictional facilitator biographies are shown on Home Page 2.</p>${link("home-2.html", "Meet the sample trainers", "text-link")}</div><div>${faq()}</div></div>`,
            "soft",
        ),
        cta(
            "Make this program work for your team.",
            "Share your audience, learning priorities, and preferred dates to begin a tailored training inquiry.",
        ),
    ].join(""),
];
pages.methodology = [
    "Our methodology",
    [
        banner(
            "Learning with intention.",
            "A thoughtful process that connects your business goals to practical skills and measurable progress.",
            "The Elevora methodology",
        ),
        section(
            `<div class="split"><div>${heading("Our learning philosophy", "People learn by doing.<br>And grow by reflecting.")}<p>We create a supportive space for experimentation. Relevant scenarios, time to practice, and useful feedback help people translate new ideas into everyday habits.</p>${check(["Start with real workplace situations", "Make participation inclusive and purposeful", "Build reflection into every stage"])}</div>${image("methodology-workshop", "Facilitator supporting a practical group problem solving exercise", "editorial-image")}</div>`,
        ),
        section(
            heading(
                "From business need to business impact",
                "Four connected stages. One clear direction.",
            ) + process(),
            "soft",
        ),
        section(heading("Delivery that works", "Meet your team where they are.") + delivery(false)),
        section(
            heading("Measure meaningful progress", "Look beyond the attendance sheet.") +
                `<div class="grid cols-3">${box("Before learning", "Agree objectives and establish a baseline with a short needs assessment.", "clipboard-data")}${box("During learning", "Observe practice, gather feedback, and check understanding through applied tasks.", "activity")}${box("After learning", "Review action plans, module progress, and workplace application with managers.", "graph-up")}</div>`,
            "soft",
        ),
        cta("Turn a training plan into lasting progress."),
    ].join(""),
];
pages.clients = [
    "Clients & success stories",
    [
        banner(
            "Progress looks different for every team.",
            "Explore fictional examples of how focused learning can support real workplace priorities.",
            "Clients & partnerships",
        ),
        section(heading("Across the workplace", "Learning shaped by your world.") + industries()),
        section(
            heading(
                "A sample client community",
                "Different organizations. Shared commitment.",
                "These invented brand names are demonstration content, not endorsements.",
            ) + clients,
            "soft",
        ),
        section(
            heading("Illustrative case studies", "From business challenge to learning journey.") +
                `<div class="grid cols-2">${box("Northstar · Stronger frontline leaders", "Challenge: inconsistent coaching. Approach: manager workshops and practice. Sample result: 92% completion and a 28% skills assessment improvement. These are illustrative figures.", "people")}${box("AcmeWorks · Clearer customer conversations", "Challenge: product-heavy sales pitches. Approach: discovery simulations and peer feedback. Sample result: 90% participation and a 4.7/5 learning rating. These are illustrative figures.", "chat-dots")}</div>`,
        ),
        section(
            `<div class="split">${heading("A shared learning ambition", "Confidence grows through practice.", "Fictional client testimonial.")}<div class="testimonial"><blockquote>“The program gave our managers a common language and a useful set of habits to keep practicing together.”</blockquote><strong>Taylor Reed</strong><p>Fictional people partner · AcmeWorks</p></div></div>`,
            "soft",
        ),
        cta("Let’s write your next chapter of growth."),
    ].join(""),
];
pages["customized-training"] = [
    "Customized corporate training",
    [
        banner(
            "Your goals. Your team. Your learning journey.",
            "Bring your business context into the classroom with a program built around your priorities.",
            "Customized training",
        ),
        section(
            `<div class="split">${image("custom-consultation", "HR manager discussing a tailored training plan with a consultant", "editorial-image")}<div>${heading("A better fit for better learning", "Start with what matters<br>to your business.")}<p>From a single workshop to a connected development journey, shape the content, pace, and delivery around your people.</p>${check(["Relevant examples and business scenarios", "Content matched to role and experience", "Flexible scheduling and delivery", "Agreed success measures from the start"])}</div></div>`,
        ),
        section(
            heading("How we shape your program", "A collaborative process from day one.") +
                process([
                    ["Discover", "Discuss your business priorities and audience."],
                    ["Co-design", "Agree outcomes, topics, and relevant exercises."],
                    ["Plan", "Choose facilitators, dates, and delivery format."],
                    ["Refine", "Review feedback and adjust the next learning step."],
                ]),
            "soft",
        ),
        section(
            heading("Your format. Your rhythm.", "Learning that fits the way you work.") +
                delivery(false),
        ),
        section(
            `<div class="split"><div>${heading("Tell us what you need", "Let’s build a better<br>learning plan.")}<p>Complete the demo requirements form. Your submission is saved in your browser so you can review the interaction.</p><p>For a live website, connect this form to your CRM or inquiry service.</p></div><div class="card padded">${inquiry(true)}</div></div>`,
            "soft",
        ),
        section(
            heading("A little more clarity", "Your questions, answered.") +
                faq() +
                `<div class="actions">${link("contact.html", "Speak to an advisor")}</div>`,
        ),
    ].join(""),
];
pages.blog = [
    "Learning insights & journal",
    [
        banner(
            "A fresh perspective on better work.",
            "Ideas, practical tools, and thoughtful conversations about learning and workforce development.",
            "The Elevora journal",
        ),
        section(
            `<div class="split">${image("blog-feature", "Business leaders discussing a workforce learning strategy", "editorial-image")}<div><span class="eyebrow">Featured perspective · 8 min read</span><h2>Make learning part of<br>the way work happens.</h2><p>Build a development rhythm that connects business priorities, meaningful practice, and everyday conversations.</p>${link("#blog-list", "Browse the journal")}</div></div>`,
        ),
        section(
            `<div class="filters" data-filter-controls="blog-list"><label>Search the journal<input type="search" data-search-input placeholder="Find an article"></label><label>Topic<select data-category-input><option value="all">All topics</option>${programs.map((p) => `<option>${p.category}</option>`).join("")}</select></label></div>`,
            "soft",
        ),
        section(
            `<div class="grid cols-3" id="blog-list" data-filter-list data-page-size="3">${posts.map((p) => postCard(p)).join("")}</div><p data-empty-for="blog-list" hidden>No articles match your search.</p><nav class="pagination" aria-label="Article pages" data-pagination="blog-list"></nav>`,
        ),
        section(newsletter(), "soft"),
    ].join(""),
];
pages.contact = [
    "Contact our training advisors",
    [
        banner(
            "Let’s talk about what’s next.",
            "Whether you have a clear brief or a question to explore, start a conversation about your team’s development.",
            "Contact Elevora",
        ),
        section(
            `<div class="grid cols-3">${box("Email our team", '<a href="mailto:hello@elevora.example">hello@elevora.example</a><br>Sample email address.', "envelope")}${box("Give us a call", '<a href="tel:+12025550148">+1 (202) 555-0148</a><br>Fictional demo contact number.', "telephone")}${box("Plan a conversation", "Monday–Friday, 9am–6pm.<br>Choose classroom, virtual, or hybrid.", "calendar2-week")}</div>`,
        ),
        section(
            `<div class="split"><div>${heading("Start a conversation", "Tell us about your team.")}<p>Share your learning priorities and we’ll demonstrate a clear inquiry confirmation. No message is sent from this static template.</p></div><div class="card padded">${inquiry()}</div></div>`,
            "soft",
        ),
        section(
            heading("Find your learning space", "A place to connect and grow.") +
                `<div class="map-placeholder"><div class="icon mx-auto">${icon("geo-alt")}</div><h3>Your training center location</h3><p>Map integration placeholder. Add your verified business address and preferred map provider before publication.</p></div>`,
        ),
        section(heading("Before we connect", "A few common questions.") + faq()),
    ].join(""),
];
const password = (name, title) =>
    `<label>${title}<div class="password-field"><input type="password" name="${name}" required minlength="8" autocomplete="${name === "confirm" ? "new-password" : "current-password"}" placeholder="Enter your password" /><button class="icon-button" type="button" data-password-toggle aria-label="Show ${title.toLowerCase()}">${icon("eye")}</button></div></label>`;
for (const mode of ["login", "register", "forgot-password"]) {
    const title =
        mode === "login"
            ? "Welcome back."
            : mode === "register"
              ? "Make room for growth."
              : "Reset your demo access.";
    const form =
        mode === "login"
            ? `${input("email", "Email address", "email", 'autocomplete="email"')}${password("password", "Password")}<div class="actions"><label class="checkbox-label"><input type="checkbox" name="remember"> Remember me</label><a href="forgot-password.html">Forgot password?</a></div><button class="btn full" type="submit">Open demo dashboard ${icon("arrow-right")}</button><p><small>Demo access: <strong>hr@elevora.example</strong><br>Password: <strong>Elevora2026!</strong></small></p><p>New here? <a href="register.html">Create a profile</a></p>`
            : mode === "register"
              ? `${input("name", "Full name", "text", 'autocomplete="name"')}${input("company", "Company name", "text", 'autocomplete="organization"')}${input("email", "Work email", "email", 'autocomplete="email"')}${password("password", "Password")}${password("confirm", "Confirm password")}<label class="checkbox-label"><input type="checkbox" name="terms" required> I accept the demo <a href="terms.html">terms</a>.</label><button class="btn" type="submit">Create profile ${icon("arrow-right")}</button><p>Already registered? <a href="login.html">Sign in</a></p>`
              : `${input("email", "Email address", "email", 'autocomplete="email"')}<button class="btn" type="submit">Show recovery instructions</button><p><a href="login.html">Back to login</a></p>`;
    pages[mode] = [
        title,
        section(
            `<div class="auth-layout"><div class="auth-intro"><span class="eyebrow">Your learning workspace</span><h2>Great teams never<br>stop growing.</h2><p>Plan training. Support your people. See the progress.</p><p><small>This is a front-end demonstration. Do not use real HR data or a real password. Authentication requires a secure backend for production.</small></p></div><div class="auth-form"><h1>${title}</h1><form data-auth-form="${mode}">${form}<div class="form-status" role="status"></div></form></div></div>`,
            "soft",
        ),
    ];
}
pages.terms = [
    "Terms & conditions — demo template",
    banner(
        "Terms & conditions",
        "Demonstration terms for the Elevora HTML template.",
        "Template terms",
    ) +
        section(
            `<article class="article-body"><h2>Demonstration purpose</h2><p>Elevora is a fictional corporate training provider. People, client names, prices, testimonials, outcomes, sessions, and contact details are sample content.</p><h2>No bookings or payments</h2><p>Forms simulate an inquiry or newsletter subscription. Submitting a form does not create a booking, purchase, contract, or real subscription.</p><h2>Demo credentials and certificates</h2><p>Dashboard access is for demonstration only. Certificates are generated locally and are not independently verified credentials or evidence of accredited training.</p><h2>Production responsibilities</h2><p>Integrate secure services and replace sample content before a production launch. Review your licenses and legal policies for the intended distribution and jurisdiction.</p><h2>Template assets</h2><p>Original branding and AI-generated imagery are included. Third-party libraries retain their own licenses; see documentation and bundled license notices.</p></article>`,
        ),
];
pages["404"] = [
    "Page not found",
    section(
        `<div class="utility"><div class="number">404</div><span class="eyebrow">A small detour</span><h1>This page has moved on.</h1><p>Let’s get you back to a useful starting point.</p><div class="actions justify-content-center">${link("index.html", "Back to home")}${link("programs.html", "Explore programs", "btn btn-outline")}</div></div>`,
        "soft",
    ),
];
pages["coming-soon"] = [
    "Something new is coming",
    section(
        `<div class="utility"><span class="eyebrow">A new chapter is on its way</span><h1>More ways to learn.<br>Coming soon.</h1><p>We’re preparing a new learning experience. Join the demo notification list to see the subscription flow.</p>${newsletter()}<p>${link("index.html", "Return to Elevora", "text-link")}</p></div>`,
        "soft",
    ),
];
function html(title, body, name, dashboard = false) {
    const prefix = dashboard ? "../../" : "../";
    const noindex =
        dashboard ||
        ["login", "register", "forgot-password", "privacy", "terms", "404", "coming-soon"].includes(
            name,
        );
    const desc = dashboard
        ? `Manage ${title.toLowerCase()} in the Elevora front-end training dashboard.`
        : `Explore ${title.toLowerCase()} with Elevora, a practical corporate training and skill development HTML template.`;
    return `<!DOCTYPE html><html lang="en" dir="ltr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title.replace(/<[^>]*>/g, "")} | Elevora</title><meta name="description" content="${desc}"><meta name="robots" content="${noindex ? "noindex, nofollow" : "index, follow"}"><link rel="canonical" href="https://elevora.example/pages/${dashboard ? "dashboard/" : ""}${name}.html"><meta property="og:title" content="${title.replace(/<[^>]*>/g, "")} | Elevora"><meta property="og:description" content="${desc}"><meta property="og:type" content="website"><meta property="og:url" content="https://elevora.example/pages/${name}.html"><meta property="og:image" content="https://elevora.example/assets/images/branding/logo-light.svg"><link rel="icon" type="image/svg+xml" href="${prefix}assets/images/branding/favicon.svg"><script src="${prefix}assets/js/theme.js"></script><link rel="stylesheet" href="${prefix}assets/vendor/bootstrap.min.css"><link rel="stylesheet" href="${prefix}assets/vendor/bootstrap-icons.css"><link rel="stylesheet" href="${prefix}assets/css/style.css"><link rel="stylesheet" href="${prefix}assets/css/dark-mode.css"><link rel="stylesheet" href="${prefix}assets/css/components.css">${dashboard ? `<link rel="stylesheet" href="${prefix}assets/css/dashboard.css">` : ""}<link rel="stylesheet" href="${prefix}assets/css/responsive.css"><link rel="stylesheet" href="${prefix}assets/css/rtl.css">${!noindex ? '<script type="application/ld+json">' + JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: title, description: desc, isPartOf: { "@type": "WebSite", name: "Elevora demo", url: "https://elevora.example" } }) + "</script>" : ""}</head><body ${dashboard ? `data-dashboard="${name}"` : ""}>${dashboard ? body : nav(name) + `<main id="main">${body}</main>` + footer()}<div class="toast" role="status" hidden></div><script src="${prefix}assets/js/navigation.js"></script><script src="${prefix}assets/js/forms.js"></script>${dashboard ? `<script src="${prefix}assets/vendor/chart.umd.js"></script><script src="${prefix}assets/vendor/jspdf.umd.min.js"></script><script src="${prefix}assets/js/dashboard-data.js"></script><script src="${prefix}assets/js/dashboard-charts.js"></script><script src="${prefix}assets/js/certificates.js"></script><script src="${prefix}assets/js/calendar.js"></script><script src="${prefix}assets/js/dashboard.js"></script>` : `<script src="${prefix}assets/js/program-data.js"></script><script src="${prefix}assets/js/blog-data.js"></script><script src="${prefix}assets/js/programs.js"></script><script src="${prefix}assets/js/main.js"></script>`}</body></html>`;
}
for (const [name, [title, body]] of Object.entries(pages))
    write(`pages/${name}.html`, html(title, body, name));
const dashboardNav = [
    ["index", "Overview", "grid-1x2"],
    ["employees", "Employees", "people"],
    ["departments", "Departments", "building"],
    ["programs", "Training programs", "journal-bookmark"],
    ["batches", "Training batches", "collection"],
    ["enrollments", "Enrollments", "person-plus"],
    ["attendance", "Attendance", "calendar2-check"],
    ["completion", "Module completion", "check2-square"],
    ["certificates", "Certificates", "award"],
    ["calendar", "Training calendar", "calendar3"],
    ["reports", "Reports & analytics", "bar-chart"],
    ["notifications", "Notifications", "bell"],
    ["profile", "My profile", "person-circle"],
    ["settings", "Settings", "gear"],
];
for (const [name, title] of dashboardNav) {
    const body = `<a class="skip-link" href="#main">Skip to dashboard content</a><aside class="dashboard-sidebar" id="dashboard-sidebar">${brand("../../")}<p class="sidebar-label">Learning workspace</p><nav aria-label="Dashboard">${dashboardNav.map(([u, t, i], index) => `${index === 5 ? '<p class="sidebar-label">Learning management</p>' : index === 11 ? '<p class="sidebar-label">Workspace</p>' : ""}<a href="${u}.html" ${u === name ? 'aria-current="page"' : ""}>${icon(i)}<span>${t}</span></a>`).join("")}</nav><a href="../index.html" class="sidebar-return">${icon("arrow-left")}<span>Back to website</span></a><button type="button" class="sidebar-logout" data-logout>${icon("box-arrow-right")}<span>Log out</span></button></aside><div class="dashboard-main"><header class="dashboard-topbar"><div class="actions"><button class="icon-button" data-sidebar-toggle type="button" aria-controls="dashboard-sidebar" aria-expanded="true" aria-label="Toggle dashboard sidebar">${icon("layout-sidebar")}</button><span class="workspace-name">AcmeWorks <small> / Learning & development</small></span></div><div class="actions">${controls}<a class="icon-button" href="notifications.html" aria-label="View notifications">${icon("bell")}</a><a class="avatar" href="profile.html" aria-label="View profile">HR</a></div></header><main id="main" class="dashboard-content"><div class="dashboard-heading"><div><nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Workspace</a><span>/</span><span>${title}</span></nav><h1>${name === "index" ? "Your learning, at a glance." : title}</h1><p>${name === "index" ? "A clear view of your people, programs, and progress." : "Manage your sample " + title.toLowerCase() + " in one place."}</p></div><span class="pill">${icon("circle-fill")} Demo workspace</span></div><div id="dashboard-view" aria-live="polite"></div></main></div><dialog id="record-dialog" aria-labelledby="dialog-title"><div class="dialog-header"><h2 id="dialog-title">Edit record</h2><button class="icon-button" data-close-dialog type="button" aria-label="Close dialog">${icon("x-lg")}</button></div><form id="record-form" class="form-grid"></form></dialog><dialog id="detail-dialog" aria-labelledby="detail-title"><div class="dialog-header"><h2 id="detail-title">Details</h2><button class="icon-button" data-close-dialog type="button" aria-label="Close details">${icon("x-lg")}</button></div><div id="detail-content"></div></dialog>`;
    write(`pages/dashboard/${name}.html`, html(title, body, name, true));
}
write(
    "index.html",
    '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=pages/index.html"><title>Elevora Corporate Training</title></head><body><p><a href="pages/index.html">Open Elevora Corporate Training</a></p></body></html>',
);
write(
    "robots.txt",
    "User-agent: *\nDisallow: /pages/dashboard/\nDisallow: /pages/login.html\nDisallow: /pages/register.html\nDisallow: /pages/forgot-password.html\nSitemap: https://elevora.example/sitemap.xml\n",
);
write(
    "sitemap.xml",
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
        Object.keys(pages)
            .filter(
                (n) =>
                    ![
                        "login",
                        "register",
                        "forgot-password",
                        "404",
                        "coming-soon",
                        "privacy",
                        "terms",
                    ].includes(n),
            )
            .map((n) => `<url><loc>https://elevora.example/pages/${n}.html</loc></url>`)
            .join("") +
        "</urlset>",
);
const mark =
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#142b49"/><stop offset="1" stop-color="#087c78"/></linearGradient></defs><rect x="1" y="1" width="46" height="46" rx="13" fill="url(#g)"/><path d="M14 33V15h19M14 24h15M14 33h19" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="m29 12 7 7" stroke="#d6a85b" stroke-width="3" stroke-linecap="round"/></svg>';
write("assets/images/branding/mark.svg", mark);
write("assets/images/branding/favicon.svg", mark);
for (const [name, color] of [
    ["logo-light", "#142b49"],
    ["logo-dark", "#ffffff"],
])
    write(
        `assets/images/branding/${name}.svg`,
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 48">${mark.replace(/<svg[^>]*>|<\/svg>/g, "")}<text x="58" y="34" fill="${color}" font-family="Arial,sans-serif" font-size="34" font-weight="700">elevora</text></svg>`,
    );
const vendors = [
    ["bootstrap/dist/css/bootstrap.min.css", "bootstrap.min.css"],
    ["bootstrap-icons/font/bootstrap-icons.css", "bootstrap-icons.css"],
    ["bootstrap-icons/font/fonts/bootstrap-icons.woff2", "fonts/bootstrap-icons.woff2"],
    ["bootstrap-icons/font/fonts/bootstrap-icons.woff", "fonts/bootstrap-icons.woff"],
    ["chart.js/dist/chart.umd.js", "chart.umd.js"],
    ["jspdf/dist/jspdf.umd.min.js", "jspdf.umd.min.js"],
];
for (const [from, to] of vendors) {
    const dest = path.join(root, "assets/vendor", to);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(root, "node_modules", from), dest);
}
for (const lib of ["bootstrap", "bootstrap-icons", "chart.js", "jspdf"]) {
    const file = ["LICENSE", "LICENSE.md", "LICENSE.txt"].find((n) =>
        fs.existsSync(path.join(root, "node_modules", lib, n)),
    );
    if (file)
        fs.copyFileSync(
            path.join(root, "node_modules", lib, file),
            path.join(root, "assets/vendor", lib.replace(".", "-") + "-LICENSE.txt"),
        );
}
console.log(
    `Generated ${Object.keys(pages).length} public pages and ${dashboardNav.length} dashboard pages.`,
);

// Apply the shared image-led page treatment after generating the source HTML.
require("./premium-pages.cjs").apply();

require("./program-pages.cjs").apply();
