// ==========================================
// 1. VÉRIFICATION DE LA CONNEXION
// ==========================================

const loggedUser = localStorage.getItem("loggedUser");

if (!loggedUser) {
    window.location.href = "index.html";
}


// ==========================================
// 2. MESSAGE DE BIENVENUE
// ==========================================

const welcomeMessage = document.getElementById("welcomeMessage");
welcomeMessage.textContent = `Bienvenue ${loggedUser} 👋`;


// ==========================================
// 3. LISTE DES PROJETS ET DES PHASES
// ==========================================

const projects = {
    "Projet Paris": ["Analyse", "Développement", "Tests", "Réunion"],
    "Projet Sartrouville": ["Conception", "Développement", "Tests", "Documentation"],
    "Projet 1001VH": ["Maintenance", "Correction", "Support"]
};


// ==========================================
// 4. RÉCUPÉRATION DES ÉLÉMENTS HTML
// ==========================================

const projectSelect = document.getElementById("project");
const phaseSelect = document.getElementById("phase");
const activityForm = document.getElementById("activityForm");
const activitiesTable = document.getElementById("activitiesTable");
const totalHours = document.getElementById("totalHours");
const logoutButton = document.getElementById("logoutButton");
const searchProject = document.getElementById("searchProject");
const exportExcelButton = document.getElementById("exportExcelButton");


// ==========================================
// 5. REMPLIR LA LISTE DES PROJETS
// ==========================================

Object.keys(projects).forEach(function(project) {
    const option = document.createElement("option");
    option.value = project;
    option.textContent = project;
    projectSelect.appendChild(option);
});


// ==========================================
// 6. CHANGEMENT DE PROJET
// ==========================================

projectSelect.addEventListener("change", function() {
    const selectedProject = projectSelect.value;
    phaseSelect.innerHTML = '<option value="">Sélectionner une phase</option>';

    if (!selectedProject) {
        return;
    }

    const phases = projects[selectedProject];
    phases.forEach(function(phase) {
        const option = document.createElement("option");
        option.value = phase;
        option.textContent = phase;
        phaseSelect.appendChild(option);
    });
});


// ==========================================
// 7. RÉCUPÉRATION DES ACTIVITÉS
// ==========================================

let activities = JSON.parse(localStorage.getItem(`activities_${loggedUser}`)) || [];


// ==========================================
// 8. ENREGISTRER UNE ACTIVITÉ
// ==========================================

activityForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const week = document.getElementById("week").value;
    const project = projectSelect.value;
    const phase = phaseSelect.value;
    const duration = Number(document.getElementById("duration").value);

    const activity = {
        id: Date.now(),
        week: week,
        project: project,
        phase: phase,
        duration: duration
    };

    activities.push(activity);
    saveActivities();
    displayActivities();
    activityForm.reset();
    phaseSelect.innerHTML = '<option value="">Sélectionner une phase</option>';
});


// ==========================================
// 9. SAUVEGARDER LES ACTIVITÉS
// ==========================================

function saveActivities() {
    localStorage.setItem(`activities_${loggedUser}`, JSON.stringify(activities));
}


// ==========================================
// 10. AFFICHER LES ACTIVITÉS
// ==========================================

function displayActivities() {
    activitiesTable.innerHTML = "";
    let total = 0;

    const searchTerm = searchProject.value.trim().toLowerCase();

    const filteredActivities = activities.filter(function(activity) {
        return activity.project.toLowerCase().includes(searchTerm);
    });

    if (filteredActivities.length === 0) {
        activitiesTable.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    Aucune activité trouvée.
                </td>
            </tr>
        `;
    }

    filteredActivities.forEach(function(activity) {
        total += activity.duration;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${activity.week}</td>
            <td>${activity.project}</td>
            <td>${activity.phase}</td>
            <td>${activity.duration} h</td>
            <td>
                <button type="button" class="delete-button" onclick="deleteActivity(${activity.id})">
                    Supprimer
                </button>
            </td>
        `;
        activitiesTable.appendChild(row);
    });

    totalHours.textContent = total.toFixed(2);
}


// ==========================================
// 11. SUPPRIMER UNE ACTIVITÉ
// ==========================================

function deleteActivity(id) {
    activities = activities.filter(function(activity) {
        return activity.id !== id;
    });
    saveActivities();
    displayActivities();
}


// ==========================================
// 12. DÉCONNEXION
// ==========================================

logoutButton.addEventListener("click", function() {
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";
});


// ==========================================
// 13. RECHERCHE PAR PROJET
// ==========================================

searchProject.addEventListener("input", displayActivities);


// ==========================================
// 14. EXPORT EXCEL
// ==========================================

function exportToExcel() {
    if (activities.length === 0) {
        alert("Aucune activité à exporter.");
        return;
    }

    if (typeof XLSX === "undefined") {
        alert("Impossible de générer le fichier Excel.");
        return;
    }

    const excelData = activities.map(function(activity) {
        return {
            "Semaine": activity.week,
            "Projet": activity.project,
            "Phase / Activité": activity.phase,
            "Temps passé (heures)": activity.duration
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const total = activities.reduce(function(sum, activity) {
        return sum + activity.duration;
    }, 0);

    XLSX.utils.sheet_add_aoa(worksheet, [[], ["Total des heures", total]], { origin: -1 });

    worksheet["!cols"] = [{ wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 22 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Suivi des temps");

    const date = new Date().toISOString().slice(0, 10);
    const filename = `suivi_temps_${loggedUser}_${date}.xlsx`;

    XLSX.writeFile(workbook, filename);
}

exportExcelButton.addEventListener("click", exportToExcel);


// ==========================================
// 15. INITIALISATION
// ==========================================

displayActivities();
