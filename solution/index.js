
const LOCAL_STORAGE_KEY = "todoListTasks"
function localStorageInit(){
    const json = localStorage.getItem(LOCAL_STORAGE_KEY);

    function loadFromLocalStorage(){
        localStorage.getItem(LOCAL_STORAGE_KEY)
        console.log(localStorage.getItem(LOCAL_STORAGE_KEY));
    }
    loadFromLocalStorage()

    if(!json){
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
          "to-do": [],
          "in-progress": [],
           "done": []
      }))
    }
    return JSON.parse(json)
}


localStorageInit()

document.createAttribute("selectedTask");

document.addEventListener("keydown",(event) => {
    if(document.selectedTask) {
        modifyTask(event)
    }
});

document.getElementById("search").addEventListener("keyup",search);

["to-do","in-progress","done"].forEach((id) => {
    createSectionElement(id);
});



function addItemToLocalStorage(item, list){
    const currentDataFromLocalStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

    const newData = {
        ...currentDataFromLocalStorage,
        [list]: [...currentDataFromLocalStorage[list], item]
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData))
}

function removeItemFromLcalStorage(item,list){
    debugger
    const currentDataFromLocalStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

    const newData = {
        ...currentDataFromLocalStorage,
        [list]: currentDataFromLocalStorage[list].filter(listItem => listItem !== item)
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData))

}

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
    newTask.setAttribute("dragabble","true");
    newTask.addEventListener("dblclick",(e) => {
        newTask.contentEditable = true;
        newTask.focus();
        let updateTask = e.targert.innerText;
        newTask.onblur(() => addItemToLocalStorage(textInput, id))
        
    });

        
    
    
    newTask.addEventListener("mouseenter",() => mouseOverFunc(newTask));
    
     
    addItemToLocalStorage(textInput, id);
}


function mouseOverFunc(task){
    document.selectedTask = task;
    task.addEventListener("mouseleave", () => {
        document.selectedTask = null;
})
 

}

function modifyTask(event){
    const task = document.selectedTask;
    const sections = document.getElementsByTagName("section");
    const key = event.key
    if(task && event.altKey && key <= sections.length){
        
        createNewTask(sections[key - 1].id , task.textContent);
        task.remove();
        document.selectedTask = null;
}else if(task && key === "Delete" ){
    
    removeItemFromLcalStorage(task.textContent,task.closest('section').id)
    task.remove();
}}
 

 
function createSectionElement(id) {
    const container = document.getElementById("container");
    const section = document.createElement("section");
    section.id=id;
    const ulElement  = document.createElement('ul');
    ulElement.classList.add(`${id}-tasks`)
    ulElement.textContent = `${id}`
    section.appendChild(ulElement);
    const inputElement  = document.createElement('input')
    inputElement.onfocus = () => inputElement.value = "";
    inputElement.id = `add-${id}-task`
    section.appendChild(inputElement);
    const addButton = document.createElement("BUTTON");
    addButton.innerText = "add";
    addButton.id = `submit-add-${id}`;
    section.appendChild(addButton);
    addButton.addEventListener("click",()=>{
        createNewTask(id);
        inputElement.value = "";
    });


    inputElement.addEventListener("keydown",(event)=>{if(event.key === "Enter"){
        createNewTask(id);
        inputElement.value = "";
    } });
    container.appendChild(section);
    
}



function search(){
    const searchText = document.getElementById("search").value;
    const searchTextList = searchText.toLowerCase().split("");
    const sections = Array.from(document.getElementsByTagName("section"));
    sections.forEach((section)=>Array.from(section.firstChild.children).forEach((task)=>{
        task.style.display = "none";
        if(searchText !== null && searchText !== ""){
            hideByFilter(task,searchTextList);}else{task.style.display = "block";}
    })
    )
}
function hideByFilter(task,searchTextList) {
    
        taskTextList = task.textContent.toLowerCase().split("");
        let i = 0;
        if(taskTextList.length >= searchTextList.length){
            while (taskTextList[i] === searchTextList[i] && i <= searchTextList.length) {          
                task.style.display = "block" ;
                i++
             }
        }   
}



localStorageInit()
