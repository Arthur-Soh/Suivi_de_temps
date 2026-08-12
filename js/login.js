const users = [
    {
        username: "PaulB",
        password: "eclipse"
    },
    {
        username: "MarcW",
        password: "eclipse"
    }
];

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = users.find(
        user =>
            user.username === username &&
            user.password === password
    );

    if (user) {

        localStorage.setItem("loggedUser", username);

        window.location.href = "Principal.html";

    } else {

        loginError.textContent =
            "Identifiant ou mot de passe incorrect.";

    }

});
