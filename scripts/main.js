// =============== Variables ==================
const task = document.querySelector(".name")
const date = document.querySelector(".date")
const description = document.querySelector(".description")
const ajouter = document.querySelector(".add")
const inTube = document.querySelector(".tasksInTube")
const doneTube = document.querySelector(".numberOfTasks")
const sort = document.querySelector(".sort")
let draggedItem = null;


//============== Tableau d'objets ==========

let myTasks = []
let myFinishedTasks = []

//============== FONCTIONS =================

// *** ajoute une nouvelle tâche dans le tableau d'objet et sauve ce tab dans le localStorage
const addNewTask = (quoi, quand, jour, mois, année, comment) => {
    let newTaskLine = {
        name : quoi,
        date : quand,
        day : jour,
        month : mois,
        year : année,
        description : comment,
    }
    myTasks.push(newTaskLine)
    localStorage.setItem('tâches', JSON.stringify(myTasks))
    console.log(myTasks);
}
// *** affiche les tâches dans le partie "tube"
const printTasks = (tab) => {
    if (tab.length === 0) {
        inTube.innerHTML = `No task in the tube`
    }

    else { 
        inTube.innerHTML = ''
        tab.forEach((tabElement, index) => {
        inTube.innerHTML +=
        `
        <li id="single-line" data-index="${index}" draggable="true"><details><summary><input type="checkbox" class="checkbox">${tabElement.name}</summary>
        <p>${tabElement.description}</p>
        </details><div class="end-side"><span class="day">${tabElement.day}</span>/<span class="month">${tabElement.month +1}</span>/<span class="year">${tabElement.year}</span><span class="delete" style="cursor:pointer">🗑️</span></div></li>
        `
        /*const checkbox = doneTube.querySelector('.checkbox')
        checkbox.cheked = true;*/
        })
    };
}
const addFinishedTask = (quoi, quand, jour, mois, année, comment) => {
    let newTaskLine = {
        name : quoi,
        date : quand,
        day : jour,
        month : mois,
        year : année,
        description : comment,
    }
    myFinishedTasks.push(newTaskLine)
    localStorage.setItem('tâches_finies', JSON.stringify(myFinishedTasks))
    console.log(myFinishedTasks);
}

const printFinishedTasks = (tab) => {
    if (tab.length === 0) {
        doneTube.innerHTML = `No task done`
    }

    else { 
        doneTube.innerHTML = ''
        tab.forEach((tabElement, index) => {
        doneTube.innerHTML +=
        `
        <div id="single-line" data-index="${index}"><div class="start-side"><input type="checkbox" class="checkbox" checked>${tabElement.name}</div>
        <div class="end-side"><span class="delete" style="cursor:pointer">🗑️</span></div></div>
        `

        })
    }

    if (myFinishedTasks.length > 5) {
        myFinishedTasks.splice(0, 1)
        printFinishedTasks(myFinishedTasks)
        localStorage.setItem('tâches_finies', JSON.stringify(myFinishedTasks))
    }
}
// *** supprime la tâche sur laquelle on a cliqué en fonction de sa place dans le tableau d'objets
const deleteTask = (lineToKill) => {
    myTasks.splice(lineToKill, 1)
    printTasks(myTasks)
    localStorage.setItem('tâches', JSON.stringify(myTasks))
}
// *** supprime la tâche finie sur laquelle on a cliqué en fonction de sa place dans le tableau d'objets dans la section DONE
const deleteFinishedTask = (lineToKill) => {
    myFinishedTasks.splice(lineToKill, 1)
    localStorage.setItem('tâches_finies', JSON.stringify(myFinishedTasks))
    printFinishedTasks(myFinishedTasks)
}

// *** classe les tâches en fonction de leur date d'échéance respective
const sortTasks = (tab) => {
    //on formate la date vers une syntaxe standard avec new Date() pour que toutes les dates soient au même format avant que le tri s'effectue
    tab.sort((a, b) => {
        let dateA = new Date(a.date)
        let dateB = new Date(b.date)
        return dateA - dateB;
    });
    
}

//============== EVENTS =================

// *** permet d'afficher les tâches à l'ouverture de la page si éventuellement des tâches ont déjà été stockées dans l'espace local
myTasks = JSON.parse(localStorage.getItem('tâches')) || []
printTasks(myTasks)
myFinishedTasks = JSON.parse(localStorage.getItem('tâches_finies')) || []
printFinishedTasks(myFinishedTasks)
console.log(`Mon tableau au rafraichissement :${myTasks}`);
console.log(myTasks);
// Le sigle || est un opérateur de coalescence nulle, il renvoie la première valeur qui est non falsy (c’est-à-dire différente de null, undefined, false, 0, NaN ou une chaîne vide)

// *** permet d'associer une action au clic sur le bouton "AJOUTER"
ajouter.addEventListener('click', () => {

    // *** on saucissonne la date pour en extraire le jour, le mois et l'année. Données qu'on injectera dans la liste avec une syntaxe adaptée au format de lecture des utilisateurs francophones.
    let objectDate = new Date(date.value);
    let formattedDate = objectDate.toISOString().substring(0,10);
    console.log(objectDate);
    let day = objectDate.getDate()
    let month = objectDate.getMonth()
    let year = objectDate.getFullYear()
    console.log(day);
    console.log(month);
    console.log(year);

    addNewTask(task.value, formattedDate, day, month, year, description.value);
    printTasks(myTasks)
    console.log(`Mon tableau à l'ajout d'une tâche :${myTasks}`)
    console.log(myTasks);
    task.value = ""
    date.value = ""
    description.value = ""
});

// ** tri des tâches en fonction de leur date, lors du clic sur le bouton "TRIER"
sort.addEventListener('click', () => {
    sortTasks(myTasks)
    printTasks(myTasks)
    localStorage.setItem('tâches', JSON.stringify(myTasks))
    console.log(myTasks);
})

// *** permet d'éliminer une tâche au clic sur la 🗑️ associée à cette tâche
inTube.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete')) {
      let placeDansTableau = parseInt(e.target.closest('#single-line').getAttribute('data-index'))
      console.log(placeDansTableau);
      deleteTask(placeDansTableau)
    }
  });
// ***  permet de déplacer une tâche cochée et donc finie vers la partie DONE
inTube.addEventListener('click', (event) => {

    if (event.target.checked) {

        let placeDansTableau = parseInt(event.target.closest('#single-line').getAttribute('data-index'))
        console.log(placeDansTableau);

        let description = myTasks[placeDansTableau].description
        let name = myTasks[placeDansTableau].name
        let day = myTasks[placeDansTableau].day
        let month = myTasks[placeDansTableau].month
        let year = myTasks[placeDansTableau].year
        let formattedDate = myTasks[placeDansTableau].date

        addFinishedTask(name, formattedDate, day, month, year, description);
        printFinishedTasks(myFinishedTasks)

        deleteTask(placeDansTableau)
        // La case à cocher est cochée
        console.log("La case à cocher est cochée !");
        console.log(myFinishedTasks);
    } 
    else {
        // La case à cocher est décochée
        console.log("La case à cocher est décochée !");
        // Ajoutez ici le code que vous souhaitez exécuter
    }
  
  });
// ***  permet de supprimer une tâche présente dans la partie DONE 
doneTube.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        let placeDansTableau = parseInt(e.target.closest('#single-line').getAttribute('data-index'))
      console.log(placeDansTableau);
      deleteFinishedTask(placeDansTableau)
    }
  });

 // ***  permet de décocher une case et d'enclecher son déplacement automatique vers la partie InTube (la section des tâches toujours en cours)
doneTube.addEventListener('click', (event) => {
    if (!event.target.checked) {
        let placeDansTableau = parseInt(event.target.closest('#single-line').getAttribute('data-index'))
        console.log(placeDansTableau);

        let description = myFinishedTasks[placeDansTableau].description
        let name = myFinishedTasks[placeDansTableau].name
        let day = myFinishedTasks[placeDansTableau].day
        let month = myFinishedTasks[placeDansTableau].month
        let year = myFinishedTasks[placeDansTableau].year
        let formattedDate = myFinishedTasks[placeDansTableau].date

        addNewTask(name, formattedDate, day, month, year, description);
        printTasks(myTasks)

        deleteFinishedTask(placeDansTableau)
        // La case à cocher est décochée
        console.log("La case à cocher est décochée !");
    }
    else {
        
        console.log("La case à cocher est cochée !");
        // Ajoutez ici le code que vous souhaitez exécuter
    }
})

// ***  permet d'initialiser un effet drag & drop, dans la section inTube
inTube.addEventListener(
    "dragstart",
    (e) => {
        draggedItem = e.target;
        setTimeout(() => {
            e.target.style.display =
                "none";
        }, 0);
});
 
inTube.addEventListener(
    "dragend",
    (e) => {
        setTimeout(() => {
            e.target.style.display = "";
            draggedItem = null;
        }, 0);
});
 
inTube.addEventListener(
    "dragover",
    (e) => {
        e.preventDefault();
        const afterElement =
            getDragAfterElement(
                inTube,
                e.clientY);
        const currentElement =
            document.querySelector(
                ".dragging");
        if (afterElement == null) {
            inTube.appendChild(
                draggedItem
            );} 
        else {
            inTube.insertBefore(
                draggedItem,
                afterElement
            );}
    });
 
const getDragAfterElement = (
    container, y
) => {
    const draggableElements = [
        ...container.querySelectorAll(
            "li:not(.dragging)"
        ),];
 
    return draggableElements.reduce(
        (closest, child) => {
            const box =
                child.getBoundingClientRect();
            const offset =
                y - box.top - box.height / 2;
            if (
                offset < 0 &&
                offset > closest.offset) {
                return {
                    offset: offset,
                    element: child,
                };} 
            else {
                return closest;
            }},
        {
            offset: Number.NEGATIVE_INFINITY,
        }
    ).element;
};
