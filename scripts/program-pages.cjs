const fs=require('fs');const path=require('path');
const configs={
communication:{slug:'communication-skills',image:'communication-workshop',intro:'Build the habits that make everyday communication clearer: listen with intention, organise your ideas, and adapt your message to the people in front of you. Guided practice helps your team handle presentations, written updates, and difficult conversations with greater confidence.',focus:'Clear conversations. Stronger collaboration.'},
leadership:{slug:'leadership-development',image:'leadership-workshop',intro:'Develop a practical approach to leading people, from setting clear expectations to coaching performance and navigating change. Reflect on your leadership style, practise everyday management conversations, and build an action plan that supports your team.',focus:'Lead with clarity. Help your team grow.'},
sales:{slug:'sales-excellence',image:'sales-coaching',intro:'Strengthen every stage of the customer conversation, from understanding a real business need to explaining value and agreeing the next step. Practise discovery, objection handling, and negotiation through realistic scenarios with constructive feedback.',focus:'Understand the customer. Build lasting value.'},
technical:{slug:'technical-upskilling',image:'technical-lab',intro:'Build confidence with the digital tools and workflows your team uses every day. Guided exercises connect digital foundations, data handling, and process improvement to an applied team project, helping learners turn new knowledge into useful working habits.',focus:'Practical digital skills for everyday work.'}
};
module.exports={configs,apply(){
let base=fs.readFileSync('pages/program-details.html','utf8');
const sandbox={window:{}};require('vm').runInNewContext(fs.readFileSync('assets/js/program-data.js','utf8'),sandbox);
for(const p of sandbox.window.ElevoraPrograms){
 const c=configs[p.id];let html=base.replace('<body>',`<body data-program="${p.id}">`);
 html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${p.title} | Elevora</title>`).replace(/program-details\.html/g,c.slug+'.html');
 html=html.replace(/(<span data-program-title>)[\s\S]*?(<\/span>)/g,'$1'+p.title+'$2');
 html=html.replace(/(<span data-program-description>)[\s\S]*?(<\/span>)/g,'$1'+p.description+'$2');
 html=html.replace(/(<span data-program-duration>)[\s\S]*?(<\/span>)/g,'$1'+p.duration+'$2');
 html=html.replace(/src="\.\.\/assets\/images\/heroes\/program-details.webp"/,'src="../assets/images/programs/'+p.id+'-hero.webp"');
 html=html.replace(/alt="A coach guiding a practical leadership exercise"/,`alt="Professionals practising ${p.category.toLowerCase()} skills in a guided workshop"`);
 html=html.replace(/(<div data-program-modules class="faq">)[\s\S]*?(<\/div>)/,'$1$2');
 html=html.replace(/<p class="program-intro">[\s\S]*?<\/p>/,'');
 html=html.replace(/(<a class="btn vh-action" href="#program-learning">)/,`<p class="program-intro">${c.intro}</p>$1`);
 html=html.replace('Build capability you can put to work.',c.focus);
 html=html.replace(/content="Explore[^"\n]*"/g,`content="${p.description}"`);
 html=html.replace(/(<meta\s+name="description"\s+content=")[^"]*/, '$1'+p.description);
 html=html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*/, '$1'+p.description);
 html=html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (all, open, data, close) => { const schema=JSON.parse(data); schema.name=p.title; schema.description=p.description; return open+JSON.stringify(schema)+close; });
 fs.writeFileSync('pages/'+c.slug+'.html',html);
}
let sitemap=fs.readFileSync('sitemap.xml','utf8');
for(const c of Object.values(configs)) if(!sitemap.includes('/'+c.slug+'.html')) sitemap=sitemap.replace('</urlset>','<url><loc>https://elevora.example/pages/'+c.slug+'.html</loc></url></urlset>');
fs.writeFileSync('sitemap.xml',sitemap);
for(const file of fs.readdirSync('pages').filter(n=>n.endsWith('.html')).map(n=>'pages/'+n)){
 let html=fs.readFileSync(file,'utf8');
 for(const [id,c] of Object.entries(configs)){
  html=html.replace(new RegExp('(?:program-details|'+Object.values(configs).map(v=>v.slug).join('|')+')\\.html\\?program='+id,'g'),c.slug+'.html');
 }
 fs.writeFileSync(file,html);
}
}};
if(require.main===module)module.exports.apply();
