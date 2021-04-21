//classes for checklist, todolist, user and a single object for Session 
//are created in this module

var Checklist = function (taskList = [], taskStatusList = null) {
    var list = {};
    list.tasks = JSON.parse(JSON.stringify(taskList));
    if (taskStatusList == null)
        list.taskStatus = new Array(taskList.length).fill(0);
    else
        list.taskStatus = JSON.parse(JSON.stringify(taskStatusList));
    list.addTask = function (newTask) {
        list.tasks.push(newTask);
        list.taskStatus.push(0);
    }
    list.completeTask = function (taskNo) {
        list.taskStatus[taskNo] = 1;
    }
    list.removeTask = function (taskNo) {
        list.taskStatus.splice(taskNo, 1);
        list.tasks.splice(taskNo, 1);
    }
    list.show = function () {
        for (let index = 0; index < list.tasks.length; index++) {
            console.log(list.taskStatus[index] + " " + list.tasks[index])
        }
    }
    return list;


}

var ToDoList = function (title, description, dueDate, checkList, isComplete = false, priority = 1) {
    var task = {};
    task.title = title?title:"no title";
    task.description = description?description:"no description";
    task.dueDate = dueDate?dueDate : JSON.stringify(new Date()).slice(1,11);
    task.priority = priority;
    task.checkList = checkList;
    task.isComplete = isComplete;
    return task;
}

var ToDoProject = function (projName, listOfToDoList = []) {
    var project = {}
    project.name = projName;
    project.toDoLists = listOfToDoList;
    project.addToProject = function (toDoList) { project.toDoLists.push(toDoList); }
    project.removeFromProject = function (listNo) { project.toDoLists.splice(listNo, 1); }
    return project;
}


var User = function (userName = "anonymous") {
    var user = {}
    user.name = userName;
    user.projects = [new ToDoProject("default", [ToDoList("Getting started", "have fun", JSON.stringify(new Date()).slice(1,11), Checklist(["item 1", "item 2"])), ToDoList("Again getting started", "have fun again", JSON.stringify(new Date()).slice(1,11), Checklist(["item 3", "item 4"]))]), new ToDoProject("default2", [ToDoList("Getting started2", "have fun2", JSON.stringify(new Date()).slice(1,11), Checklist(["item 12", "item 22"])), ToDoList("Again getting started2", "have fun again2", JSON.stringify(new Date()).slice(1,11), Checklist(["item 32", "item 42"]))])];
    user.createNewProject = function (projName) {
        tempProj = ToDoProject(projName);
        user.projects.push(tempProj);
    }
    user.removeProject = function (ind) { user.projects.splice(ind, 1) }
    return user;
}

var Session = (function () {
    var session = {}

    //update the user data stored in localStorage
    session.pushUpdate = function () {
        localStorage.setItem('user', JSON.stringify(this.user));
    }
    session.user = ""

    //setting up session's user by fetching user identification data stored in localStored
    session.initiatePage = function () {
        //if no data of user set up new default user
        if (localStorage.getItem('user') == null) {
            session.user = new User();
            session.pushUpdate();
        }
        //else set up user and his projects based on his stored data
        //readding methods which were not stored in localStorage
        else {
            var userData = JSON.parse(localStorage.user);
            
            var usableUserObject = new User(userData.name)
            usableUserObject.removeProject(0)
            usableUserObject.removeProject(0)
            userData.projects.forEach((i) => {
                var tempProject = new ToDoProject(i.name)
                i.toDoLists.forEach((j) => {
                    tempProject.addToProject(new ToDoList(j.title, j.description, j.dueDate, new Checklist(j.checkList.tasks, j.checkList.taskStatus), j.isComplete))
                })
                usableUserObject.projects.push(tempProject);
            })
            session.user = usableUserObject;
            session.pushUpdate();

        }
    }
    return session;

})()


export { Session, ToDoProject, Checklist, ToDoList }