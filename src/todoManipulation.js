var Checklist = function (taskList = []) {
    var list = {};
    list.tasks = JSON.parse(JSON.stringify(taskList));
    list.taskStatus = new Array(taskList.length).fill(0);
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

var ToDoList = function (title, description, dueDate, priority, checkList, isComplete=false) {
    var task = {};
    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
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
    user.projects = [new ToDoProject("default", [ToDoList("Getting started", "have fun", new Date(), 1, Checklist(["item 1", "item 2"])), ToDoList("Again getting started", "have fun again", new Date(), 1, Checklist(["item 3", "item 4"]))])];
    user.createNewProject = function (projName) {
        tempProj = ToDoProject(projName);
        user.projects.push(tempProj);
    }
    user.removeProject = function (ind) { user.projects.splice(ind, 1) }
    return user;
}

var Session = (function () {
    var session = {}
    session.pushUpdate = function(){
        localStorage.setItem('user', JSON.stringify(this.user));
    }
    session.user = ""
    if (localStorage.getItem('user') == null) 
    {
        session.user = new User();
        session.pushUpdate();
    }
    else{
        // console.log(localStorage.user)
        var userData = JSON.parse(localStorage.user);
        var userObject = new User(userData.name)
        userObject.removeProject(0)
        userData.projects.forEach((i) => {
            var tempProject = new ToDoProject(i.name)
            i.toDoLists.forEach((j) => {
                tempProject.addToProject(new ToDoList(j.title, j.description, j.dueDate, j.priority, new Checklist(j.checkList.tasks),j.isComplete)) 
            })
            userObject.projects.push(tempProject);
        })
        session.user = userObject;
        session.pushUpdate();

    }
    return session;

})()


export {Session}