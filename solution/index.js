
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
    console.log();
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
    list.appendChild(newTask);
    newTask.classList.add("task");
    newTask.appendChild(document.createTextNode(textInput));
    newTask.classList.add("draggable");
    newTask.setAttribute("draggable","true");
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

const draggables = document.querySelectorAll('.draggable')
const sections = document.querySelectorAll('section')
console.log(draggables);

draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging')
  })

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging')
  })
})

sections.forEach(section => {
  section.addEventListener('dragover', e => {
    e.preventDefault()
    const ul = document.getElementsByTagName("ul");
    const afterElement = getDragAfterElement(ul, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
      section.appendChild(draggable);
    } else {
      section.insertBefore(draggable, afterElement);
    }
  })
})

function getDragAfterElement(section, y,) {
  const draggableElements = [...section.querySelectorAll('.draggable:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }
    } else {
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
}
