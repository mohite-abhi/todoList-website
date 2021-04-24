import { Session, ToDoProject, ToDoList, Checklist } from "./todoClasses"
import { createTaskDom, createProjectDom, createExpandedTaskDom, createProjInputDom, createTaskEditorDom, createUserInput, addItemToChecklist } from './todoDom'



var TaskRenderer = function (projectNo) {

    var thisRenderer = {}
    thisRenderer.projectNo = projectNo

    thisRenderer.markTaskAsDone = function () {
        var elem = document.getElementById(this.parentNode.id).childNodes[0]
        var addr = JSON.parse(this.parentNode.id)
        if (Session.user.projects[addr[0]].toDoLists[addr[1]].isComplete == false) {
            elem.innerHTML = "&#10003;"
            Session.user.projects[addr[0]].toDoLists[addr[1]].isComplete = true
        }
        else {
            elem.innerHTML = "&#9634;"
            Session.user.projects[addr[0]].toDoLists[addr[1]].isComplete = false
        }
        Session.pushUpdate()
    }



    thisRenderer.markChecklistItem = function () {
        var elem = document.getElementById(this.id).childNodes[0]
        var addr = JSON.parse(this.id)
        if (Session.user.projects[addr[0]].toDoLists[addr[1]].checkList.taskStatus[addr[2]] == false) {
            elem.innerHTML = "&#10003;"
            Session.user.projects[addr[0]].toDoLists[addr[1]].checkList.taskStatus[addr[2]] = true
        }
        else {
            elem.innerHTML = "&#9634;"
            Session.user.projects[addr[0]].toDoLists[addr[1]].checkList.taskStatus[addr[2]] = false
        }
        Session.pushUpdate()
    }



    thisRenderer.expandTask = function (addr) {
        thisRenderer.renderTasks(addr[0])
        var old = document.getElementById(JSON.stringify(addr))

        var renderTaskEditor = (elem) => {

            var saveTaskAgain = function (form) {
                var checkListItems = []
                form[4].childNodes.forEach((checkListItem) => {
                    var fetchedValue = checkListItem.childNodes[1].value
                    if (fetchedValue != "")
                        checkListItems.push(fetchedValue)
                })

                var newCreatedTask = new ToDoList(form[1].value, form[2].value, form[3].value, new Checklist(checkListItems))
                Session.user.projects[addr[0]].toDoLists.splice(addr[1], 1)
                Session.user.projects[addr[0]].toDoLists.push(newCreatedTask)
                thisRenderer.renderTasks(addr[0])
                Session.pushUpdate()
            }

            var prevTaskAddr = JSON.parse(elem.srcElement.parentNode.id)
            var taskEditor = createTaskEditorDom()
            var prevTask = Session.user.projects[prevTaskAddr[0]].toDoLists[prevTaskAddr[1]]
            taskEditor.childNodes[1].value = prevTask.title
            taskEditor.childNodes[2].value = prevTask.description
            taskEditor.childNodes[3].value = prevTask.dueDate
            taskEditor.childNodes[4].firstChild.remove()

            for (let index = 0; index < prevTask.checkList.tasks.length; index++) {
                const checklistName = prevTask.checkList.tasks[index];
                addItemToChecklist(taskEditor.childNodes[4], checklistName)
            }

            var taskArea = document.getElementById("taskList")

            taskEditor.childNodes[5].onclick = function(elem) {
                // console.log(this)
                var form = elem.srcElement.parentNode.childNodes;
                saveTaskAgain(form);
            }


            var metaList = prevTaskAddr
            taskArea.replaceChild(taskEditor, document.getElementById(JSON.stringify(addr)))
            document.getElementsByClassName("titleInput")[0].focus()

        }

        var expandedTaskHtml = createExpandedTaskDom(Session.user.projects[addr[0]].toDoLists[addr[1]])
        expandedTaskHtml.id = old.id
        expandedTaskHtml.childNodes[0].onclick = thisRenderer.markTaskAsDone;
        expandedTaskHtml.lastElementChild.onclick = renderTaskEditor
        var k = 0

        expandedTaskHtml.childNodes[4].childNodes.forEach((elem) => {
            elem.id = JSON.stringify([addr[0], addr[1], k++])
            elem.onclick = thisRenderer.markChecklistItem;

        })

        old.parentNode.replaceChild(expandedTaskHtml, old)
    }

    thisRenderer.reindexTaskElemId = function () {
        var taskArea = document.getElementById("taskList")
        var sibling = taskArea.firstElementChild
        var indexing = 0
        while (sibling != null) {
            if (sibling.firstChild.firstChild.className != "plus") {
                sibling.id = JSON.stringify([thisRenderer.projectNo, indexing++])
            }
            sibling = sibling.nextElementSibling
        }
    }

    thisRenderer.deleteThisTask = function (elem) {
        var addr = JSON.parse(this.parentNode.id)
        document.getElementById(this.parentNode.id).remove()
        Session.user.projects[addr[0]].toDoLists.splice(addr[1], 1)
        thisRenderer.reindexTaskElemId()
        Session.pushUpdate()
    }

    thisRenderer.renderTaskElement = function (taskHtml) {
        document.getElementById("taskList").appendChild(taskHtml);
    }


    thisRenderer.renderTasks = function (projNo = thisRenderer.projectNo) {

        //clean any already rendered lists
        document.getElementById("taskList").innerHTML = ''

        var projectData = Session.user.projects[projNo]
        var taskNo = 0;
        if (projectData != undefined) {

            var expandParentTask = function () {
                thisRenderer.expandTask(JSON.parse(this.parentNode.id))
            }

            projectData.toDoLists.forEach(taskData => {
                //each task be added to frontend task list
                var taskElement = createTaskDom(taskData.isComplete, taskData.title, taskData.description, taskData.dueDate.slice(0, 10))

                //add ticking function to task checkbox
                taskElement.childNodes[0].onclick = thisRenderer.markTaskAsDone;

                //add task expand function to clicking title, description and duedate
                for (let n = 1; n < 4; n++)
                    taskElement.childNodes[n].onclick = expandParentTask;

                //add delete function to task delete button
                taskElement.childNodes[4].onclick = thisRenderer.deleteThisTask;

                //set task element id according to its proj no and task no
                taskElement.id = JSON.stringify([projNo, taskNo++]);
                thisRenderer.renderTaskElement(taskElement);


            });
        }
    }


    return thisRenderer
}





var ProjectRenderer = function (projNo) {
    var thisRenderer = {}
    thisRenderer.projectNo = projNo
    thisRenderer.myTaskRenderer = TaskRenderer(thisRenderer.projectNo)
    thisRenderer.projects = Session.user.projects;

    thisRenderer.highlight = (n) => {
        // console.log("hello")
        var projElems = document.getElementsByClassName("name")
        // console.log(n)
        for (let index = 0; index < projElems.length; index++) {
            const element = projElems[index];
            element.style.borderColor = (index == n) ? "rgb(255, 216, 100)" : "rgb(255, 216, 100,0)"
        }
    }

    thisRenderer.openProject = (ele) => {
        // console.log(projNo)
        var idProjNo = JSON.parse(ele.srcElement.parentNode.id);
        // console.log(idProjNo)
        thisRenderer.highlight(idProjNo[0])
        thisRenderer.renderProjectList(idProjNo[0])
    }

    thisRenderer.deleteProject = function () {
        var addr = JSON.parse(this.parentNode.id)
        Session.user.projects.splice([addr[0]], 1)
        Session.pushUpdate()
        renderPage()
    }


    thisRenderer.renderProjectCreator = function () {

        //add project button
        document.getElementById("projButton").onclick = () => {
            var saveProject = function (ele) {
                var givenProjectName = ele.srcElement.parentNode.childNodes[0].value
                var newProj = new ToDoProject(givenProjectName?givenProjectName:"new project")
                Session.user.projects.push(newProj)
                thisRenderer.renderProjectList(Session.user.projects.length-1)
                Session.pushUpdate()
            }

            var listCover = document.getElementById("list")
            var projInp = createProjInputDom();
            projInp.childNodes[1].onclick = saveProject

            if (listCover.childElementCount == 0) {
                listCover.appendChild(projInp)
            }

            else {
                var projList = document.getElementsByClassName("projectItem")
                if (projList[0].childNodes[0].className != "projInput") {
                    listCover.insertBefore(projInp, projList[0])
                }
            }

            document.getElementsByClassName("projInput")[0].focus()
        }
    }




    thisRenderer.renderTaskCreator = function (projNo = thisRenderer.projectNo) {

        //add working of add task button
        document.getElementById("button").onclick = function(e) {

            // console.log(thisRenderer.projectNo)
            var saveTask = function (form) {
                var checkListItems = []
                form[4].childNodes.forEach((checkListItem) => {
                    var fetchedValue = checkListItem.childNodes[1].value
                    if (fetchedValue != "")
                        checkListItems.push(fetchedValue)
                })
                // console.log(e)


                var newCreatedTask = new ToDoList(form[1].value, form[2].value, form[3].value, new Checklist(checkListItems))
                Session.user.projects[projNo].toDoLists.push(newCreatedTask)
                thisRenderer.myTaskRenderer.renderTasks()
                Session.pushUpdate()
            }

            var taskArea = document.getElementById("taskList")
            var taskEditor = createTaskEditorDom()

            taskEditor.childNodes[5].onclick = function(elem) {
                var form = elem.srcElement.parentNode.childNodes;
                console.log(elem.srcElement.parentNode)
                saveTask(form);
            }

            if (taskArea.childElementCount == 0) {
                taskArea.appendChild(taskEditor)
            }

            else {
                var metaList = JSON.parse(taskArea.lastElementChild.id)
                thisRenderer.myTaskRenderer.renderTasks(metaList[0])
                var firstBlock = taskArea.firstElementChild
                
                if (firstBlock.childNodes[0].className == "tick") 
                    taskArea.insertBefore(taskEditor, firstBlock)

            }
            document.getElementsByClassName("titleInput")[0].focus()
        }
    }

    thisRenderer.renderProjectList = function (idProjNo = thisRenderer.projectNo) {
        //clear already present project items
        document.getElementById("list").innerHTML = ''

        // console.log(idProjNo)
        var i = 0
        thisRenderer.projects.forEach(element => {
            var projectHtml = createProjectDom(element.name);
            projectHtml.id = JSON.stringify([i++])
            document.getElementById("list").appendChild(projectHtml);
            projectHtml.childNodes[0].onclick = thisRenderer.openProject
            projectHtml.childNodes[1].onclick = thisRenderer.deleteProject
        });

        thisRenderer.highlight(idProjNo)
        thisRenderer.myTaskRenderer.renderTasks(idProjNo)
        thisRenderer.renderProjectCreator()
        thisRenderer.renderTaskCreator()
    }

    return thisRenderer

}


var renderUserName = function () {
    var renderUserNameEditor = function () {
        var userElement = document.getElementById("username")
        var inp = createUserInput()
        inp.id = "username"
        inp.childNodes[1].onclick = () => {
            var givenName = inp.childNodes[0].value
            Session.user.name = givenName ? givenName : "anonymous"
            Session.pushUpdate()
            location.reload()
        }
        userElement.parentElement.replaceChild(inp, userElement)

    }

    var userElement = document.getElementById("username")
    userElement.innerHTML = Session.user.name
    userElement.onclick = renderUserNameEditor
}

var renderTodoList = function () {
    var projectNo = 0
    var myProjectRenderer = ProjectRenderer(projectNo)
    myProjectRenderer.renderProjectList()
}

var renderPage = function () {

    Session.setUpUser()
    renderUserName()
    renderTodoList();
}

export { renderPage }
