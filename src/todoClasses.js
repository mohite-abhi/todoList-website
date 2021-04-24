//classes for checklist, todolist, user and a single object for Session 
//are created in this module

var Checklist = function (taskList = [], taskStatusList = null) {
    // var list = {};
    this.tasks = JSON.parse(JSON.stringify(taskList));
    if (taskStatusList == null)
        this.taskStatus = new Array(taskList.length).fill(0);
    else
        this.taskStatus = JSON.parse(JSON.stringify(taskStatusList));
    // return list;
}

Checklist.prototype.addTask = function (newTask) {
    this.tasks.push(newTask);
    this.taskStatus.push(0);
}
Checklist.prototype.completeTask = function (taskNo) {
    this.taskStatus[taskNo] = 1;
}
Checklist.prototype.removeTask = function (taskNo) {
    this.taskStatus.splice(taskNo, 1);
    this.tasks.splice(taskNo, 1);
}
Checklist.prototype.show = function () {
    for (let index = 0; index < this.tasks.length; index++) {
        console.log(this.taskStatus[index] + " " + this.tasks[index])
    }
}



var ToDoList = function (title, description, dueDate, checkList, isComplete = false, priority = 1) {
    // var task = {};
    this.title = title?title:"no title";
    this.description = description?description:"no description";
    this.dueDate = dueDate?dueDate : JSON.stringify(new Date()).slice(1,11);
    this.priority = priority;
    this.checkList = checkList;
    this.isComplete = isComplete;
    // return task;
}

var ToDoProject = function (projName, listOfToDoList = []) {
    // var project = {}
    this.name = projName;
    this.toDoLists = listOfToDoList;
    // return project;
}

ToDoProject.prototype.addToProject = function (toDoList) { this.toDoLists.push(toDoList); }
ToDoProject.prototype.removeFromProject = function (listNo) { this.toDoLists.splice(listNo, 1); }





var User = function (userName = "anonymous") {
    // var user = {}
    this.name = userName;
    this.projects = [new ToDoProject("default", [new ToDoList("Getting started", "have fun", JSON.stringify(new Date()).slice(1,11), new Checklist(["item 1", "item 2"])), new ToDoList("Again getting started", "have fun again", JSON.stringify(new Date()).slice(1,11), new Checklist(["item 3", "item 4"]))]), new ToDoProject("default2", [new ToDoList("Getting started2", "have fun2", JSON.stringify(new Date()).slice(1,11), new Checklist(["item 12", "item 22"])), new ToDoList("Again getting started2", "have fun again2", JSON.stringify(new Date()).slice(1,11), new Checklist(["item 32", "item 42"]))])];
    // return user;
}

User.prototype.createNewProject = function (projName) {
    tempProj = new ToDoProject(projName);
    this.projects.push(tempProj);
}
User.prototype.removeProject = function (ind) { 
    this.projects.splice(ind, 1) 
}



var Session = (function () {
    var session = {}

    //update the user data stored in localStorage
    session.pushUpdate = function () {
        localStorage.setItem('user', JSON.stringify(this.user));
    }
    session.user = ""

    //setting up session's user by fetching user identification data stored in localStored
    session.setUpUser = function () {
        //if no data of user set up new default user
        if (localStorage.getItem('user') == null) {
            session.user = new User();
            // session.pushUpdate();
        }
        //else set up user and his projects based on his stored data
        //readding methods which were not stored in localStorage
        else {
            var userData = JSON.parse(localStorage.user);
            
            // var usableUserObject = new User(userData.name)
            // usableUserObject.removeProject(0)
            // usableUserObject.removeProject(0)
            // userData.projects.forEach((i) => {
            //     var tempProject = new ToDoProject(i.name)
            //     i.toDoLists.forEach((j) => {
            //         tempProject.addToProject(new ToDoList(j.title, j.description, j.dueDate, new Checklist(j.checkList.tasks, j.checkList.taskStatus), j.isComplete))
            //     })
            //     usableUserObject.projects.push(tempProject);
            // })
            // session.user = usableUserObject;

            // console.log("hello")
            Object.setPrototypeOf(userData, Object.create(User.prototype))
            userData.projects.forEach((e)=>{
                e.toDoLists.forEach((f)=>{
                    Object.setPrototypeOf(f,Object.create(ToDoList.prototype))
                    Object.setPrototypeOf(f.checkList, Object.create(Checklist.prototype))
                })
                Object.setPrototypeOf(e, Object.create(ToDoProject.prototype))
            })
            session.user = userData;
        }
        session.pushUpdate();
    }
    return session;

})()


export { Session, ToDoProject, Checklist, ToDoList }