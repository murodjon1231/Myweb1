document.addEventListener('DOMContentLoaded', function () {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmButton = document.getElementById('confirmButton');

    const users = [
        { name: "Murod", surname: "Shavkatov",  password: "0890" },
        { name: "Abdumalik", surname: "Ergashev",  password: "1234" },
        { name: "Bobur", surname: "Rahxmatov",  password: "2222" },
        { name: "Bakhodir", surname: " Abdukakhkhorov",  password: "0000" },
        { name: "Davron", surname: "Rasulyev",  password: "1111" }
    ];

    function checkInputs() {
        if (usernameInput.value.trim() !== '' && passwordInput.value.trim() !== '') {
            confirmButton.classList.add('enabled'); 
        } else {
            confirmButton.classList.remove('enabled'); 
        }
    }

    usernameInput.addEventListener('input', checkInputs);
    passwordInput.addEventListener('input', checkInputs);
});

function submitForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = [
        { name: "Murod", surname: "Shavkatov",  password: "0890" },
        { name: "Abdumalik", surname: "Ergashev",  password: "1234" },
        { name: "Bobur", surname: "Rahxmatov",  password: "2222" },
        { name: "Bakhodir", surname: " Abdukakhkhorov",  password: "0000" },
        { name: "Davron", surname: "Rasulyev",  password: "1111" }
    ];

    const user = users.find(
        u => u.name === username && u.password === password
    );

    if (user) {
        localStorage.setItem('username', user.name);
        localStorage.setItem('surname', user.surname);
        localStorage.setItem('group', user.group);
        localStorage.setItem('coin', user.coin);
        localStorage.setItem('htp', user.htp);

        window.location.href = 'index2.html';
    } else {
        alert('Invalid username or password');
    }
}

document.getElementById('hide').addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
});
