var createDiv= function(className, innerValue = null){
    var div = document.createElement('div')
    div.className = className
    if (innerValue != null)
        div.innerHTML = innerValue
    return div
}

var createInput = function(className, maxLen, place = "") {
    var inp = document.createElement('input')
    inp.className = className
    inp.autofocus = true
    inp.maxLength = maxLen
    inp.placeholder = place
    return inp
}

var createTextArea = function(className, maxLen, place = "") {
    var inp = document.createElement('textarea')
    inp.className = className
    inp.autofocus = true
    inp.maxLength = maxLen
    inp.placeholder = place
    return inp
}

var createDateInput = function(className) {
    var inp = document.createElement('input')
    inp.className = className
    inp.type = "date"
    inp.min = JSON.stringify(new Date()).slice(1,11)
    return inp
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


var createProjectDom = function(nme){
    var name = createDiv("name", nme);
    var del = createDiv("del", nme);
    del.innerHTML = "x"
    name.innerHTML = nme
    var projRow = createDiv("projectItem")
    // name.onclick = ()=>{console.log(this)}
    // document.getElementById("list").appendChild(name);
    projRow.appendChild(name)
    projRow.appendChild(del)
    // console.log(projRow)
    return projRow;
}


var createChecklistDom = function(checklist){
    var checklistDom = createDiv("checklist")
    for (let index = 0; index < checklist.tasks.length; index++) {
        // console.log(checklist)
        var tick = createDiv("tick")
        tick.innerHTML = ((checklist.taskStatus[index] == 0) ? "&#9634;" : "&#10003;")
        var detail = createDiv("detail")
        detail.innerHTML = checklist.tasks[index];;
        var item = createDiv("checklistitem")
        // tick.onclick = () =>{console.log(this)}
        item.appendChild(tick)
        item.appendChild(detail)
        checklistDom.appendChild(item)
        // const element = checklist.tasks[index];
    }
    // console.log(checklistDom)
    return checklistDom;
    // checklist.tasks.forEach(element => {
    //     var tick = createDiv("tick")
    //     var detail = createDiv("detail")
    //     detail.innerHTML = element;
    //     var item = createDiv("checklistitem")
    //     console.log(element)
    // });
}



var createExpandedTaskDom = function(todo){
    var symbol = ((todo.isComplete == true) ? "&#10003;" : "&#9634;")
    var tick = createDiv("tick", symbol)
    var title = createDiv("title", todo.title)
    var description = createDiv("description", todo.description)
    var dueDate = createDiv("duedate", todo.dueDate.slice(0,10))
    var delete1 = createChecklistDom(todo.checkList)
    var taskItem = createDiv("detailedTaskItem")
    taskItem.appendChild(tick)
    taskItem.appendChild(title)
    taskItem.appendChild(description)
    taskItem.appendChild(dueDate)
    taskItem.appendChild(delete1)
    return taskItem
}


var createProjInputDom = function() {
    var inp = createInput("projInput", 20)
    var save = createDiv("projSave", "&#8629;")
    var item = createDiv("projectItem")
    item.appendChild(inp)
    item.appendChild(save)
    return item
}



var createTaskInputDom = function() {

    var detailedTaskInput = createDiv("detailedTaskItem")
    
    var plus =  createDiv("plus", "+>")
    // plus.onclick = ()=>{}
    var titleInput = createInput("titleInput", 80, "Title")
    var descriptionInput = createTextArea("descriptionInput", 200, "short description" )
    var duedateInput = createDateInput("duedateInput")
    var checklistInput = createDiv("checklistInput")
    var addItemToChecklist = function(checklistInput){
        var checklistinputitem = createDiv("checklistinputitem")
        var newTick = createDiv("tick2")
        var itemDetail = createInput("detail2", 100, "add task")
        checklistinputitem.appendChild(newTick)
        checklistinputitem.appendChild(itemDetail)
        checklistInput.appendChild(checklistinputitem)
        return checklistInput
    }
    checklistInput = addItemToChecklist(checklistInput)

    var saveTask = createDiv("saveTask", "&#8629;")

    detailedTaskInput.appendChild(plus)
    detailedTaskInput.appendChild(titleInput)
    detailedTaskInput.appendChild(descriptionInput)
    detailedTaskInput.appendChild(duedateInput)
    detailedTaskInput.appendChild(checklistInput)
    detailedTaskInput.appendChild(saveTask)
    
    plus.onclick = (elem)=>{
        // addItemToChecklist(elem.srcElement.parentNode.childNodes)
        addItemToChecklist(elem.srcElement.parentNode.childNodes[4])
    }

    return detailedTaskInput

    // var titleInput = createInput("titleInput", 80, "Title")
}


var createUserInput = function(){
    var inp = createInput("name", 20, "enter name")
    var ok = createDiv("ok", "&#10009;")
    var usnm = createDiv("username")
    usnm.appendChild(inp)
    usnm.appendChild(ok)
    return usnm
}



export {createTaskDom, addTaskToList, createProjectDom, createExpandedTaskDom, createProjInputDom, createTaskInputDom, createUserInput}