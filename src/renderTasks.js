import { Session } from "./todoManipulation"
import { createTaskDom, addTaskToList, addProjectToList, createExpandedTaskDom } from './todoDom'

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
            // console.log("why here")
        }
        Session.pushUpdate()

        // console.log(this.parentNode.id)
        // elem.onclick = completeFunction
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
            addTaskToList(task);
            task.id = JSON.stringify([i, j++]);
        });
}


var expandTask = function (coor) {
    // console.log(coor)
    var taskArea = document.getElementById("taskList")
    taskArea.innerHTML = '';
    renderTasks(coor[0])
    var old = document.getElementById(JSON.stringify(coor))
    var expandedTaskHtml = createExpandedTaskDom(Session.user.projects[coor[0]].toDoLists[coor[1]])
    old.parentNode.replaceChild(expandedTaskHtml, old)
    // console.log(old)
    // console.log(i);
    // console.log(Session.user.projects[coor[0]].toDoLists[coor[1]]);
}


var renderProjects = function () {
    var projects = Session.user.projects;
    projects.forEach(element => {
        addProjectToList(element.name);
    });
}


var renderPage = function () {
    // Session.initiatePage()
    renderTasks(0);
    renderProjects();
}

export { renderPage }

// renderTasks()

// head = document.createElement("h2")
// head.innerHTML = "hello"
// document.querySelector("div").appendChild(head)