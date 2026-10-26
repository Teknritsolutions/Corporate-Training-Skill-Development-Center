const fs=require('fs');
function enhance(html) {
return html.replace(/<article class="card padded">[\s\S]*?<\/article>/g,tag=>{
const stage=['before','during','after'].find(stage=>tag.includes('<h3>'+stage[0].toUpperCase()+stage.slice(1)+' learning</h3>'));
if(!stage)return tag;
return tag.replace('class="card padded"','class="card padded progress-photo-card"').replace(/(<article[^>]*>)/,'$1<img class="progress-photo" src="../assets/images/learning-progress/'+stage+'.webp" alt="" width="1200" height="800" loading="lazy" decoding="async" />');
});
}
module.exports=enhance;
if(require.main===module){const f='pages/methodology.html';fs.writeFileSync(f,enhance(fs.readFileSync(f,'utf8')));}
