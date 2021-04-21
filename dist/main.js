(()=>{"use strict";var e,t=function(e=[],t=null){var n={};return n.tasks=JSON.parse(JSON.stringify(e)),n.taskStatus=null==t?new Array(e.length).fill(0):JSON.parse(JSON.stringify(t)),n.addTask=function(e){n.tasks.push(e),n.taskStatus.push(0)},n.completeTask=function(e){n.taskStatus[e]=1},n.removeTask=function(e){n.taskStatus.splice(e,1),n.tasks.splice(e,1)},n.show=function(){for(let e=0;e<n.tasks.length;e++)console.log(n.taskStatus[e]+" "+n.tasks[e])},n},n=function(e,t,n,s,i=!1,a=1){var r={};return r.title=e||"no title",r.description=t||"no description",r.dueDate=n||JSON.stringify(new Date).slice(1,11),r.priority=a,r.checkList=s,r.isComplete=i,r},s=function(e,t=[]){var n={};return n.name=e,n.toDoLists=t,n.addToProject=function(e){n.toDoLists.push(e)},n.removeFromProject=function(e){n.toDoLists.splice(e,1)},n},i=function(e="anonymous"){var i={};return i.name=e,i.projects=[new s("default",[n("Getting started","have fun",JSON.stringify(new Date).slice(1,11),t(["item 1","item 2"])),n("Again getting started","have fun again",JSON.stringify(new Date).slice(1,11),t(["item 3","item 4"]))]),new s("default2",[n("Getting started2","have fun2",JSON.stringify(new Date).slice(1,11),t(["item 12","item 22"])),n("Again getting started2","have fun again2",JSON.stringify(new Date).slice(1,11),t(["item 32","item 42"]))])],i.createNewProject=function(e){tempProj=s(e),i.projects.push(tempProj)},i.removeProject=function(e){i.projects.splice(e,1)},i},a=e={pushUpdate:function(){localStorage.setItem("user",JSON.stringify(this.user))},user:"",initiatePage:function(){if(null==localStorage.getItem("user"))e.user=new i,e.pushUpdate();else{var a=JSON.parse(localStorage.user),r=new i(a.name);r.removeProject(0),r.removeProject(0),a.projects.forEach((e=>{var i=new s(e.name);e.toDoLists.forEach((e=>{i.addToProject(new n(e.title,e.description,e.dueDate,new t(e.checkList.tasks,e.checkList.taskStatus),e.isComplete))})),r.projects.push(i)})),e.user=r,e.pushUpdate()}}},r=function(e,t=null){var n=document.createElement("div");return n.className=e,null!=t&&(n.innerHTML=t),n},d=function(e,t,n=""){var s=document.createElement("input");return s.className=e,s.autofocus="true",s.maxLength=t,s.placeholder=n,s},o=function(e,t=null){var n=r("checklistinputitem"),s=r("tick2"),i=d("detail2",100,"add task");return null!=t&&(i.value=t),n.appendChild(s),n.appendChild(i),e.appendChild(n),e},l=function(){var e,t=r("detailedTaskItem"),n=r("plus","+>"),s=d("titleInput",20,"Title"),i=function(e,t,n=""){var s=document.createElement("textarea");return s.className=e,s.autofocus=!0,s.maxLength=t,s.placeholder=n,s}("descriptionInput",200,"short description"),a=("duedateInput",(e=document.createElement("input")).className="duedateInput",e.type="date",e.min=JSON.stringify(new Date).slice(1,11),e),l=r("checklistInput");l=o(l);var c=r("saveTask","&#8629;");return t.appendChild(n),t.appendChild(s),t.appendChild(i),t.appendChild(a),t.appendChild(l),t.appendChild(c),n.onclick=e=>{o(e.srcElement.parentNode.childNodes[4])},t},c=function(e){var s={};return s.projectNo=e,s.markTaskAsDone=function(){var e=document.getElementById(this.parentNode.id).childNodes[0],t=JSON.parse(this.parentNode.id);0==a.user.projects[t[0]].toDoLists[t[1]].isComplete?(e.innerHTML="&#10003;",a.user.projects[t[0]].toDoLists[t[1]].isComplete=!0):(e.innerHTML="&#9634;",a.user.projects[t[0]].toDoLists[t[1]].isComplete=!1),a.pushUpdate()},s.markChecklistItem=function(){var e=document.getElementById(this.id).childNodes[0],t=JSON.parse(this.id);0==a.user.projects[t[0]].toDoLists[t[1]].checkList.taskStatus[t[2]]?(e.innerHTML="&#10003;",a.user.projects[t[0]].toDoLists[t[1]].checkList.taskStatus[t[2]]=!0):(e.innerHTML="&#9634;",a.user.projects[t[0]].toDoLists[t[1]].checkList.taskStatus[t[2]]=!1),a.pushUpdate()},s.expandTask=function(e){s.renderTasks(e[0]);var i,d,c,u,p,m,h,k,f,N=document.getElementById(JSON.stringify(e)),v=(i=a.user.projects[e[0]].toDoLists[e[1]],d=1==i.isComplete?"&#10003;":"&#9634;",c=r("tick",d),u=r("title",i.title),p=r("description",i.description),m=r("duedate",i.dueDate.slice(0,10)),h=function(e){var t=r("checklist");for(let a=0;a<e.tasks.length;a++){var n=r("tick");n.innerHTML=0==e.taskStatus[a]?"&#9634;":"&#10003;";var s=r("detail");s.innerHTML=e.tasks[a];var i=r("checklistitem");i.appendChild(n),i.appendChild(s),t.appendChild(i)}return t}(i.checkList),k=r("detailedTaskItem"),f=r("editButton","edit"),k.appendChild(c),k.appendChild(u),k.appendChild(p),k.appendChild(m),k.appendChild(h),k.appendChild(f),k);v.id=N.id,v.childNodes[0].onclick=s.markTaskAsDone,v.lastElementChild.onclick=i=>{var r=JSON.parse(i.srcElement.parentNode.id),d=l(),c=a.user.projects[r[0]].toDoLists[r[1]];d.childNodes[1].value=c.title,d.childNodes[2].value=c.description,d.childNodes[3].value=c.dueDate,d.childNodes[4].firstChild.remove();for(let e=0;e<c.checkList.tasks.length;e++){const t=c.checkList.tasks[e];o(d.childNodes[4],t)}var u=document.getElementById("taskList");d.childNodes[5].onclick=i=>{!function(i){var r=[];i[4].childNodes.forEach((e=>{var t=e.childNodes[1].value;""!=t&&r.push(t)}));var d=n(i[1].value,i[2].value,i[3].value,t(r));a.user.projects[e[0]].toDoLists.splice(e[1],1),a.user.projects[e[0]].toDoLists.push(d),document.getElementById("taskList").innerHTML="",s.renderTasks(e[0]),a.pushUpdate()}(i.srcElement.parentNode.childNodes)},u.replaceChild(d,document.getElementById(JSON.stringify(e)))};var g=0;v.childNodes[4].childNodes.forEach((t=>{t.id=JSON.stringify([e[0],e[1],g++]),t.onclick=s.markChecklistItem})),N.parentNode.replaceChild(v,N)},s.reindexTaskElemId=function(){for(var e=document.getElementById("taskList").firstElementChild,t=0;null!=e;)"plus"!=e.firstChild.firstChild.className&&(e.id=JSON.stringify([s.projectNo,t++])),e=e.nextElementSibling},s.deleteThisTask=function(e){var t=JSON.parse(this.parentNode.id);document.getElementById(this.parentNode.id).remove(),a.user.projects[t[0]].toDoLists.splice(t[1],1),s.reindexTaskElemId(),a.pushUpdate()},s.renderTaskElement=function(e){document.getElementById("taskList").appendChild(e)},s.renderTasks=function(e=s.projectNo){document.getElementById("taskList").innerHTML="";var t=a.user.projects[e],n=0;if(null!=t){var i=function(){s.expandTask(JSON.parse(this.parentNode.id))};t.toDoLists.forEach((t=>{var a,d,o,l,c,u,p,m,h,k,f=(a=t.isComplete,d=t.title,o=t.description,l=t.dueDate.slice(0,10),c=r("tick",1==a?"&#10003;":"&#9634;"),u=r("title",d),p=r("description",o),m=r("duedate",l),h=r("delete","x"),(k=r("taskItem")).appendChild(c),k.appendChild(u),k.appendChild(p),k.appendChild(m),k.appendChild(h),k);f.childNodes[0].onclick=s.markTaskAsDone;for(let e=1;e<4;e++)f.childNodes[e].onclick=i;f.childNodes[4].onclick=s.deleteThisTask,f.id=JSON.stringify([e,n++]),s.renderTaskElement(f)}))}},s},u=function(e){var i=c(e),o=a.user.projects,p=0,h=e=>{var t=document.getElementsByClassName("name");for(let n=0;n<t.length;n++)t[n].style.borderColor=n==e?"rgb(255, 216, 100)":"rgb(255, 216, 100,0)"},k=e=>{var t=JSON.parse(e.srcElement.parentNode.id);h(t[0]),document.getElementById("list").innerHTML="",u(t[0])},f=function(){var e=JSON.parse(this.parentNode.id);a.user.projects.splice([e[0]],1),a.pushUpdate(),document.getElementById("taskList").innerHTML="",document.getElementById("list").innerHTML="",m()};document.getElementById("projButton").onclick=()=>{var e,t,n,i=document.getElementById("list"),o=(e=d("projInput",20),t=r("projSave","&#8629;"),(n=r("projectItem")).appendChild(e),n.appendChild(t),n);if(o.childNodes[1].onclick=function(e){var t=s(e.srcElement.parentNode.childNodes[0].value);a.user.projects.push(t),document.getElementById("list").innerHTML="",document.getElementById("taskList").innerHTML="",u(0),a.pushUpdate()},0==i.childElementCount)i.appendChild(o);else{var l=document.getElementsByClassName("projectItem");"projInput"!=l[0].childNodes[0].className&&i.insertBefore(o,l[0])}document.getElementsByClassName("projInput")[0].focus()},document.getElementById("button").onclick=()=>{var s=document.getElementById("taskList"),r=l();if(r.childNodes[5].onclick=s=>{!function(s){var r=[];s[4].childNodes.forEach((e=>{var t=e.childNodes[1].value;""!=t&&r.push(t)}));var d=n(s[1].value,s[2].value,s[3].value,t(r));a.user.projects[e].toDoLists.push(d),i.renderTasks(),a.pushUpdate()}(s.srcElement.parentNode.childNodes)},0==s.childElementCount)s.appendChild(r);else{var d=JSON.parse(s.lastElementChild.id);i.renderTasks(d[0]);var o=s.firstElementChild;"tick"==o.childNodes[0].className&&s.insertBefore(r,o)}document.getElementsByClassName("titleInput")[0].focus()},o.forEach((e=>{var t=function(e){var t=r("name",e),n=r("del",e);n.innerHTML="x",t.innerHTML=e;var s=r("projectItem");return s.appendChild(t),s.appendChild(n),s}(e.name);t.id=JSON.stringify([p++]),document.getElementById("list").appendChild(t),t.childNodes[0].onclick=k,t.childNodes[1].onclick=f})),h(e),i.renderTasks()},p=function(){var e=document.getElementById("username"),t=function(){var e=d("uname",20,"enter name"),t=r("ok","&#8629;"),n=r("username");return n.appendChild(e),n.appendChild(t),n}();t.id="username",t.childNodes[1].onclick=()=>{var e=t.childNodes[0].value;a.user.name=e||"anonymous",a.pushUpdate(),location.reload()},e.parentElement.replaceChild(t,e)},m=function(){a.initiatePage();var e=document.getElementById("username");e.innerHTML=a.user.name,e.onclick=p,u(0)};m()})();