module.exports = function enhance(html){
 if(!html.includes('class="training-hero-detail"'))html=html.replace(/(<a class="btn vh-action" href="#training-inquiry">)/,"<p class=\"training-hero-detail\">Start with the skills your people need and the situations they face every day. We work with you to shape relevant examples, practical exercises, and a delivery rhythm that fits your team.</p><p class=\"training-hero-detail\">Share your audience, preferred dates, and learning priorities in the brief below. Together, we can define clear outcomes and a useful next step for your organization.</p>"+'$1');
 html=html.replace(/<div class="split">(?=\s*<img\s+src="\.\.\/assets\/images\/custom-consultation.webp")/,'<div class="split training-consultation">');
 return require("./training-guidance.cjs")(require("./training-packages.cjs")(require("./training-form-layout.cjs")(html)));
};
