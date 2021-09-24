

function createNewTask(id,taskText = null){
    
    const textInput = taskText ?? document.getElementById(`add-${id}-task`).value;
    if(!textInput || textInput === ""){
        throw alert("no task input")
    }
    const list = document.getElementsByClassName(`${id}-tasks`)[0];
    const newTask = document.createElement("li");
    list.appendChild(newTask);
    newTask.classList.add("task");
    newTask.appendChild(document.createTextNode(textInput));
    newTask.onblur = () => {
        newTask.contentEditable = false;
    }
    newTask.addEventListener("dblclick",() => {
        newTask.contentEditable = true;
        newTask.focus()})

    newTask.addEventListener("mouseenter",() => mouseOverFunc(newTask))   
}



function mouseOverFunc(task){
    document.selectedTask = task;
    task.addEventListener("mouseleave", () => {
        document.selectedTask = null;
});}

function altKeyTaskMove(event){
    const task = document.selectedTask;
    const sections = document.getElementsByTagName("section");
    const key = event.key
    if(task && event.altKey && key <= sections.length){
        createNewTask(sections[key - 1].id , task.textContent);
        task.remove();
        document.selectedTask = null;
}
}
 

 
function createSectionElement(id) {
    const container = document.getElementById("container");
    const section = document.createElement("section");
    section.id=id;
    const ulElement  = document.createElement('ul');
    ulElement.classList.add(`${id}-tasks`)
    ulElement.textContent = `${id}`
    section.appendChild(ulElement);
    const inputElement  = document.createElement('input')
    inputElement.id = `add-${id}-task`
    section.appendChild(inputElement);
    const addButton = document.createElement("BUTTON");
    addButton.innerText = "add";
    addButton.id = `submit-add-${id}`;
    section.appendChild(addButton);
    addButton.addEventListener("click",()=>createNewTask(id));
    container.appendChild(section);
}


document.createAttribute("selectedTask");
document.addEventListener("keydown",(event) => altKeyTaskMove(event));
["to-do","in-progress","done"].forEach((id) => {
    createSectionElement(id);
});

