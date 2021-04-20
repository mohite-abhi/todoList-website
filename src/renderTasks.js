import { Session } from "./todoManipulation"
import { createTaskDom, addTaskToList, createProjectDom, createExpandedTaskDom } from './todoDom'

var completeFunction = function () {
    var elem = document.getElementById(this.parentNode.id).childNodes[0]
    var coor = JSON.parse(this.parentNode.id)
    if (Session.user.projects[coor[0]].toDoLists[coor[1]].isComplete == false) {
        elem.innerHTML = "&#10003;"
        Session.user.projects[coor[0]].toDoLists[coor[1]].isComplete = true
    }
    else {
        elem.innerHTML = "&#9634;"
        Session.user.projects[coor[0]].toDoLists[coor[1]].isComplete = false
    }
    Session.pushUpdate()
}



var checkListCompleteFun = function () {
    var elem = document.getElementById(this.id).childNodes[0]
    var coor = JSON.parse(this.id)
    if (Session.user.projects[coor[0]].toDoLists[coor[1]].checkList.taskStatus[coor[2]] == false) {
        elem.innerHTML = "&#10003;"
        Session.user.projects[coor[0]].toDoLists[coor[1]].checkList.taskStatus[coor[2]] = true
    }
    else {
        elem.innerHTML = "&#9634;"
        Session.user.projects[coor[0]].toDoLists[coor[1]].checkList.taskStatus[coor[2]] = false
    }
    Session.pushUpdate()
}


var renderTasks = function (i) {

    var project = Session.user.projects[i]
    var j = 0;
    var expandFunction = function () {
        expandTask(JSON.parse(this.parentNode.id))
    }

    var deleteFunction = function () {
        var coor = JSON.parse(this.parentNode.id)
        Session.user.projects[coor[0]].toDoLists.splice([coor[1]], 1)
        Session.pushUpdate()
        document.getElementById(this.parentNode.id).remove()
    }


    if (project != undefined)
        project.toDoLists.forEach(tasks => {
            // console.log(tasks)
            var task = createTaskDom(tasks.isComplete, tasks.title, tasks.description, tasks.dueDate.slice(0, 10))
            task.childNodes[0].onclick = completeFunction;
            task.childNodes[1].onclick = expandFunction;
            task.childNodes[2].onclick = expandFunction;
            task.childNodes[3].onclick = expandFunction;
            task.childNodes[4].onclick = deleteFunction;
            // task.childNodes[5].onclick = deleteFunction;
            task.id = JSON.stringify([i, j++]);
            addTaskToList(task);
        });
}


var expandTask = function (coor) {
    // console.log(coor)
    var taskArea = document.getElementById("taskList")
    taskArea.innerHTML = '';
    renderTasks(coor[0])

    var old = document.getElementById(JSON.stringify(coor))

    var expandedTaskHtml = createExpandedTaskDom(Session.user.projects[coor[0]].toDoLists[coor[1]])
    expandedTaskHtml.id = old.id
    expandedTaskHtml.childNodes[0].onclick = completeFunction;

    //working on checklist
    var k = 0
    expandedTaskHtml.childNodes[4].childNodes.forEach((elem)=>{
        elem.id = JSON.stringify([coor[0], coor[1], k++])
        elem.onclick = checkListCompleteFun;

    })

    old.parentNode.replaceChild(expandedTaskHtml, old)
}



var renderProjects = function () {
    var projects = Session.user.projects;
    var i =0
    
    
    var openProject = (ele) =>{
        var projNo = JSON.parse(ele.srcElement.parentNode.id);
        // console.log(projNo)
        var taskArea = document.getElementById("taskList")
        taskArea.innerHTML = '';
        renderTasks(projNo)
        // console.log(event.srcElement.parentNode.id)
        // console.log(Session.user.projects[this.id]);
    }

    projects.forEach(element => {
        var projectHtml = createProjectDom(element.name);
        projectHtml.id = JSON.stringify([i++])
        document.getElementById("list").appendChild(projectHtml);
        projectHtml.onclick = openProject
        // projectHtml.addEventListener("click", openProject(this));
        // projectHtml.childNodes[0].onclick = openProject
        // console.log(projectHtml.childNodes[0].parentNode)
        // proj.childNodes[0].onclick = ()=>{console.log(this.parentNode.id)}
        // proj.childNodes[0].onclick = ()=>{console.log("hel")}
        // proj.childNodes[0].onclick = () =>{console.log("hello")}
        // console.log(proj.childNodes[0].)
        // addProjectToList(element.name);
    });
}


var renderPage = function () {
    Session.initiatePage()
    renderTasks(0);
    renderProjects();
}

export { renderPage }

// renderTasks()

// head = document.createElement("h2")
// head.innerHTML = "hello"
// document.querySelector("div").appendChild(head)