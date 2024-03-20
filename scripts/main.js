// =============== Variables ==================
const task = document.querySelector(".name")
const date = document.querySelector(".date")
const description = document.querySelector(".description")
const ajouter = document.querySelector(".add")
const inTube = document.querySelector(".tasksInTube")
const sort = document.querySelector(".sort")

//============== Tableau d'objets ==========

let myTasks = []
// Le sigle || est un opérateur de coalescence nulle, il renvoie la première valeur qui est non falsy (c’est-à-dire différente de null, undefined, false, 0, NaN ou une chaîne vide)

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
        <div class="single-line" data-index="${index}"><details><summary><input type="checkbox" class="checkbox">${tabElement.name}</summary>
        <p>${tabElement.description}</p>
        </details><div class="end-side"><span class="date">${tabElement.day}/${tabElement.month +1}/${tabElement.year}</span><span class="delete" style="cursor:pointer">❌</span></div></div>
        `
        })
    };
}

const deleteTask = (lineToKill) => {
    myTasks.splice(lineToKill, 1)
    printTasks(myTasks)
    localStorage.setItem('tâches', JSON.stringify(myTasks))
}

const sortTasks = (tab) => {
    tab.sort((a, b) => a.date - b.date);
    return tab;
}

//============== EVENTS =================

// *** permet d'afficher les tâches à l'ouverture de la page si éventuellement des tâches ont déjà été stockées dans l'espace local
myTasks = JSON.parse(localStorage.getItem('tâches')) || []
printTasks(myTasks)

// *** permet d'associer une action au clic sur le bouton "AJOUTER"
ajouter.addEventListener('click', () => {

    // *** on saucissonne la date pour en extraire le jour, le mois et l'année. Données qu'on injectera dans la liste avec une syntaxe adaptée au format de lecture des utilisateurs francophones.
    let objectDate = new Date(date.value);
    console.log(objectDate);
    let day = objectDate.getDate()
    let month = objectDate.getMonth()
    let year = objectDate.getFullYear()
    console.log(day);
    console.log(month);
    console.log(year);

    addNewTask(task.value, objectDate, day, month, year, description.value);
    printTasks(myTasks)
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

// *** ❌ permet d'éliminer une tâche au clic sur la ❌ associée à cette tâche
inTube.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete')) {
      let placeDansTableau = parseInt(e.target.parentElement.getAttribute('data-index'))
      deleteTask(placeDansTableau)
    }
  });