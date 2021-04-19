import { Session } from "./todoManipulation"
import { createTaskDom, addTaskToList, addProjectToList } from './todoDom'

var renderTasks = function () {
    var projects = Session.user.projects
    projects.forEach(element => {
        element.toDoLists.forEach(task => {
            var task = createTaskDom(task.title, task.description, task.dueDate.slice(0, 10))
            addTaskToList(task);
        })
    });
}


var renderProjects = function () {
    var projects = Session.user.projects;
    projects.forEach(element => {
        addProjectToList(element.name);
    });
}


var renderPage = function () {
    renderTasks();
    renderProjects();
}

export { renderPage }

// renderTasks()

// head = document.createElement("h2")
// head.innerHTML = "hello"
// document.querySelector("div").appendChild(head)