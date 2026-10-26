const fs = require('node:fs');
const section = `<section class="section delivery-guide" aria-labelledby="delivery-guide-title">
<div class="container">
<div class="delivery-guide-heading"><div><span class="eyebrow">Delivery that works</span><h2 id="delivery-guide-title">The right setting.<br />The same practical focus.</h2></div><p>Choose a format around your team's location, working rhythm, and learning goals. Every route combines guided practice, useful feedback, and an action to take back to work.</p></div>
<div class="delivery-guide-layout">
<div class="delivery-guide-photos">
<figure><img src="../assets/images/methodology-delivery/workshop.webp" alt="Colleagues working through a hands-on group exercise with a facilitator" width="1200" height="800" loading="lazy" /><figcaption><i class="bi bi-people" aria-hidden="true"></i> Space to practise together</figcaption></figure>
<figure><img src="../assets/images/methodology-delivery/remote.webp" alt="A facilitator guiding remote colleagues through an interactive online workshop" width="1200" height="800" loading="lazy" /><figcaption><i class="bi bi-camera-video" aria-hidden="true"></i> Connection across locations</figcaption></figure>
</div>
<div class="delivery-guide-options">
<article><div class="delivery-guide-number">01</div><div><span class="delivery-guide-tag">Together in the room</span><h3>Classroom workshops</h3><p>Make room for focused discussion, role-play, and immediate feedback, with a facilitator helping everyone contribute.</p><dl><dt>Best for</dt><dd>Teams practising conversations, collaboration, or shared challenges.</dd><dt>Plan for</dt><dd>A shared venue and protected time away from daily tasks.</dd></dl></div></article>
<article><div class="delivery-guide-number">02</div><div><span class="delivery-guide-tag">Connected from anywhere</span><h3>Live virtual sessions</h3><p>Bring distributed colleagues into one active learning space through facilitated discussion, breakout tasks, and shared exercises.</p><dl><dt>Best for</dt><dd>Teams across offices or colleagues working remotely.</dd><dt>Plan for</dt><dd>Time-zone overlap, reliable audio, and a quiet place to participate.</dd></dl></div></article>
<article><div class="delivery-guide-number">03</div><div><span class="delivery-guide-tag">Learning in a working rhythm</span><h3>A blended learning journey</h3><p>Connect live sessions with guided workplace practice. Give people time to try a new skill, reflect, and return with questions.</p><dl><dt>Best for</dt><dd>Skills that benefit from repeated practice and follow-up.</dd><dt>Plan for</dt><dd>Practice time between sessions and support from team managers.</dd></dl></div></article>
</div>
</div>
<div class="delivery-guide-note"><span><strong>Not sure which format fits?</strong> Share your team size, locations, and priorities. We can shape a delivery plan around them.</span><a class="text-link" href="customized-training.html">Plan your learning journey <i class="bi bi-arrow-right" aria-hidden="true"></i></a></div>
</div></section>`;
module.exports = html => html.replace(/<section class="section">(?:(?!<section)[\s\S])*?Meet your team where they are\.(?:(?!<section)[\s\S])*?<\/section>/, section);
if (require.main === module) { const file='pages/methodology.html'; fs.writeFileSync(file,module.exports(fs.readFileSync(file,'utf8'))); }
