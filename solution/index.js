
const LOCAL_STORAGE_KEY = "tasks"
function localStorageInit(){
    const json = localStorage.getItem(LOCAL_STORAGE_KEY);

    if(!json){
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
          "to-do": [],
          "in-progress": [],
           "done": []
      }))
    }
    loadFromLocalStorage();
}

localStorageInit()

function loadFromLocalStorage(){
    localStorageObj = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    Object.keys(localStorageObj).forEach((sectionId) => {
        createSectionElement(sectionId);
        localStorageObj[sectionId].forEach((taskText)=>{
            createNewTask(sectionId,taskText,false);
        })
    });
}

document.createAttribute("selectedTask");

document.addEventListener("keydown",(event) => {
    if(document.selectedTask) {
        modifyTask(event)
    }
});

document.getElementById("search").addEventListener("keyup",search);




function addItemToLocalStorage(item, list){
        const currentDataFromLocalStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        
        const newData = {
            ...currentDataFromLocalStorage,
            [list]: [...currentDataFromLocalStorage[list], item]
        }
        
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData))
}

function removeItemFromLocalStorage(item,list){
    const currentDataFromLocalStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

    const newData = {
        ...currentDataFromLocalStorage,
        [list]: currentDataFromLocalStorage[list].filter(listItem => listItem !== item)
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData))

}

function createNewTask(id,taskText = null,addToLS = true){

    const textInput = taskText ?? document.getElementById(`add-${id}-task`).value;
    if(!textInput || textInput === ""){
        throw alert("no task input")
    }
    const list = document.getElementsByClassName(`${id}-tasks`)[0];
    const newTask = document.createElement("li");
    list.replaceChildren(newTask, ...list.children);
    newTask.classList.add("task");
    newTask.appendChild(document.createTextNode(textInput));
    newTask.addEventListener("dblclick",() => {
        removeItemFromLocalStorage(newTask.textContent ,id);
        newTask.contentEditable = true;
        newTask.focus();
        newTask.onblur = () => {
            newTask.contentEditable = false;
            newTask.textContent ? addItemToLocalStorage(newTask.textContent ,id) : newTask.remove();
        }
    });
    newTask.addEventListener("mouseenter",() => mouseOverFunc(newTask));
     
    if(addToLS) addItemToLocalStorage(textInput, id);
}


function mouseOverFunc(task){
    document.selectedTask = task;
    task.addEventListener("mouseleave", () => {
        document.selectedTask = null;
})
 

}

function modifyTask(event){
    const task = document.selectedTask;
    const sections = Array.from(document.getElementsByTagName("section"));
    const key = event.key
    console.log(sections.indexOf(task.closest('section')));
    if(task && event.altKey && key <= sections.length && sections.indexOf(task.closest('section')) !== key-1 ){
        createNewTask(sections[key - 1].id , task.textContent);
        removeItemFromLocalStorage(task.textContent,task.closest('section').id); 
        task.remove();
        document.selectedTask = null;
}else if(task && key === "Delete" ){
    
    removeItemFromLocalStorage(task.textContent,task.closest('section').id)
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
    const searchText = document.getElementById("search").value.toLowerCase();
    const liList = document.querySelectorAll("li")
    liList.forEach((li)=> li.hidden = !li.textContent.includes(searchText))
    
}

