const people = [
    [
        "Priya Rao",
        "Learning Director",
        "priya-rao",
        "Designs inclusive learning journeys and supports facilitator development.",
    ],
    [
        "Daniel Brooks",
        "Program Director",
        "daniel-brooks",
        "Connects business needs with practical curriculum and skills practice.",
    ],
    [
        "Sofia Chen",
        "Client Partner",
        "sofia-chen",
        "Helps training managers turn learning priorities into a clear delivery plan.",
    ],
];
const panel = (photo, alt, heading, text) =>
    `<div class="context-visual"><figure><img src="../assets/images/supporting/${photo}.webp" alt="${alt}" width="1536" height="1024" loading="lazy" /></figure><div class="context-visual-copy"><span class="eyebrow">Learning in context</span><h2 class="context-heading">${heading}</h2><p>${text}</p>${photo === "program-practice" ? "<ul class=\"practice-benefits\"><li><strong>Practise real scenarios</strong><span>Work through conversations and challenges from your day-to-day role.</span></li><li><strong>Learn with feedback</strong><span>Build confidence with guided exercises and support from your facilitator.</span></li><li><strong>Apply your next step</strong><span>Leave with practical actions to try with your team at work.</span></li></ul>" : ""}</div></div>`;
module.exports = (html, name) => {
    if (name === "methodology") { html = require("./methodology-delivery.cjs")(html); html = require("./measurement-cards.cjs")(html); }
    if (name === "programs") html = html.replace(/<article class="card padded">[\s\S]*?<\/article>/g, tag => {
        const modes = [["Classroom training", "classroom"], ["Live virtual learning", "virtual"], ["Hybrid learning", "hybrid"]];
        const mode = modes.find(([title]) => tag.includes("<h3>" + title + "</h3>"));
        return mode ? tag.replace('class="card padded"', 'class="card padded learning-format learning-format-' + mode[1] + '"').replace(/(<article[^>]*>)/, '$1<img class="learning-format-photo" src="../assets/images/learning-formats/' + mode[1] + '.webp" alt="" width="1000" height="667" loading="lazy" decoding="async" />') : tag;
    });
    if (name === "about")
        html = html.replace(/<section\b[^>]*>[\s\S]*?<\/section>/g, (section) => {
            if (!section.includes("Priya Rao")) return section;
            if (!section.includes('id="about-team"'))
                section = section.replace("<section ", '<section id="about-team" ');
            section = section.replace('class="grid cols-3"', 'class="leadership-grid"');
            return section.replace(/<article\b[^>]*>[\s\S]*?<\/article>/g, (article) => {
                const person = people.find((p) => article.includes(p[0]));
                if (!person) return article;
                const [n, r, photo, bio] = person;
                return `<article class="leadership-card"><img src="../assets/images/supporting/${photo}.webp" alt="Fictional ${r.toLowerCase()} ${n}" width="1024" height="1024" loading="lazy" /><div class="leadership-copy"><h3>${n}</h3><span class="leadership-role">${r}</span><p>${bio}</p></div></article>`;
            });
        });
    if (name === "about")
        html = html.replace(/<div class="vh-scroll-target" id="about-team"><\/div>/, "");
    const formAnchors = {
        contact: ["contact", "contact-inquiry"],
        "customized-training": ["proposal", "training-inquiry"],
    };
    if (formAnchors[name]) {
        const [form, id] = formAnchors[name];
        html = html.replace(
            new RegExp('<div class="vh-scroll-target" id="' + id + '"><\\/div>'),
            "",
        );
        html = html.replace(
            new RegExp('<form(?![^>]*id=)([^>]*data-demo-form="' + form + '"[^>]*)>'),
            '<form id="' + id + '"$1>',
        );
    }
    const panels = {
        programs: panel(
            "program-practice",
            "Professionals practising a presentation with their colleagues",
            "Skills become useful when you practise them.",
            "Choose a learning focus that connects to the conversations, decisions, and challenges your people face at work.",
        ),
        clients: panel(
            "client-review",
            "An HR partner and colleagues reviewing learning progress",
            "Make progress a shared conversation.",
            "Agree what you want to notice, make room for reflection, and connect learning to the work your team is doing.",
        ),
        contact: panel(
            "learning-campus",
            "A bright welcoming lounge at a contemporary learning campus",
            "A welcoming space for your next conversation.",
            "Talk through your team priorities, explore delivery options, and plan a learning experience that suits the way your people work.",
        ),
    };
    if (
        panels[name] &&
        !html.includes(
            "assets/images/supporting/" +
                {
                    programs: "program-practice",
                    clients: "client-review",
                    contact: "learning-campus",
                }[name],
        )
    ) {
        let i = 0;
        html = html.replace(/<section\b[^>]*>[\s\S]*?<\/section>/g, (section) => {
            if (i++ !== 1) return section;
            return section.replace(/<\/div>\s*<\/section>$/, panels[name] + "</div></section>");
        });
    }
    if (name === "contact" && !html.includes('id="body-section-heading"')) {
        let index = 0;
        html = html.replace(/<section\b([^>]*)>/g, (all) => {
            if (index++ !== 1) return all;
            return (
                all +
                '<h2 class="visually-hidden" id="body-section-heading">' +
                (name === "contact" ? "Contact options" : "Training packages") +
                "</h2>"
            );
        });
    }
    if (name === "coming-soon")
        html = html.replace(
            /<h3>(A fresh perspective,[\s\S]*?)<\/h3>/,
            '<h2 class="launch-form-heading">$1</h2>',
        );
    if (name === "clients") html = require("./client-refinements.cjs")(html);
    if (name === "customized-training") html = require("./training-refinements.cjs")(html);
    if (name === "blog") html = require("./journal-refinements.cjs")(html);
    if (name === "contact") html = require("./contact-refinements.cjs")(html);
    if (["login", "register"].includes(name)) html = require("./auth-layout.cjs")(html);
    if (["404", "coming-soon"].includes(name)) html = require("./auth-layout.cjs")(html).replace("data-auth-page", "data-standalone-page");
    if (name === "forgot-password") html = require("./recovery-layout.cjs")(html);
    return html;
};
