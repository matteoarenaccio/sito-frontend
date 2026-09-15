document.addEventListener('DOMContentLoaded', () => {
  // 1. Recupera la stringa dal localStorage
  const utenteDati = localStorage.getItem('utenteLoggato');

  // Controllo di sicurezza: se l'utente non è loggato, rimandalo alla pagina di login
  if (!utenteDati) {
    alert("Devi prima effettuare il login!");
    window.location.href = 'login.html';
    return;
  }

  // 2. Converte la stringa JSON di nuovo in un oggetto JavaScript
  const utente = JSON.parse(utenteDati);

  // 3. Inserisce i dati negli elementi HTML della card
  document.getElementById('infoNome').textContent = utente.nome || 'N/D';
  document.getElementById('infoCognome').textContent = utente.cognome || 'N/D';
  document.getElementById('infoEmail').textContent = utente.email || 'N/D';

  // 4. Gestione del pulsante di Logout
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      // Rimuove i dati dal browser e reindirizza al login
      localStorage.removeItem('utenteLoggato');
      window.location.href = 'login.html';
    });
  }
});