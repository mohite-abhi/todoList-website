var createDiv= function(className, innerValue = null){
    var div = document.createElement('div')
    div.className = className
    if (innerValue != null)
        div.innerHTML = innerValue
    return div
}

var addTaskToList = function(taskHtml){
    var taskArea =  document.getElementById("taskList")
    taskArea.appendChild(taskHtml);
}

var createTaskDom = function(iscmplt, ttl, dsc, dte){
    // console.log(iscmplt)
    var symbol = ((iscmplt == true) ? "&#10003;" : "&#9634;")
    var tick = createDiv("tick", symbol)
    // var tick = createDiv("tick", "&#9634;")
    var title = createDiv("title", ttl)
    var description = createDiv("description", dsc)
    var dueDate = createDiv("duedate", dte)
    var delete1 = createDiv("delete", "X")
    var taskItem = createDiv("taskItem")
    taskItem.appendChild(tick)
    taskItem.appendChild(title)
    taskItem.appendChild(description)
    taskItem.appendChild(dueDate)
    taskItem.appendChild(delete1)
    return taskItem
}


var addProjectToList = function(nme){
    var name = createDiv("projectItem", nme);
    document.getElementById("list").appendChild(name);
}


var createExpandedTaskDom = function(todo){
    var symbol = ((todo.isComplete == true) ? "&#10003;" : "&#9634;")
    var tick = createDiv("tick", symbol)
    var title = createDiv("title", todo.title)
    var description = createDiv("description", todo.description)
    var dueDate = createDiv("duedate", todo.dueDate.slice(0,10))
    var delete1 = createDiv("checklist", "something")

    var taskItem = createDiv("detailedTaskItem")
    taskItem.appendChild(tick)
    taskItem.appendChild(title)
    taskItem.appendChild(description)
    taskItem.appendChild(dueDate)
    taskItem.appendChild(delete1)
    return taskItem
}




export {createTaskDom, addTaskToList, addProjectToList, createExpandedTaskDom}