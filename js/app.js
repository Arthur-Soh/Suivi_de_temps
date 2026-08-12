// ==========================================
// 1. VÉRIFICATION DE LA CONNEXION
// ==========================================

const loggedUser = localStorage.getItem("loggedUser");


// Si aucun utilisateur n'est connecté,
// on retourne à la page de connexion.

if (!loggedUser) {

    window.location.href = "index.html";

}



// ==========================================
// 2. MESSAGE DE BIENVENUE
// ==========================================

const welcomeMessage =
    document.getElementById("welcomeMessage");

welcomeMessage.textContent =
    `Bienvenue ${loggedUser} 👋`;



// ==========================================
// 3. LISTE DES PROJETS ET DES PHASES
// ==========================================

// Les projets sont codés en dur,
// comme demandé dans le cahier des charges.

const projects = {

    "Projet Paris": [
        "Analyse",
        "Développement",
        "Tests",
        "Réunion"
    ],

    "Projet Sartrouville": [
        "Conception",
        "Développement",
        "Tests",
        "Documentation"
    ],

    "Projet 1001VH": [
        "Maintenance",
        "Correction",
        "Support"
    ]

};



// ==========================================
// 4. RÉCUPÉRATION DES ÉLÉMENTS HTML
// ==========================================

const projectSelect =
    document.getElementById("project");

const phaseSelect =
    document.getElementById("phase");

const activityForm =
    document.getElementById("activityForm");

const activitiesTable =
    document.getElementById("activitiesTable");

const totalHours =
    document.getElementById("totalHours");

const logoutButton =
    document.getElementById("logoutButton");



// ==========================================
// 5. REMPLIR LA LISTE DES PROJETS
// ==========================================

Object.keys(projects).forEach(function(project) {

    const option =
        document.createElement("option");

    option.value = project;

    option.textContent = project;

    projectSelect.appendChild(option);

});



// ==========================================
// 6. CHANGEMENT DE PROJET
// ==========================================

projectSelect.addEventListener(
    "change",
    function() {

        // Projet sélectionné

        const selectedProject =
            projectSelect.value;


        // On vide les anciennes phases

        phaseSelect.innerHTML =
            '<option value="">Sélectionner une phase</option>';


        // Si aucun projet n'est sélectionné,
        // on ne fait rien.

        if (!selectedProject) {

            return;

        }


        // Récupération des phases du projet

        const phases =
            projects[selectedProject];


        // Ajout des phases dans le select

        phases.forEach(function(phase) {

            const option =
                document.createElement("option");

            option.value = phase;

            option.textContent = phase;

            phaseSelect.appendChild(option);

        });

    }
);



// ==========================================
// 7. RÉCUPÉRATION DES ACTIVITÉS
// ==========================================

// Chaque utilisateur possède son propre historique.
//
// Exemple :
// activities_arthur
// activities_user2

let activities =
    JSON.parse(
        localStorage.getItem(
            `activities_${loggedUser}`
        )
    ) || [];



// ==========================================
// 8. ENREGISTRER UNE ACTIVITÉ
// ==========================================

activityForm.addEventListener(
    "submit",
    function(event) {

        // Empêche le formulaire
        // de recharger la page.

        event.preventDefault();


        // Récupération des valeurs

        const week =
            document.getElementById("week").value;

        const project =
            projectSelect.value;

        const phase =
            phaseSelect.value;

        const duration =
            Number(
                document.getElementById("duration").value
            );


        // Création de l'activité

        const activity = {

            id: Date.now(),

            week: week,

            project: project,

            phase: phase,

            duration: duration

        };


        // Ajout dans notre tableau

        activities.push(activity);


        // Sauvegarde

        saveActivities();


        // Actualisation du tableau

        displayActivities();


        // Réinitialisation du formulaire

        activityForm.reset();


        // Réinitialisation des phases

        phaseSelect.innerHTML =
            '<option value="">Sélectionner une phase</option>';

    }
);



// ==========================================
// 9. SAUVEGARDER LES ACTIVITÉS
// ==========================================

function saveActivities() {

    localStorage.setItem(

        `activities_${loggedUser}`,

        JSON.stringify(activities)

    );

}



// ==========================================
// 10. AFFICHER LES ACTIVITÉS
// ==========================================

function displayActivities() {

    // On vide le tableau

    activitiesTable.innerHTML = "";


    // Total des heures

    let total = 0;


    // Si aucune activité

    if (activities.length === 0) {

        activitiesTable.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align:center;"
                >
                    Aucune activité enregistrée.
                </td>

            </tr>

        `;

    }


    // Parcours des activités

    activities.forEach(function(activity) {

        total += activity.duration;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${activity.week}
            </td>

            <td>
                ${activity.project}
            </td>

            <td>
                ${activity.phase}
            </td>

            <td>
                ${activity.duration} h
            </td>

            <td>

                <button
                    type="button"
                    class="delete-button"
                    onclick="deleteActivity(${activity.id})"
                >
                    Supprimer
                </button>

            </td>

        `;


        activitiesTable.appendChild(row);

    });


    // Affichage du total

    totalHours.textContent =
        total.toFixed(2);

}



// ==========================================
// 11. SUPPRIMER UNE ACTIVITÉ
// ==========================================

function deleteActivity(id) {

    activities =
        activities.filter(function(activity) {

            return activity.id !== id;

        });


    saveActivities();

    displayActivities();

}



// ==========================================
// 12. DÉCONNEXION
// ==========================================

logoutButton.addEventListener(
    "click",
    function() {

        // Suppression de l'utilisateur connecté

        localStorage.removeItem("loggedUser");


        // Retour à la page de connexion

        window.location.href =
            "index.html";

    }
);



// ==========================================
// 13. INITIALISATION
// ==========================================

// Quand la page est chargée,
// on affiche les activités déjà sauvegardées.

displayActivities();

// ==========================================
// 12. EXPORT EXCEL
// ==========================================

function exportToExcel() {

    // Vérifie qu'il existe des données
    if (activities.length === 0) {

        alert("Aucune activité à exporter.");

        return;
    }


    // Vérifie que la bibliothèque Excel est disponible
    if (typeof XLSX === "undefined") {

        alert(
            "Impossible de générer le fichier Excel."
        );

        return;
    }


    // Préparation des données Excel

    const excelData =
        activities.map(function(activity) {

            return {

                "Semaine":
                    activity.week,

                "Projet":
                    activity.project,

                "Phase / Activité":
                    activity.phase,

                "Temps passé (heures)":
                    activity.duration

            };

        });


    // Création de la feuille Excel

    const worksheet =
        XLSX.utils.json_to_sheet(
            excelData
        );


    // Calcul du total

    const total =
        activities.reduce(
            function(sum, activity) {

                return sum + activity.duration;

            },
            0
        );


    // Ajout du total dans le fichier Excel

    XLSX.utils.sheet_add_aoa(
        worksheet,

        [
            [],
            [
                "Total des heures",
                total
            ]
        ],

        {
            origin: -1
        }
    );


    // Largeur des colonnes

    worksheet["!cols"] = [

        { wch: 15 },

        { wch: 20 },

        { wch: 25 },

        { wch: 22 }

    ];


    // Création du classeur

    const workbook =
        XLSX.utils.book_new();


    // Ajout de la feuille

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Suivi des temps"
    );


    // Date de génération

    const date =
        new Date()
            .toISOString()
            .slice(0, 10);


    // Nom du fichier

    const filename =
        `suivi_temps_${loggedUser}_${date}.xlsx`;


    // Téléchargement

    XLSX.writeFile(
        workbook,
        filename
    );
}


// ==========================================
// BOUTON EXPORT
// ==========================================

exportExcelButton.addEventListener(
    "click",
    exportToExcel
);
