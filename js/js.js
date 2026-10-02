
let name = document.getElementById('name')
let url =document.getElementById('url')
let addBtn =document.getElementById('addBtn')
let searchName =document.getElementById('searchName')
let  updateBtn=document.getElementById('updateBtn')
var myIndex
let Bookmarks
if(localStorage.getItem('containerStorage')===null){
 Bookmarks=[]
}else{
Bookmarks=JSON.parse(localStorage.getItem('containerStorage'))
display()
}
function addBookmark(){
    let Bookmark={
    name:name.value,
    url : url.value,
    addBtn:addBtn.value
}
Bookmarks.push(Bookmark)
localStorage.setItem('containerStorage' , JSON.stringify(Bookmarks))
clear()
display()
}
function clear(){
    name.value=null
    url.value=null
    addBtn.value=null
}

function display(){
var cartona=''
for(var i=0 ; i<Bookmarks.length ; i++){
cartona+=`

<tr>
    <td>${Bookmarks[i].name}</td>
    <td>${Bookmarks[i].url}</td>
     <td><button class="btn btn-warning p-2" onclick="getDataForUpdate(${i})">update</button></td>
      <td><button class="btn btn-danger p-2 " onclick="Delete(${i})">Delete</button></td>
  </tr>

`
}
document.getElementById('tableBody').innerHTML=cartona
}

function Delete(index){
Bookmarks.splice(index,1)
localStorage.setItem('containerStorage' , JSON.stringify(Bookmarks))
display()
}

function Search(){
    var cartona=''
    var term=searchName.value
for(var i=0 ; i<Bookmarks.length ; i++){
    if(Bookmarks[i].name.toLowerCase().includes(term.toLowerCase())){ 
cartona+=`

<tr>
    <td>${Bookmarks[i].name.replace(term , `<span class='bg-info'>${term}</span>`)}</td>
    <td>${Bookmarks[i].url}</td>
     <td><button class="btn btn-warning p-2" onclick="Update(${i})">update</button></td>
      <td><button class="btn btn-danger p-2 " onclick="Delete(${i})">Delete</button></td>
  </tr>

`
}
}
document.getElementById('tableBody').innerHTML=cartona
}
let currentIndex = null

function getDataForUpdate(index){

   myIndex=index
    name.value = Bookmarks[index].name
    url.value = Bookmarks[index].url
    addBtn.classList.add('d-none')
    updateBtn.classList.replace('d-none','d-block')
   

  
}



function Update(){
    Bookmarks[myIndex].name=name.value
    Bookmarks[myIndex].url=url.value
    display()
    localStorage.setItem('containerStorage' , JSON.stringify(Bookmarks))
    updateBtn.classList.add('d-none')
    addBtn.classList.replace('d-none','d-block')
}