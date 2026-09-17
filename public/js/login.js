document.addEventListener('DOMContentLoaded', () => {

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
                const risposta = await fetch('https://sito-backend.onrender.com/api/loginForm', {
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