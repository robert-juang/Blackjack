function renderEntry(parent, text,identifier) {
    // Create a new div element
    
    const div = document.createElement("div");
    
    // Set the text of the div element to the input text
    div.innerHTML = text;
    div.className = "textEntry"; 
    // Add some CSS styles to center the div element
    div.id = identifier; 
    // Append the div element to the parent element
    parent.appendChild(div);
  }
  

function renderButton(parent,name) {
    // Create a new button element
    const button = document.createElement("button");
  
    // Set the type of the button to "submit"
    button.type = "submit";
    
    // Set the text inside the button to "hit"
    button.innerHTML = name;
    button.className = name; 
    // Add some CSS styles to make the button bigger
    
    // Append the button to the parent element
    parent.appendChild(button);
  }


function removeByClassName(name){
    const removethis = document.getElementsByClassName(name);
    while(removethis.length > 0){
        removethis[0].parentNode.removeChild(removethis[0]);
    }
}

function renderCard(number,suite,parent,...args){
//render a card element 
    function addTextNode(text, parent) {
        const newtext = document.createTextNode(text);
        parent.appendChild(newtext);
    }

    const card = document.createElement('div'); 
    card.className = "card"; 
    if (args !== undefined){
        card.id = args[0]; 
    }
    addTextNode(number+suite,card); 
    parent.appendChild(card); 
}

function renderPlayerTracker(parent){
//will keep track of player's total card count 
    const playerTracker = document.createElement('div'); 
    playerTracker.className = 'playerTracker'; 
    parent.appendChild(playerTracker); 
    return parent; 
}

function renderComputerTracker(parent){
//will keep track of computer's total card count 
    const computerTracker = document.createElement('div'); 
    computerTracker.className = 'computerTracker'; 
    parent.appendChild(computerTracker); 
    return parent; 
}

function renderWhoWin(parent, text){
    const whowin = document.createElement('div'); 
    whowin.textContent = text; 
    whowin.className = 'whowin'; 
    parent.appendChild(whowin); 
    return parent; 
}
//<label for="startValues">Start Values:</label> <input type="text" name="startValues" placeholder="type here" id="startValues">  

function renderTextField(parent,text,myclass){
    const textfield = document.createElement('input'); 
    textfield.type = "text"; 
    textfield.placeholder = text; 
    textfield.name = myclass; 
    textfield.id = myclass; 
    parent.appendChild(textfield); 
}

function renderHistory(parent, data) {
    // Create a header div for the game history
    const historyHeader = document.createElement("div");
    historyHeader.id = "headings"; 
    const historyHeaderText = document.createElement("h2");
    historyHeaderText.innerText = "Game History";
    historyHeader.appendChild(historyHeaderText);
    
    // Create a table to display the game history
    const historyTable = document.createElement("table");
    
    // Create a table header row with columns for Initials, Player Score, Computer Score, and Date Created
    const headerRow = document.createElement("tr");
    const initialsHeader = document.createElement("th");
    const playerScoreHeader = document.createElement("th");
    const computerScoreHeader = document.createElement("th");
    const dateCreatedHeader = document.createElement("th");
    
    initialsHeader.innerText = "Initials";
    playerScoreHeader.innerText = "Player Score";
    computerScoreHeader.innerText = "Computer Score";
    dateCreatedHeader.innerText = "Date Created";
    
    headerRow.appendChild(initialsHeader);
    headerRow.appendChild(playerScoreHeader);
    headerRow.appendChild(computerScoreHeader);
    headerRow.appendChild(dateCreatedHeader);
    
    historyTable.appendChild(headerRow);
    
    // Iterate through the data array and create a table row for each object

    data.forEach((entry,index) => {
      const row = document.createElement("tr");
      row.id = index; 
      const initials = document.createElement("td");
      const playerScore = document.createElement("td");
      const computerScore = document.createElement("td");
      const dateCreated = document.createElement("td");
      
      initials.innerText = entry.initials;
      playerScore.innerText = entry.playerScore;
      computerScore.innerText = entry.computerScore;
      dateCreated.innerText = new Date(entry.dateCreated).toLocaleString();
      
      row.appendChild(initials);
      row.appendChild(playerScore);
      row.appendChild(computerScore);
      row.appendChild(dateCreated);
      
      historyTable.appendChild(row);
    });
    
    // Append the history header and table to the parent element
    parent.appendChild(historyHeader);
    parent.appendChild(historyTable);
  }
  

export{ 
    renderComputerTracker, 
    renderPlayerTracker,
    renderCard, 
    renderEntry,
    renderButton, 
    removeByClassName, 
    renderWhoWin, 
    renderTextField,
    renderHistory
}