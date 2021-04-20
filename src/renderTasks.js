import { Session, ToDoProject, ToDoList, Checklist} from "./todoManipulation"
import { createTaskDom, addTaskToList, createProjectDom, createExpandedTaskDom, createProjInputDom, createTaskInputDom } from './todoDom'

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
        // console.log(taskArea.firstElementChild)
        var sibling = taskArea.firstElementChild
        var indexing = 0
        while(sibling != null){
            console.log(sibling)
            sibling.id = JSON.stringify([i, indexing++])
            sibling = sibling.nextElementSibling
        }
    }

    var deleteFunction = function (elem) {
        var coor = JSON.parse(this.parentNode.id)
        document.getElementById(this.parentNode.id).remove()
        Session.user.projects[coor[0]].toDoLists.splice(coor[1], 1)

        // console.log(this.parentNode.srcElement.parentNode)
        // console.log(elem.srcElement.parentNode.parentNode)
     
        // taskArea.element.forEach((taskWithIndex)=>{
        //     console.log(taskWithIndex)
        // })
        doReindexing()

        Session.pushUpdate()



        // console.log(coor[0],coor[1])
        // console.log(Session.user.projects[coor[0]])
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



var renderProjects = function (number) {
    var projects = Session.user.projects;
    var i =0
    
    var highlight = (n) => {
        var projElems = document.getElementsByClassName("name")
        for (let index = 0; index < projElems.length; index++) {
            const element = projElems[index];
            element.style.backgroundColor = (index == n)?"blue": "brown"
            
        }
    }
    
    var openProject = (ele) =>{
        var projNo = JSON.parse(ele.srcElement.parentNode.id);
        // ele.srcElement.style.backgroundColor = "blue"
        highlight(projNo)
        // console.log(ele)
        var taskArea = document.getElementById("taskList")
        taskArea.innerHTML = '';
        document.getElementById("list").innerHTML = ''
        renderProjects(projNo)
    }

    var deleteProject = function () {
        var coor = JSON.parse(this.parentNode.id)
        // console.log(Session.user.projects[coor[0]])
        Session.user.projects.splice([coor[0]], 1)
        Session.pushUpdate()
        document.getElementById("taskList").innerHTML = ''
        document.getElementById("list").innerHTML = ''
        renderPage()

        // document.getElementById(this.parentNode.id).remove()
        // Session.pushUpdate()
    }
    


    //add project button
    document.getElementById("projButton").onclick = ()=>{
        // console.log(this)
        var saveProject = function(ele){
            var newProj = ToDoProject(ele.srcElement.parentNode.childNodes[0].value)
            // console.log(newProj)
            Session.user.projects.push(newProj)
            document.getElementById("list").innerHTML = ''
            document.getElementById("taskList").innerHTML = ''
            renderProjects(0)
            Session.pushUpdate()
            // console.log(Session.user.projects)
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

        // console.log(projList[0].childNodes[0].className != "projInput")





    }


    //add task button
    document.getElementById("button").onclick = ()=>{

        var saveTask = function(form){
            var checkListItems = []
            form[4].childNodes.forEach((checkListItem)=>{
                checkListItems.push(checkListItem.childNodes[1].value)
                // console.log(checkListItem.childNodes[1].value)
            })
            var newCreatedTask = ToDoList(form[1].value, form[2].value, form[3].value, Checklist(checkListItems))


            // console.log(form[1].value)
            // console.log(form[2].value)
            // console.log(form[3].value)
            // console.log(newCreatedTask)
            // console.log(Session.user.projects)
            // console.log(number)
            Session.user.projects[number].toDoLists.push(newCreatedTask)

            // document.getElementById("list").innerHTML = ''
            document.getElementById("taskList").innerHTML = ''
            // renderProjects(number)
            renderTasks(number)
            Session.pushUpdate()
            // renderPage()
        }
        
        var taskArea = document.getElementById("taskList")
        var taskCover =  document.getElementById("taskList")
        var taskInput = createTaskInputDom()
        
        taskInput.childNodes[5].onclick = (elem)=>{
            var form = elem.srcElement.parentNode.childNodes;
            saveTask(form);
        }

        if (taskArea.childElementCount == 0){
            taskCover.appendChild(taskInput)
        }
        else{
            var metaList = JSON.parse(taskArea.lastElementChild.id)
            taskArea.innerHTML = '';
            renderTasks(metaList[0])
            var firstBlock = taskCover.firstElementChild
            if (firstBlock.childNodes[0].className == "tick"){
                taskCover.insertBefore(taskInput, firstBlock)
            }
        }

    }






    projects.forEach(element => {
        var projectHtml = createProjectDom(element.name);
        projectHtml.id = JSON.stringify([i++])
        document.getElementById("list").appendChild(projectHtml);
        projectHtml.childNodes[0].onclick = openProject
        projectHtml.childNodes[1].onclick = deleteProject
        // console.log(projectHtml.onclick)
    });
    highlight(number)
    renderTasks(number);
}


var renderPage = function () {
    Session.initiatePage()
    renderProjects(0);
}

export { renderPage }

// renderTasks()

// head = document.createElement("h2")
// head.innerHTML = "hello"
// document.querySelector("div").appendChild(head)