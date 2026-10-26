module.exports=function simplify(html){
const controls=html.match(/<button\b(?=[^>]*data-(?:theme|rtl)-toggle)[\s\S]*?<\/button>/g)||[];
html=html.replace(/<header class="site-header"[\s\S]*?<\/header>/,'').replace(/<footer\b[\s\S]*?<\/footer>/,'');
html=html.replace('<body>','<body data-auth-page>');
if(!html.includes('class="auth-page-tools"'))html=html.replace(/(<body[^>]*>)/,'$1<div class="auth-page-tools" role="group" aria-label="Display preferences">'+controls.join('')+'</div>');
return html;
};
