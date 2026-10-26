/* Shared public footer. Imported by the page generator. */
const icon = (name) => `<i class="bi bi-${name}" aria-hidden="true"></i>`;
module.exports = () => `<footer class="site-footer premium-footer">
<div class="container">
<div class="footer-grid">
<div class="footer-brand-column"><a class="brand" href="index.html" aria-label="Elevora home"><img src="../assets/images/branding/mark.svg" alt="" width="46" height="46"><span>elevora<small>Corporate learning</small></span></a><p>Practical learning for stronger teams. Built around your people, your goals, and the work ahead.</p><div class="socials" aria-label="Social media"><a href="https://www.linkedin.com/" aria-label="LinkedIn (demo social link)">${icon("linkedin")}</a><a href="https://www.instagram.com/" aria-label="Instagram (demo social link)">${icon("instagram")}</a><a href="https://www.youtube.com/" aria-label="YouTube (demo social link)">${icon("youtube")}</a></div></div>
<nav class="footer-links" aria-label="Explore Elevora"><h2 class="footer-heading">Explore Elevora</h2>${[
    ["about.html", "About us"],
    ["methodology.html", "Our methodology"],
    ["clients.html", "Client stories"],
    ["customized-training.html#training-packages", "Training packages"],
    ["blog.html", "Learning insights"],
    ["contact.html", "Get in touch"],
]
    .map(([url, label]) => `<a href="${url}">${label}</a>`)
    .join("")}</nav>
<nav class="footer-links" aria-label="Training programs"><h2 class="footer-heading">Our programs</h2>${[
    ["program-details.html?program=communication", "Communication Skills"],
    ["program-details.html?program=leadership", "Leadership Development"],
    ["program-details.html?program=sales", "Sales Excellence"],
    ["program-details.html?program=technical", "Technical Upskilling"],
    ["customized-training.html", "Customized training"],
    ["programs.html", "All programs"],
]
    .map(([url, label]) => `<a href="${url}">${label}</a>`)
    .join("")}</nav>
<div class="footer-connect"><h2 class="footer-heading">Let&rsquo;s stay connected</h2><a class="footer-contact" href="mailto:hello@elevora.example">${icon("envelope")}<span>hello@elevora.example</span></a><a class="footer-contact" href="tel:+12025550148">${icon("telephone")}<span>+1 (202) 555-0148</span></a><p class="footer-hours">${icon("clock")}<span>Mon&ndash;Fri, 9am&ndash;6pm<br>Sample contact details</span></p><form data-demo-form="newsletter"><label for="footer-email">Learning notes, thoughtfully delivered.</label><div class="newsletter-inline"><input id="footer-email" type="email" name="email" required autocomplete="email" placeholder="Work email" aria-label="Newsletter email"><button class="btn" type="submit" aria-label="Subscribe to demo newsletter">${icon("arrow-right")}</button></div><div class="form-status" role="status"></div></form></div>
</div><div class="footer-bottom"><span>&copy; 2026 Elevora. All rights reserved.</span><nav aria-label="Legal information"><a href="terms.html">Terms &amp; conditions</a></nav></div>
</div></footer>`;
