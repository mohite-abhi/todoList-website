var createDiv= function(className, innerValue = null){
    var div = document.createElement('div')
    div.className = className
    if (innerValue != null)
        div.innerHTML = innerValue
    return div
}

var addTaskToList = function(taskHtml){
    document.getElementById("taskList").appendChild(taskHtml);
}

var createTaskDom = function(ttl, dsc, dte){
    var tick = createDiv("tick", "&#9634;")
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



export {createTaskDom, addTaskToList, addProjectToList}