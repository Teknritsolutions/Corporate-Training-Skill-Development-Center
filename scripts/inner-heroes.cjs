/* Distinct, content-led hero compositions for the inner pages. */
const icon = (name) => `<i class="bi bi-${name}" aria-hidden="true"></i>`;
const action = (href, label) =>
    `<a class="btn vh-action" href="${href}">${label}${icon("arrow-right")}</a>`;
const photoDescriptions = {
    about: "Learning designers sharing ideas in a welcoming studio",
    programs: "Professionals practising communication in a small workshop",
    "program-details": "A coach guiding a practical leadership exercise",
    methodology: "Learners mapping a process around a workshop table",
    clients: "A team celebrating its collaborative learning journey",
    "customized-training": "A consultant discussing a tailored learning plan",
    blog: "A professional exploring ideas in a sunlit reading space",
    contact: "An advisor welcoming visitors at a learning centre",
    terms: "A consultant reviewing a service agreement",
    404: "A welcoming office corridor",
};
const extras = {
    about: `<div class="vh-signature">${icon("people")}<span>People at the centre.<br>Purpose in every detail.</span></div>`,
    programs: `<div class="vh-category-bar">${["Communication", "Leadership", "Sales", "Digital capability"].map((x, i) => `<a href="program-details.html?program=${["communication", "leadership", "sales", "technical"][i]}"><span>0${i + 1}</span>${x}${icon("arrow-up-right")}</a>`).join("")}</div>`,
    "program-details": `<div class="vh-course-facts"><div>${icon("people")}<span>Small-group practice</span></div><div>${icon("journal-check")}<span>Workplace application</span></div></div>`,
    methodology: `<div class="vh-method-rail">${["Understand the context", "Create room to practise", "Reflect and apply"].map((x, i) => `<div><span>0${i + 1}</span><strong>${x}</strong></div>`).join("")}</div>`,
    clients: `<div class="vh-story-label">${icon("chat-square-quote")}<span>Different teams.<br>Meaningful possibilities.</span></div>`,
    "customized-training": `<div class="vh-brief-tags"><span>${icon("bullseye")} Your priorities</span><span>${icon("people")} Your people</span><span>${icon("sliders2")} Your pace</span></div>`,
    blog: `<div class="vh-editor-note"><span>Perspectives / practice / progress</span>${icon("journal-richtext")}</div>`,
    contact: `<div class="vh-contact-options"><a href="mailto:hello@elevora.example">${icon("envelope")}<span>Email an advisor<strong>hello@elevora.example</strong></span></a><a href="tel:+12025550148">${icon("telephone")}<span>Start a conversation<strong>+1 (202) 555-0148</strong></span></a></div>`,
    terms: `<div class="vh-document-label">${icon("file-earmark-text")}<span>Read with clarity.<br>Plan with confidence.</span></div>`,
    404: `<div class="vh-error-number" aria-hidden="true">404</div>`,
};
const links = {
    about: ["#about-team", "Meet the people"],
    programs: ["#program-list", "Find your program"],
    "program-details": ["#program-learning", "Explore the learning journey"],
    methodology: ["#learning-method", "See the approach"],
    clients: ["#client-perspectives", "Explore the possibilities"],
    "customized-training": ["#training-inquiry", "Start your training brief"],
    blog: ["#blog-list", "Explore the journal"],
    contact: ["#contact-inquiry", "Tell us about your team"],
    terms: ["#terms-details", "Read the terms"],
    404: ["index.html", "Return to homepage"],
};
function variantHero(html, name) {
    if (["index", "home-2"].includes(name)) return html;
    if (!html.includes("assets/css/inner-pages.css"))
        html = html.replace(
            "</head>",
            '<link rel="stylesheet" href="../assets/css/inner-pages.css" /></head>',
        );
    if (["login", "register", "forgot-password"].includes(name))
        return html.replace(
            /<section class="([^"]*premium-auth[^"]*)"/,
            (_, cls) => `<section class="${cls.replace(/\s*vh-auth-\S+/g, "")} vh-auth-${name}"`,
        );
    if (name === "coming-soon")
        return html.replace(
            /<section class="([^"]*premium-launch[^"]*)"/,
            (_, cls) => `<section class="${cls.includes("vh-launch") ? cls : cls + " vh-launch"}"`,
        );
    if (!photoDescriptions[name]) return html;
    html = html.replace(/<section\b[^>]*>[\s\S]*?<\/section>/, (section) => {
        const h1 = section.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0] || "";
        const eyebrow =
            section.match(/<span class="eyebrow"[^>]*>[\s\S]*?<\/span>/)?.[0] ||
            '<span class="eyebrow">Elevora corporate learning</span>';
        const paragraph = section.match(/<p\b[^>]*>[\s\S]*?<\/p>/)?.[0] || "";
        const breadcrumb = section.match(/<nav class="breadcrumb"[\s\S]*?<\/nav>/)?.[0] || "";
        const image = `<figure class="vh-media"><img class="vh-photo hero-photograph" src="../assets/images/heroes/${name}.webp" alt="${photoDescriptions[name]}" width="1536" height="1024" fetchpriority="high" decoding="async" /></figure>`;
        const [href, label] = links[name];
        const copy = `<div class="vh-copy">${breadcrumb}${eyebrow}${h1}${paragraph}${action(href, label)}</div>`;
        const extra = `<div class="vh-extra">${extras[name] || ""}</div>`;
        return `<section class="premium-hero variant-hero vh-${name}" data-hero-design="${name}"><div class="container vh-layout">${copy}${image}${extra}</div></section>`;
    });
    if (name !== "404" && !html.includes('id="' + links[name][0].slice(1) + '"')) {
        const target = links[name][0].slice(1);
        html = html.replace(
            /(<\/section>\s*)(?=<section)/,
            '$1<div class="vh-scroll-target" id="' + target + '"></div>',
        );
    }
    return html;
}
module.exports = variantHero;
