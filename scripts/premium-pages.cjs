const fs = require("node:fs");
const path = require("node:path");
const descriptions = {
    index: "A facilitator leading an interactive workshop in a bright modern learning studio",
    "home-2": "Senior leaders sharing ideas during a strategy roundtable",
    about: "Learning designers collaborating in a welcoming training studio",
    programs: "Professionals practicing their skills in a guided workshop",
    "program-details": "A coach supporting managers through a practical learning exercise",
    methodology: "Learners mapping a practical training process together",
    clients: "A client team celebrating their collaborative learning journey",
    "customized-training": "A learning consultant shaping a training plan with an HR director",
    blog: "A professional exploring ideas in a sunlit reading space",
    contact: "A welcoming learning centre reception and advisor",
    terms: "A business consultant reviewing a service agreement",
    login: "A professional arriving at a contemporary learning centre",
    register: "New learners welcomed by a course advisor",
    "forgot-password": "A support specialist helping a professional with a laptop",
    "coming-soon": "A modern learning studio prepared for its next cohort",
    404: "A calm contemporary office corridor filled with natural light",
};
function premiumPage(html, name) {
    if (!descriptions[name]) return html;
    if (!html.includes("../assets/css/premium.css"))
        html = html.replace(
            "</head>",
            '<link rel="stylesheet" href="../assets/css/premium.css" />\n</head>',
        );
    if (html.includes("premium-hero")) return html;
    const photo = `<img class="hero-photograph" src="../assets/images/heroes/${name}.webp" alt="${descriptions[name]}" width="1536" height="1024" fetchpriority="high" decoding="async" />`;
    return html.replace(/<section\b[^>]*>([\s\S]*?)<\/section>/, (section, inner) => {
        if (["login", "register", "forgot-password"].includes(name)) {
            return section
                .replace('class="section soft"', 'class="section premium-auth premium-hero"')
                .replace(
                    '<div class="auth-intro">',
                    `<div class="auth-intro">${photo}<div class="auth-intro-copy">`,
                )
                .replace('<div class="auth-form">', '</div><div class="auth-form">');
        }
        if (name === "coming-soon")
            return section
                .replace('class="section soft"', 'class="section premium-hero premium-launch"')
                .replace(/(<div class="container">)/, `${photo}$1`);
        const h1 = inner.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0] || "";
        const eyebrow =
            inner.match(/<span class="eyebrow"[^>]*>[\s\S]*?<\/span>/)?.[0] ||
            '<span class="eyebrow">Elevora corporate learning</span>';
        const para = inner.match(/<p\b[^>]*>[\s\S]*?<\/p>/)?.[0] || "";
        const crumb = inner.match(/<nav class="breadcrumb"[\s\S]*?<\/nav>/)?.[0] || "";
        const actions = inner.match(/<div class="actions[^\"]*">[\s\S]*?<\/div>/)?.[0] || "";
        const note =
            name === "index"
                ? '<div class="hero-assurance"><span><i class="bi bi-patch-check" aria-hidden="true"></i> Expert facilitators</span><span><i class="bi bi-graph-up-arrow" aria-hidden="true"></i> Practical progress</span></div>'
                : "";
        return `<section class="premium-hero premium-hero-${name}">${photo}<div class="container hero-stage"><div class="hero-panel">${crumb}${eyebrow}${h1}${para}${actions}${note}</div><div class="hero-caption"><i class="bi bi-stars" aria-hidden="true"></i><span>Made for people. Built for progress.</span></div></div></section>`;
    });
}
function apply() {
    for (const name of Object.keys(descriptions)) {
        const file = path.join(__dirname, "..", "pages", name + ".html");
        let html = premiumPage(fs.readFileSync(file, "utf8"), name);
        const iconMap = {
            "bi-person-check": "bi-person-video3",
            "bi-journal-check": "bi-journal-richtext",
            "bi-calendar2-check": "bi-calendar2-check",
            "bi-bar-chart": "bi-graph-up-arrow",
            "bi-sliders": "bi-sliders2",
        };
        for (const [from, to] of Object.entries(iconMap))
            html = html.replaceAll('class="bi ' + from + '"', 'class="bi ' + to + '"');
        html = html.replace(/<div class="process">([\s\S]*?)<\/div>/g, (all, inner) => {
            if (inner.includes("process-glyph")) return all;
            let i = 0;
            const icons = ["bullseye", "layers", "rocket-takeoff", "clipboard-data"];
            return (
                '<div class="process">' +
                inner.replace(
                    /<article>/g,
                    () =>
                        '<article><span class="process-glyph"><i class="bi bi-' +
                        icons[i++ % 4] +
                        '" aria-hidden="true"></i></span>',
                ) +
                "</div>"
            );
        });
        html = html.replace(/<section class="section case">[\s\S]*?<\/section>/g, (section) => {
            if (section.includes("case-reflection")) return section;
            const reflection = section.match(
                /<blockquote>[\s\S]*?<\/blockquote>\s*<p><small>[\s\S]*?<\/small><\/p>/,
            )?.[0];
            if (!reflection) return section;
            return section
                .replace(reflection, "")
                .replace(
                    /<\/div>\s*<\/div>\s*<\/section>$/,
                    '</div><div class="case-reflection">' + reflection + "</div></div></section>",
                );
        });
        if (name === "home-2") {
            if (!html.includes("assets/css/home-two.css"))
                html = html.replace(
                    "</head>",
                    '<link rel="stylesheet" href="../assets/css/home-two.css" /></head>',
                );
            if (!html.includes("assets/js/home-two.js"))
                html = html.replace(
                    "</body>",
                    '<script src="../assets/js/home-two.js"></script></body>',
                );
        }
        html = require("./inner-heroes.cjs")(html, name);
        html = require("./supporting-visuals.cjs")(html, name);
        fs.writeFileSync(file, html);
    }
}
module.exports = { premiumPage, apply };
if (require.main === module) apply();
