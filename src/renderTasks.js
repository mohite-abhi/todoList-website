import { Session, ToDoProject, ToDoList, Checklist} from "./todoManipulation"
import { createTaskDom, addTaskToList, createProjectDom, createExpandedTaskDom, createProjInputDom, createTaskInputDom, createUserInput, addItemToChecklist } from './todoDom'

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

    var doReindexing = function(){
        var taskArea = document.getElementById("taskList")
        var sibling = taskArea.firstElementChild
        var indexing = 0
        while(sibling != null){
            if (sibling.firstChild.firstChild.className != "plus"){
                sibling.id = JSON.stringify([i, indexing++])
            }
            sibling = sibling.nextElementSibling
        }
    }

    var deleteFunction = function (elem) {
        var coor = JSON.parse(this.parentNode.id)
        document.getElementById(this.parentNode.id).remove()
        Session.user.projects[coor[0]].toDoLists.splice(coor[1], 1)

        doReindexing()

        Session.pushUpdate()



    }


    if (project != undefined)
        project.toDoLists.forEach(tasks => {
            var task = createTaskDom(tasks.isComplete, tasks.title, tasks.description, tasks.dueDate.slice(0, 10))
            task.childNodes[0].onclick = completeFunction;
            task.childNodes[1].onclick = expandFunction;
            task.childNodes[2].onclick = expandFunction;
            task.childNodes[3].onclick = expandFunction;
            task.childNodes[4].onclick = deleteFunction;
            task.id = JSON.stringify([i, j++]);
            addTaskToList(task);
        });
}


var expandTask = function (coor) {
    var taskArea = document.getElementById("taskList")
    taskArea.innerHTML = '';
    renderTasks(coor[0])

    var old = document.getElementById(JSON.stringify(coor))

    var manageEdit = (elem) =>{


        var saveTaskAgain = function(form){
            var checkListItems = []
            form[4].childNodes.forEach((checkListItem)=>{
                var fetchedValue = checkListItem.childNodes[1].value
                if (fetchedValue != "")
                    checkListItems.push(fetchedValue)
            })
            var newCreatedTask = ToDoList(form[1].value, form[2].value, form[3].value, Checklist(checkListItems))


       
            Session.user.projects[coor[0]].toDoLists.splice(coor[1],1)
            Session.user.projects[coor[0]].toDoLists.push(newCreatedTask)

            document.getElementById("taskList").innerHTML = ''
            renderTasks(coor[0])
            Session.pushUpdate()
        }


        var prevTaskCoor = JSON.parse(elem.srcElement.parentNode.id)
        var taskInput = createTaskInputDom()
        var prevTask = Session.user.projects[prevTaskCoor[0]].toDoLists[prevTaskCoor[1]]
        taskInput.childNodes[1].value = prevTask.title
        taskInput.childNodes[2].value = prevTask.description
        taskInput.childNodes[3].value = prevTask.dueDate
        taskInput.childNodes[4].firstChild.remove()

        for (let index = 0; index < prevTask.checkList.tasks.length; index++) {
            const checklistName = prevTask.checkList.tasks[index];
            addItemToChecklist(taskInput.childNodes[4], checklistName)
            
        }

        var taskArea =  document.getElementById("taskList")
        
        taskInput.childNodes[5].onclick = (elem)=>{
            var form = elem.srcElement.parentNode.childNodes;
            saveTaskAgain(form);
        }

        
            var metaList = prevTaskCoor
            taskArea.replaceChild(taskInput, document.getElementById(JSON.stringify(coor)))
        

    }

    var expandedTaskHtml = createExpandedTaskDom(Session.user.projects[coor[0]].toDoLists[coor[1]])
    expandedTaskHtml.id = old.id
    expandedTaskHtml.childNodes[0].onclick = completeFunction;
    expandedTaskHtml.lastElementChild.onclick = manageEdit

    var k = 0
    expandedTaskHtml.childNodes[4].childNodes.forEach((elem)=>{
        elem.id = JSON.stringify([coor[0], coor[1], k++])
        elem.onclick = checkListCompleteFun;

    })

    old.parentNode.replaceChild(expandedTaskHtml, old)
}



var renderProjects = function (number) {
    var projects = Session.user.projects;
    var i =0
    
    var highlight = (n) => {
        var projElems = document.getElementsByClassName("name")
        for (let index = 0; index < projElems.length; index++) {
            const element = projElems[index];
            element.style.borderColor = (index == n)?"rgb(255, 216, 100)": "rgb(255, 216, 100,0)"
            
        }
    }
    
    var openProject = (ele) =>{
        var projNo = JSON.parse(ele.srcElement.parentNode.id);
        highlight(projNo[0])
        var taskArea = document.getElementById("taskList")
        taskArea.innerHTML = '';
        document.getElementById("list").innerHTML = ''
        renderProjects(projNo[0])
    }

    var deleteProject = function () {
        var coor = JSON.parse(this.parentNode.id)
        Session.user.projects.splice([coor[0]], 1)
        Session.pushUpdate()
        document.getElementById("taskList").innerHTML = ''
        document.getElementById("list").innerHTML = ''
        renderPage()

    }
    


    //add project button
    document.getElementById("projButton").onclick = ()=>{
        var saveProject = function(ele){
            var newProj = ToDoProject(ele.srcElement.parentNode.childNodes[0].value)
            Session.user.projects.push(newProj)
            document.getElementById("list").innerHTML = ''
            document.getElementById("taskList").innerHTML = ''
            renderProjects(0)
            Session.pushUpdate()
        }


        var listCover =  document.getElementById("list")
        var projInp = createProjInputDom();
        projInp.childNodes[1].onclick = saveProject
        
        if (listCover.childElementCount == 0){
            listCover.appendChild(projInp)
        }
        else{
            var projList = document.getElementsByClassName("projectItem")
            if (projList[0].childNodes[0].className != "projInput"){
                listCover.insertBefore(projInp, projList[0])
            }
            
        }
        document.getElementsByClassName("projInput")[0].focus()

    }


    //add task button
    document.getElementById("button").onclick = ()=>{

        var saveTask = function(form){
            var checkListItems = []
            form[4].childNodes.forEach((checkListItem)=>{
                var fetchedValue = checkListItem.childNodes[1].value
                if (fetchedValue != "")
                    checkListItems.push(fetchedValue)
            })


            var newCreatedTask = ToDoList(form[1].value, form[2].value, form[3].value, Checklist(checkListItems))


            Session.user.projects[number].toDoLists.push(newCreatedTask)

            document.getElementById("taskList").innerHTML = ''
            renderTasks(number)
            Session.pushUpdate()
        }
        
        var taskArea = document.getElementById("taskList")
        var taskInput = createTaskInputDom()
        
        taskInput.childNodes[5].onclick = (elem)=>{
            var form = elem.srcElement.parentNode.childNodes;
            saveTask(form);
        }

        if (taskArea.childElementCount == 0){
            taskArea.appendChild(taskInput)
        }
        else{
            var metaList = JSON.parse(taskArea.lastElementChild.id)
            taskArea.innerHTML = '';
            renderTasks(metaList[0])
            var firstBlock = taskArea.firstElementChild
            if (firstBlock.childNodes[0].className == "tick"){
                taskArea.insertBefore(taskInput, firstBlock)
            }

        }
        document.getElementsByClassName("titleInput")[0].focus()
    }






    projects.forEach(element => {
        var projectHtml = createProjectDom(element.name);
        projectHtml.id = JSON.stringify([i++])
        document.getElementById("list").appendChild(projectHtml);
        projectHtml.childNodes[0].onclick = openProject
        projectHtml.childNodes[1].onclick = deleteProject
    });
    highlight(number)
    renderTasks(number);
}

var manageUser = function(){
    var userElement = document.getElementById("username")
    var inp = createUserInput()
    inp.id = "username"
    inp.childNodes[1].onclick = ()=>{
        var givenName = inp.childNodes[0].value
        Session.user.name = givenName?givenName:"anonymous"
        Session.pushUpdate()
        location.reload()
    }
    userElement.parentElement.replaceChild(inp, userElement)

}

var renderPage = function () {

    
    Session.initiatePage()
    var userElement = document.getElementById("username")
    userElement.innerHTML = Session.user.name
    userElement.onclick = manageUser
    renderProjects(0);
}

export { renderPage }
