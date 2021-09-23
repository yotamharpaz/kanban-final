// // auxiliary functions 
//  const container = document.getElementById("container")
//  const button = document.getElementsByTagName("button")
 
//  container.addEventListener("click",(evt) => {
//   createNewTask(evt.target.parentNode.id)});

 
  


 function createNewTask(id){
    const textInput = document.getElementById(`add-${id}-task`).value;
    console.log(textInput);
     const list = document.getElementsByClassName(`${id}-tasks`)[0];
     const newTask = document.createElement("li");
     list.appendChild(newTask);
     newTask.appendChild(document.createTextNode(textInput));
     console.log(newTask);
     
 }
 
 
 function createSectionElement(id) {
    const container = document.getElementById("container");
    const section = document.createElement("section");
    section.id=id;
    const ulElement  = document.createElement('ul');
    ulElement.classList.add(`${id}-tasks`)
    ulElement.textContent = "pipikaki"
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




["to-do","in-progress","done"].forEach((id) => {
    createSectionElement(id);
});

