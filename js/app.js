var nameEl=document.getElementById('name');
var urlEl=document.getElementById('url');
var catEl=document.getElementById('category');
var addBtn=document.getElementById('addBtn');
var updateBtn=document.getElementById('updateBtn');
var cancelBtn=document.getElementById('cancelBtn');
var searchEl=document.getElementById('searchName');
var filterEl=document.getElementById('filterCat');
var sortEl=document.getElementById('sortBy');
var myIndex=-1;var delIndex=-1;
var Bookmarks=[];
try{Bookmarks=JSON.parse(localStorage.getItem('bookmarker_v2'))||[]}catch(e){Bookmarks=[]}
function ar2en(c){var m={'عام':'General','عمل':'Work','تعليم':'Study','ترفيه':'Fun','تسوق':'Shopping','تواصل':'Social'};return m[c]||c||'General'}
Bookmarks=Bookmarks.map(function(b){return{name:b.name,url:b.url,category:ar2en(b.category),fav:!!b.fav,created:b.created||Date.now()}});
if(!Bookmarks.length){try{var old=JSON.parse(localStorage.getItem('containerStorage'))||[];Bookmarks=old.map(function(b){return{name:b.name,url:b.url,category:'General',fav:false,created:Date.now()}});save();}catch(e){}}
function save(){localStorage.setItem('bookmarker_v2',JSON.stringify(Bookmarks))}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function normUrl(u){u=(u||'').trim();if(!u)return '';if(!/^https?:\/\//i.test(u))u='https://'+u;return u}
function validUrl(u){try{var x=new URL(normUrl(u));return x.protocol==='http:'||x.protocol==='https:'}catch(e){return false}}
function toast(m,t){var w=document.getElementById('toastWrap');var d=document.createElement('div');d.className='bm-toast '+(t||'info');d.innerHTML='<i class="fa-solid '+(t==='success'?'fa-circle-check':t==='error'?'fa-circle-exclamation':'fa-circle-info')+'"></i> '+esc(m);w.appendChild(d);setTimeout(function(){d.classList.add('out');setTimeout(function(){d.remove()},320)},2200)}
function hi(text,term){if(!term)return esc(text);var i=String(text).toLowerCase().indexOf(term.toLowerCase());if(i<0)return esc(text);return esc(String(text).slice(0,i))+"<span class='highlight'>"+esc(String(text).slice(i,i+term.length))+"</span>"+esc(String(text).slice(i+term.length))}
function favicon(b){try{var u=new URL(b.url);return 'https://www.google.com/s2/favicons?sz=64&domain='+u.hostname}catch(e){return ''}}
function bump(id,val){var el=document.getElementById(id);if(el.textContent!=String(val)){el.textContent=val;el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump')}}
function addBookmark(){var n=nameEl.value.trim();var u=normUrl(urlEl.value);
var okN=n.length>=3;var okU=validUrl(urlEl.value);
nameEl.classList.toggle('is-invalid',!okN);nameEl.classList.toggle('is-valid',okN);
urlEl.classList.toggle('is-invalid',!okU);urlEl.classList.toggle('is-valid',okU);
if(!okN||!okU){toast('Please check the name and URL','error');return}
if(Bookmarks.some(function(b){return b.url.toLowerCase()===u.toLowerCase()})){toast('This URL is already saved','error');urlEl.classList.add('is-invalid');return}
Bookmarks.unshift({name:n,url:u,category:catEl.value,fav:false,created:Date.now()});
save();clear();render();toast('Bookmark added!','success')}
function clear(){nameEl.value='';urlEl.value='';nameEl.classList.remove('is-valid','is-invalid');urlEl.classList.remove('is-valid','is-invalid')}
function render(){var term=(searchEl.value||'').trim();var fc=filterEl.value;var sort=sortEl.value;
var cats={};Bookmarks.forEach(function(b){cats[b.category||'General']=1});
var cur=filterEl.value;filterEl.innerHTML='<option value="">All categories</option>'+Object.keys(cats).map(function(c){return '<option '+(c===cur?'selected':'')+'>'+esc(c)+'</option>'}).join('');
bump('statTotal',Bookmarks.length);
bump('statFav',Bookmarks.filter(function(b){return b.fav}).length);
bump('statCat',Object.keys(cats).length);
var list=Bookmarks.map(function(b,i){return{b:b,i:i}}).filter(function(x){
if(fc&&x.b.category!==fc)return false;
if(term&&(x.b.name+' '+x.b.url).toLowerCase().indexOf(term.toLowerCase())<0)return false;return true});
if(sort==='name')list.sort(function(a,b2){return a.b.name.localeCompare(b2.b.name,'en')});
else if(sort==='fav')list.sort(function(a,b2){return(b2.b.fav-a.b.fav)||(b2.b.created-a.b.created)});
var h='';
list.forEach(function(x,idx){var b=x.b;var i=x.i;var f=favicon(b);
h+='<tr class="row-anim" style="animation-delay:'+Math.min(idx*45,450)+'ms" data-row="'+i+'"><td class="fw-bold text-muted">'+(idx+1)+'</td>'
+'<td><div class="site-cell"><div class="favicon">'+(f?'<img loading="lazy" src="'+f+'" onerror="this.remove()">':esc((b.name||'?').charAt(0).toUpperCase()))+'</div>'
+'<div><div class="site-name">'+hi(b.name,term)+' <span class="site-cat">'+esc(b.category||'General')+'</span> '+(b.fav?'<i class="fa-solid fa-star text-warning"></i>':'')+'</div></div></div></td>'
+'<td dir="ltr" style="text-align:left"><a class="site-url" target="_blank" rel="noopener" href="'+esc(b.url)+'">'+hi(b.url,term)+'</a></td>'
+'<td><a class="action-btn visit" target="_blank" rel="noopener" href="'+esc(b.url)+'" title="Visit"><i class="fa-solid fa-arrow-up-right-from-square"></i></a></td>'
+'<td style="white-space:nowrap"><button class="action-btn fav '+(b.fav?'active':'')+'" onclick="toggleFav(this,'+i+')" title="Favorite"><i class="fa-'+(b.fav?'solid':'regular')+' fa-star"></i></button>'
+'<button class="action-btn" onclick="copyLink('+i+')" title="Copy"><i class="fa-regular fa-copy"></i></button>'
+'<button class="action-btn" onclick="getDataForUpdate('+i+')" title="Edit"><i class="fa-solid fa-pen"></i></button>'
+'<button class="action-btn del" onclick="askDelete('+i+')" title="Delete"><i class="fa-solid fa-trash"></i></button></td></tr>'});
document.getElementById('tableBody').innerHTML=h;
document.getElementById('emptyBox').classList.toggle('d-none',list.length>0);
}
function toggleFav(btn,i){Bookmarks[i].fav=!Bookmarks[i].fav;save();render();toast(Bookmarks[i].fav?'Added to favorites':'Removed from favorites','info')}
function copyLink(i){var t=Bookmarks[i].url;if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){toast('Link copied!','success')});else{var x=document.createElement('input');x.value=t;document.body.appendChild(x);x.select();document.execCommand('copy');x.remove();toast('Link copied!','success')}}
function askDelete(i){delIndex=i;document.getElementById('delName').textContent=Bookmarks[i].name+' - '+Bookmarks[i].url;new bootstrap.Modal(document.getElementById('delModal')).show()}
document.getElementById('confirmDel').onclick=function(){if(delIndex<0)return;var row=document.querySelector('tr[data-row="'+delIndex+'"]');var doDel=function(){Bookmarks.splice(delIndex,1);save();render();bootstrap.Modal.getInstance(document.getElementById('delModal')).hide();toast('Deleted','info');if(myIndex===delIndex)cancelEdit();delIndex=-1};
if(row){row.classList.add('row-del');setTimeout(doDel,280)}else doDel()};
function getDataForUpdate(i){myIndex=i;nameEl.value=Bookmarks[i].name;urlEl.value=Bookmarks[i].url;catEl.value=Bookmarks[i].category||'General';addBtn.classList.add('d-none');updateBtn.classList.remove('d-none');cancelBtn.classList.remove('d-none');document.getElementById('formTitle').textContent='Edit: '+Bookmarks[i].name;window.scrollTo({top:0,behavior:'smooth'})}
function cancelEdit(){myIndex=-1;clear();addBtn.classList.remove('d-none');updateBtn.classList.add('d-none');cancelBtn.classList.add('d-none');document.getElementById('formTitle').textContent='Add a new site'}
function Update(){if(myIndex<0)return;var n=nameEl.value.trim();var u=normUrl(urlEl.value);var okN=n.length>=3;var okU=validUrl(urlEl.value);
nameEl.classList.toggle('is-invalid',!okN);urlEl.classList.toggle('is-invalid',!okU);if(!okN||!okU){toast('Please check the data','error');return}
Bookmarks[myIndex].name=n;Bookmarks[myIndex].url=u;Bookmarks[myIndex].category=catEl.value;save();render();cancelEdit();toast('Changes saved!','success')}
function clearAll(){if(!Bookmarks.length){toast('List is already empty','info');return}if(confirm('Delete ALL bookmarks?')){Bookmarks=[];save();render();cancelEdit();toast('All deleted','info')}}
function exportJSON(){var blob=new Blob([JSON.stringify(Bookmarks,null,2)],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='bookmarks.json';a.click();toast('Exported!','success')}
function importJSON(input){var f=input.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var arr=JSON.parse(r.result);if(!Array.isArray(arr))throw 0;var c=0;arr.forEach(function(b){if(b.name&&b.url&&validUrl(b.url)){Bookmarks.unshift({name:String(b.name),url:normUrl(b.url),category:ar2en(b.category),fav:!!b.fav,created:Date.now()});c++}});save();render();toast('Imported '+c+' sites','success')}catch(e){toast('Invalid file','error')}};r.readAsText(f);input.value=''}
var themeBtn=document.getElementById('themeBtn');
function setTheme(d){document.body.classList.toggle('dark',d);themeBtn.innerHTML=d?'<i class="fa-solid fa-sun"></i>':'<i class="fa-solid fa-moon"></i>';localStorage.setItem('bm_theme',d?'d':'l')}
setTheme(localStorage.getItem('bm_theme')==='d');
themeBtn.onclick=function(){setTheme(!document.body.classList.contains('dark'))};
nameEl.addEventListener('keydown',function(e){if(e.key==='Enter')addBookmark()});
urlEl.addEventListener('keydown',function(e){if(e.key==='Enter')addBookmark()});
render();
setTimeout(function(){document.querySelectorAll('.reveal').forEach(function(el){el.style.opacity='1'})},1000);

