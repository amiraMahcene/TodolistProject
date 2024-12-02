const newTaskInput = document.getElementById('new-task-input');
const prioritySelect = document.getElementById('priority-select'); // Get priority select element
const calendarIcon = document.getElementById('calendar-icon');
const calendarModal = document.getElementById('calendar-modal');
const calendarDateTimeInput = document.getElementById('calendar-date-time');
const cancelBtn = document.getElementById('cancel-btn');
const okBtn = document.getElementById('ok-btn');
const tasksList = document.getElementById('tasks-list');
const completedTasksList = document.getElementById('completed-tasks-list');
const detailSection = document.getElementById('detail-section');

// Variable to store the selected date/time
let selectedDateTime = null;



// Show calendar modal when calendar icon is clicked
calendarIcon.addEventListener('click', () => {
  calendarModal.style.display = 'flex';
  calendarDateTimeInput.focus();
});

// Close calendar modal when "Cancel" is clicked
cancelBtn.addEventListener('click', () => {
  calendarModal.style.display = 'none';
  selectedDateTime = null; // Clear the selected date/time if canceled
});

// Save date/time to variable and close modal when "OK" is clicked
okBtn.addEventListener('click', () => {
  if (calendarDateTimeInput.value) {
    selectedDateTime = calendarDateTimeInput.value; // Store the date/time in a variable
  } else {
    alert('Please select a valid date and time.');
  }

  calendarModal.style.display = 'none';
});

// Add task when pressing Enter in the task input field
newTaskInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

// Function to add a new task
function addTask() {
  const taskText = newTaskInput.value.trim();
  const priorityLevel = prioritySelect.value; // Get selected priority

  if (!taskText) {
    alert('Please enter a task.');
    return;
  }

  const taskItem = document.createElement('li');
  taskItem.className = 'task-item';

  taskItem.innerHTML = `
    <div class="task-content">
      <span class="task-text">${taskText}</span>
      <span class="task-date-time">${selectedDateTime || 'No date specified'}</span>
      <span class="task-priority">Priority: ${priorityLevel}</span> <!-- Displaying priority -->
    </div>
  `;

  // Create the "details" button for each task
  const mark = document.createElement('img');
  mark.setAttribute('src', '../images/icons8-points-de-suspension-30.png');
  mark.style.width = "20px";
  mark.style.height = '20px';
  
  // Append mark icon to task item
  taskItem.appendChild(mark);

  // Show detailed task view when clicking on the "details" button
  mark.addEventListener('click', function newsection() {
    const sectionId = 'section-' + Date.now(); // Unique ID for each section
    const section = document.createElement('div');
    section.setAttribute('class', 'section');
    section.setAttribute('id', sectionId);
    detailSection.appendChild(section);
    
    let title = document.createElement('h3');
    title.innerHTML = `
      <div class="task-content" id="task-content">
        <span class="task-text">${taskText}</span>
        <img src="../images/icons8-structure-en-arbre-50.png" alt="" id="soustasks">
      </div>
    `;
    title.style.borderBottom = '1px solid #ccc';
    title.style.paddingBottom = '10px';
    section.appendChild(title);

    // Handle subtask functionality when "soustasks" is clicked
    const soustaskIcon = title.querySelector('#soustasks');
    soustaskIcon.addEventListener('click', function () {
      // Create an input field for the subtask
      let sousTaskInput = document.createElement('input');
      sousTaskInput.setAttribute('class', 'soustasktext')
      sousTaskInput.placeholder = "Add a subtask...";
      section.appendChild(sousTaskInput);

      // Listen for Enter key to add subtask to the list
      sousTaskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && sousTaskInput.value.trim()) {
          let sousListTask = document.createElement('ul');
          sousListTask.setAttribute('class', 'sousListTask')
          let item = document.createElement('li');
          item.setAttribute('class','sousTaskItem')
          item.textContent = sousTaskInput.value;
          sousListTask.appendChild(item);
          section.appendChild(sousListTask);
          sousTaskInput.value = '';  // Reset input after adding subtask
        }
      });
    });
    
    // Store reference of the detailed section in the taskItem for later removal
    taskItem.detailedSectionId = sectionId; // Store unique ID of detailed section in taskItem
  });

  // Add functionality to mark task as completed when clicked on it
  taskItem.addEventListener('dblclick', () => completeTask(taskItem));

  // Add task to the task list
  tasksList.appendChild(taskItem);

  // Clear inputs and reset variables after adding the task
  newTaskInput.value = '';
  selectedDateTime = null;
}

// Function to mark a task as completed and move it to the "Completed Tasks" section
function completeTask(taskItem) {
  // Change task style to indicate completion
  taskItem.classList.add('completed-task');

  // Remove the corresponding detailed section if it exists
  const detailedSectionId = taskItem.detailedSectionId;
  
  if (detailedSectionId) {
    const detailedSectionToRemove = document.getElementById(detailedSectionId);
    if (detailedSectionToRemove) {
      detailSection.removeChild(detailedSectionToRemove); // Remove detailed section from DOM
    }
  }

  // Remove the task from the main list and add it to the completed list
  tasksList.removeChild(taskItem);
  
  // Move the task to the "Completed Tasks" list
  completedTasksList.appendChild(taskItem);
  
   // Removing the event Listiner if needed (you may want to adjust this)
   const markIcon = taskItem.querySelector("img"); // Get mark icon within this task item.
   if (markIcon) {
       markIcon.removeEventListener("click", newsection); 
   }

   // Style changes for completed tasks
   taskItem.style.backgroundColor = '#f2f2f2';
   taskItem.style.color = '#666';
}
