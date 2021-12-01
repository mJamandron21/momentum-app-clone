const time = document.getElementById('time'),
    greeting = document.getElementById('greeting'),
    name = document.getElementById('name'),
    focus = document.getElementById('focus'),
    content = document.getElementById('content'),
    author = document.getElementById('author');


//Todo default    
var todoContainer = document.getElementById('todo-container');
var newToDo = document.getElementById('newtodo');
var addToDoButton = document.getElementById('plus-button');
var toDoList = document.getElementById('todo-list');
var openTodo = document.getElementById('todo-button');
var closeToDo = document.getElementById("close-todo");


//Reset default
var resetDefault = document.getElementById("reset-button");
var resetConfirmation = document.getElementById("reset-confirmation");
var closeReset = document.getElementById("close-reset");
var yesReset = document.getElementById("yes-reset");
var noReset = document.getElementById("no-reset");


//function for showing the time
function showTime() {
    let today = new Date(),
        hour = today.getHours(),
        min = today.getMinutes(),
        sec = today.getSeconds();

    const amPm = hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12 || 12;

    time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)} ${amPm}`;

    setTimeout(showTime, 1000);
}

function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

//setting background in different time
function setBg() {
    let hour = new Date().getHours();

    if (hour < 6) {
        document.body.style.backgroundImage = 'url(images/dawn.jpg)';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundSize = 'cover';
        document.body.style.color = 'white';
        greeting.textContent = 'Good Morning, ';
    }
    else if (hour < 12) {
        document.body.style.backgroundImage = 'url(images/morning.jpg)';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundSize = 'cover';
        document.body.style.color = 'white';
        greeting.textContent = 'Good Morning, ';
    } else if (hour < 18) {
        document.body.style.backgroundImage = 'url(images/afternoon.jpg)';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundSize = 'cover';
        document.body.style.color = 'white';
        greeting.textContent = 'Good Afternoon, ';
    } else if (hour < 24) {
        document.body.style.backgroundImage = 'url(images/night.jpg)';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundSize = 'cover';
        document.body.style.color = 'white';
        greeting.textContent = 'Good Evening, ';
    }
}

//getname function

function getName() {
    if (localStorage.getItem('name') === null) {
        name.textContent = '[Enter Name]';
    } else {
        name.textContent = localStorage.getItem('name');
    }
}


if (localStorage.getItem('name') === null) {
    Swal.mixin({
        input: 'text',
        // confirmButtonText: 'Next &rarr;',
        confirmButtonText: 'Lets do this!'
        
    }).queue([
        {
            title: 'Hi! What is your name?'
        },
        
                    
    ]).then((result) => {
        if (result.value) {
            Swal.fire({
                title: 'All done!',
                type: "success",
                html: `
              <p>Your Name: ${result.value[0]}</p>
              `,
                   
                
            })
            .then(function(){ 
                location.reload();
            })

            localStorage.setItem('name', result.value[0]);
            
            
            
        }
    })

}




//get a random qoutes by axios
axios.get('https://api.quotable.io/random').then(res => {
    content.textContent = res.data.content;
    author.textContent = res.data.author;
});



//Show/Hide Todo Container
openTodo.onclick = function () {
    todoContainer.classList.toggle('active-container');
}

closeToDo.onclick = function() {
    todoContainer.classList.toggle('active-container');
}

window.addEventListener("keyup", function(e) {
    if (e.key == "Escape") {
        //for the todo App
        if (todoContainer.classList.contains('active-container'))
        todoContainer.classList.toggle('active-container');
    }
})

//create a function to show todo items
function showToDo (toDoItemTextContent) {
    let ToDoItemContainer = document.createElement('div');
    ToDoItemContainer.className = "todo-item";

    let removeButton = document.createElement('span');
    removeButton.className = "remove-todo";
    removeButton.innerHTML = "&times;";

    let todoCheckBox = document.createElement('input');
    todoCheckBox.type = "checkbox";
    todoCheckBox.className = "todo-checkbox";

    let todoItem = document.createElement('span');
    todoItem.className = "text-content";
    todoItem.textContent = toDoItemTextContent;

    toDoList.prepend(ToDoItemContainer);
    ToDoItemContainer.appendChild(todoCheckBox);
    ToDoItemContainer.appendChild(todoItem);
    ToDoItemContainer.appendChild(removeButton);

    newToDo.value = "";


    //modify items on click and change event
    
    todoCheckBox.addEventListener('change', function(){
        if(this.checked) {
            this.parentElement.classList.add('completed');
        }
        else {
            this.parentElement.classList.remove('completed');
        }
    })


    //remove item on array
    removeButton.addEventListener('click', function() {
        this.parentElement.classList.add('deleted');  //Add classlist to parent of removeButton
        var deleted = document.querySelector(".deleted .text-content"); //get the element with selected query
        var deletedValue = deleted.textContent;
        let i = todoArray.indexOf(deletedValue); //find the index of the textContent
        todoArray.splice(i, 1);
        this.parentElement.remove(); //remove the parent element on DOM/HTML;
        saveTodo(); //save spliced todoArray
    })
        
}


let todoArray = [];

function addToDo() {
    if (newToDo.value.trim().length > 0) {
        todoArray.push(newToDo.value);
        showToDo(newToDo.value);    
        saveTodo();
    }
}

addToDoButton.onclick = addToDo;
newToDo.addEventListener('keyup', function(e) {
    if(e.key == 'Enter') {
        addToDoButton.click();
    }
})

   
//Save or get todoArray to/from local storage;
function saveTodo() {
    var todoArrayStr = JSON.stringify(todoArray);
    localStorage.setItem("todoArray", todoArrayStr);
    
}

function getTodo() {
    var todoArrayStr = localStorage.getItem("todoArray")
    todoArray = JSON.parse(todoArrayStr);
    
    if(!todoArray) {
        todoArray = [];
    }
}

//Display Todo items Onload
function displayToDoInitial() {
    getTodo(); //Get values form local storage

    for (let i = 0; i < todoArray.length; i++) {
        showToDo(todoArray[i]);
    }
}
displayToDoInitial();




//Reset button functions
resetDefault.onclick = function() {
    resetConfirmation.classList.toggle("active-reset-confirmation");
}

closeReset.onclick = function() {
    resetConfirmation.classList.toggle('active-reset-confirmation');
}

yesReset.onclick = function() {
    localStorage.clear();
    location.reload();
}

noReset.onclick = function() {
    resetConfirmation.classList.toggle("active-reset-confirmation");
}

showTime();
setBg();
getName();



// code for today focus

function idSelector(idString) {
    return document.querySelector('#'+idString)
  }
  
  function classSelector(classString) {
    return document.querySelector('.'+classString)
  }

const today_input = idSelector('today_input')
 today_input.addEventListener('keypress', putToday)

 function putToday (e) {
   const today_input_value = today_input.value
   const today = idSelector('today')
   if(e.key === "Enter") {
     if(today_input_value !== "") {
       const todo_checkbox = idSelector('today_checkbox')
       const your_todo = idSelector('your_todo')

       today.style.display = "none"
       todo_checkbox.style.display = "block"
       your_todo.innerHTML += `
       <i  class="fas fa-check-circle" id="icon_complete"></i>
       <h2 id="today_focus_value">${today_input_value}</h2>
       <i  class="fas fa-backspace" id="icon_back"></i>
       `
       
       const today_focus_value = idSelector('today_focus_value')
       let condition = true 
       const icon_complete = idSelector('icon_complete')
       icon_complete.addEventListener('click', function () {
         if(condition) {
           today_focus_value.style.textDecoration = "line-through"
           today_focus_value.style.textDecorationThickness = '10px'
           today_focus_value.style.textDecorationColor = '#ffff'
           condition = false
         } else {
           today_focus_value.style.textDecoration = "none"
           condition = true
         }      
     })

     idSelector('today_input').value = ""
     const icon_back = idSelector('icon_back')
     const circle = idSelector('icon_complete')

     icon_back.addEventListener('click', function () {
       todo_checkbox.style.display = "none"
       today.style.display = "flex"
       today_focus_value.remove()
       icon_back.remove()
       circle.remove();
     })
     } else {
       function validateMainFocus() {
         const alert_message_fortoday = idSelector('alert_message_fortoday')
         alert_message_fortoday.innerHTML += "<p>Field is Empty! </p>"
         alert_message_fortoday.style.color = "White"
         setTimeout(function(){ 
           alert_message_fortoday.innerHTML = ""
         ; }, 3000);
       }
       validateMainFocus()
     }
   }
 }


 //weather
 const success = (position) =>{
     if(position){
         fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`)
         .then(response => {
             if(!response.ok){
                 throw Error("Weather data not available")
             }
             return response.json()
         })
         .then(response =>{
             const iconUrl = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
             document.querySelector('#weather').innerHTML = `
                <img src = ${iconUrl} />
                <p class ="weather-temp"> ${Math.round(response.main.temp)}°C </p>
                <p class = "weather-city"> ${response.name}</p>
             `
         })

         return
     }
 }

 const error = (err) => {
     document.querySelector('#location').innerHTML = 'Error getting location'
 }

 const getCoordinates = () =>{
     navigator.geolocation.getCurrentPosition(success, error);
 }
getCoordinates()
setInterval(getCoordinates, 30000)


//Quote Modal - Open and Close

var quoteCloseButton = document.getElementById('close-button');
var quoteModal = document.getElementById("add-quote-modal");
var qoutesButton = document.getElementById('qoutes-button')
var inputContainerModal = document.getElementById('add-quote-container');


//Open or Close Quotes Modal
function closeQuoteModal() {
    quoteModal.classList.remove('active');
}

function openQuoteModal() {
    quoteModal.classList.add('active');
}

//Event listeners for quote modal
quoteCloseButton.onclick = closeQuoteModal;
qoutesButton.onclick = openQuoteModal;
window.onclick =  function(e){
    if (quoteModal.classList.contains('active')){
        if(e.target == quoteModal) {
            quoteModal.classList.remove('active')
        }
    }
}
window.addEventListener('keyup', function(e) {
    if(e.key === "Escape") {
        if (quoteModal.classList.contains('active')) {
            quoteModal.classList.remove('active')
        }
    }      
})



//Add New Quote Container (Modal)

const quote1 = "One way to keep momentum going is to have constantly greater goals.";
const quote2 = "Success is going from failure to failure without losing your enthusiasm.";
const quote3 = "To improve is to change, so to be perfect is to change often.";


var addButton = document.getElementById('add-button');
var clearButton = document.getElementById('clear-button');
var inputQuote = document.getElementById('input-quote');
var displayedQuoteContainer = document.getElementById('quotes-display-container');
var addedNotification = document.getElementById('added-notification');
var quotesListContainer = document.getElementById('quotes-list');


//Show Added Quotes (method to display input quote)
function showQuote(quoteContent) {
    var newQuoteList = document.createElement('div');

    var newQuote = document.createElement('span');
    newQuote.textContent = quoteContent;
    newQuote.classList.add('quote-item');

    var removeQuote = document.createElement('span');
    removeQuote.innerHTML = '&times';
    removeQuote.classList.add('remove');

    var editQuote = document.createElement('span');
    editQuote.innerHTML = '&#9998;';
    editQuote.classList.add('edit-quote');

    quotesListContainer.appendChild(newQuoteList);
    newQuoteList.appendChild(newQuote);
    newQuoteList.appendChild(editQuote);
    newQuoteList.appendChild(removeQuote);

    inputQuote.value = "";

    addedNotification.classList.toggle('active-notification');

    //show notification when added new quote
    setTimeout(function() { 
        addedNotification.classList.remove('active-notification');
    }, 2000)

    //add event listener for each quote - REMOVE FUNCTION
    removeQuote.addEventListener('click', removeQuoteItem)

    //add event listener for each quote - EDIT FUNCTION
    editQuote.addEventListener('click', editQuoteItem)
}


function removeQuoteItem() {
    var removeQuoteButton = this

    removeQuoteButton.parentElement.classList.add('deleted-quote-div');
    var deletedQuote  = document.querySelector(".deleted-quote-div .quote-item"); //find the child textContent/quote of the "deleted-quote-div" parent.
    let i = quotes.indexOf(deletedQuote.textContent); //find index of deletedQuote on the exisiting quote array;
    
    quotes.splice(i, 1); //remove the quote from array
    removeQuoteButton.parentElement.remove();
    saveQuotes();
}


function editQuoteItem() {
    var editedClassAll = document.querySelectorAll('.edited'); //remove "edited class" for non-active(other than clicked) edit button
    editedClassAll.forEach(function(element) {
        element.classList.remove('edited');
    })

    // add "edited class to current on click element"
    var textSpan = this.previousElementSibling;
    textSpan.classList.add('edited');
    inputQuote.value = textSpan.textContent;
    addButton.disabled = true;

    //index of the quote-item from the stored quotes
    let i = quotes.indexOf(textSpan.textContent);
    
    function editQuote(e) {
        if(e.key === "Enter" && textSpan.classList.contains('edited')) {
            quotes[i] =  inputQuote.value.trim(); //reassign value
            saveQuotes();
            textSpan.textContent = inputQuote.value;
            textSpan.classList.remove('edited');
            inputQuote.value = "";
            addButton.disabled = false;

        }
    }

    inputQuote.addEventListener("keyup", editQuote)
}


//Save and get new Quotes list to/from the local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes))
}

function getQuotes() {
    quotes = JSON.parse(localStorage.getItem("quotes"));

    if (!quotes || quotes.length < 3) {
        quotes = [quote1, quote2, quote3];
    }
}


//Add new quote, display on interface, and push to quotes array
let quotes = [quote1, quote2, quote3];
function addNewQuote() {
    if(inputQuote.value.trim().length > 0 ) {
        quotes.push(inputQuote.value); //push to existing  array
        showQuote(inputQuote.value); //display on DOM
        saveQuotes(); //save to local storage the mutated quote array
    }

    addedNotification.classList.toggle('active-notification');
    //show notification when added new quote
    setTimeout(function() { 
        addedNotification.classList.remove('active-notification');
    }, 2000)
}


//show saved quotes from the local storage to the interface upon windows' load
function displayQuotesInitial() {
    getQuotes(); //get value if any quotes are stored
    for(let i = 0; i < quotes.length; i++) {
        showQuote(quotes[i]);
    }
}
displayQuotesInitial();  //display saved quotes onload


//Event listeners for (Input quote)
function clearInput() {
    inputQuote.value = "";
}

clearButton.onclick = clearInput;
addButton.onclick = addNewQuote;
inputQuote.addEventListener('keyup', function(e) {
    if(e.key === "Enter") {
        addButton.click();
    }
})


//Display random quote
function randomQuote() {
    let iRandom;
    iRandom = Math.floor((quotes.length * Math.random()));
    displayedQuoteContainer.innerHTML = '" ' + quotes[iRandom] + ' "';
}

randomQuote();
setInterval(randomQuote, 10000);