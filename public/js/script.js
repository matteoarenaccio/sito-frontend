document.addEventListener('DOMContentLoaded', () => {

    // --- GESTIONE REGISTRAZIONE ---
    const registerForm = document.getElementById('registerForm');
    const messaggioErrore = document.getElementById('messaggioErrore');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            console.log("Registrazione in corso");

            messaggioErrore.textContent = "";
            messaggioErrorePass.textContent = "";
            const emailValida = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passValida = /^(?=.*\d)(?=.*[A-Z])(?=.*[.,!$;]).{8,}$/;

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!emailValida.test(email)) {

                messaggioErrore.textContent = "Inserisci un indirizzo email valido.";
                return;
            }

            if (!passValida.test(password)){

                messaggioErrorePass.textContent = "Inserisci una password valida"
                return

            }

            const dati = {
                nome: document.getElementById('nome').value,
                cognome: document.getElementById('cognome').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
            };
            try {
                const response = await fetch('http://localhost:3000/api/invia-form', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dati)
                });

                const risultato = await response.json();

                if (risultato.success) {
                    window.location.href = "login.html";
                } else {
                    messaggioErrore.textContent = risultato.message
                }
            } catch (errore) {
                console.error('Errore durante la registrazione:', errore);
                messaggioErrore.textContent = "Errore di connessione al server";
            }
        });
    }

    // --- GESTIONE LOGIN ---
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const messErroreLogin = document.getElementById('messErroreLogin')
            messErroreLogin.textContent = "";

            try {
                const risposta = await fetch('http://localhost:3000/api/loginForm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const risultato = await risposta.json();

                if (risultato.success) {
                    localStorage.setItem('utenteLoggato', JSON.stringify(risultato.user));
                    window.location.href = 'dashboard.html';
                } else {
                    messErroreLogin.textContent = risultato.message;
                }
            } catch (errore) {
                console.error('Errore durante la richiesta di login:', errore);
            }
        });
    }
    
});


function togglePassword() {
  const input = document.getElementById('password');
  const icon = document.getElementById('toggleIcon');

  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}