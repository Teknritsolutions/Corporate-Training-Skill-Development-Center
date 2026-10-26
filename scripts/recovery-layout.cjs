module.exports=function refine(html){
html=html.replace(/(<section class="section premium-auth premium-hero vh-auth-forgot-password">)[\s\S]*?<\/section>/,section=>{
section=section.replace(/<div class="auth-intro-copy">[\s\S]*?<\/div>/,'<div class="auth-intro-copy"><span class="eyebrow">Back to your workspace</span><h2>A clear way back.</h2><p>Review the recovery steps and return to your team\'s learning workspace.</p></div>');
section=section.replace('<h1>Reset your demo access.</h1>','<span class="eyebrow">Account recovery</span><h1>Recover your access.</h1><p class="recovery-description">Enter your email address to view the recovery instructions for this workspace. No recovery email is sent.</p>');
return section;
});return html;
};
