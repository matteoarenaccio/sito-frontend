const express = require("express");
const app = express();
const PORTA = 3000;
const bcrypt = require("bcrypt");
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://avtxzwmvhygnrsogulbr.supabase.co";
const supabaseKey = "sb_publishable_L0f6pyFEmiJRKWn7w2qHOg_wl47Amtc";

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {

    res.sendFile(__dirname + "/public/index.html");

});

app.listen(PORTA, () => {

    console.log(`Server avviato su http://localhost:${PORTA}`);

});

require("dotenv").config();

const { Client } = require("pg");

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()
    .then(() => {
        console.log("✅ Database Supabase connesso!");
    })
    .catch((err) => {
        console.error("❌ Errore di connessione al DB:", err.message);
    });


// Rotta per ricevere i dati dal form e salvarli su Supabase
app.post('/api/invia-form', async (req, res) => {
    const { nome, cognome, email, password } = req.body;

    try {

        // 1. Controlla se l'email è già presente
        const { data: utenteEsistente, error: erroreControllo } = await supabase
            .from('utenti')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        if (erroreControllo) {
            console.error('Errore controllo email:', erroreControllo.message);

            return res.status(500).json({
                success: false,
                message: 'Errore durante il controllo dell\'email.'
            });
        }

        // 2. Se l'email esiste già
        if (utenteEsistente) {
            return res.status(409).json({
                success: false,
                message: 'Email già registrata.'
            });
        }

        // 3. Cifra la password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Inserisce il nuovo utente
        const { data, error } = await supabase
            .from('utenti')
            .insert([{
                nome,
                cognome,
                email,
                password: hashedPassword
            }])
            .select();

        if (error) {
            console.error('Errore Supabase:', error.message);

            return res.status(500).json({
                success: false,
                message: 'Errore durante la registrazione.'
            });
        }

        // 5. Registrazione completata
        res.json({
            success: true,
            message: 'Registrazione completata con successo!',
            data
        });

    } catch (err) {

        console.error('Errore server:', err);

        res.status(500).json({
            success: false,
            message: 'Errore interno del server.'
        });
    }
});


app.post('/api/loginForm', async (req, res) => {
    const { email, password } = req.body;

    console.log("Tentativo di login per:", email);

    try {
        // 1. Cerca l'utente nel database tramite nome_utente
        const { data: utente, error } = await supabase
            .from('utenti')
            .select('*')
            .eq('email', email)
            .single();

        // Se l'utente non esiste o c'è un errore
        if (error || !utente) {
            console.log("nome utente non esistente");
            return res.status(401).json({
                success: false,
                message: 'Nome utente o password non validi.'
            });
        }

        // 2. Confronta la password inserita con l'hash salvato nel DB
        const passwordCorretta = await bcrypt.compare(password, utente.password);

        if (!passwordCorretta) {
            return res.status(401).json({
                success: false,
                message: 'Nome utente o password non validi.'
            });
        }

        // 3. Login riuscito
        res.json({
            success: true,
            message: 'Login effettuato con successo!',
            user: {
                id: utente.id,
                nome: utente.nome,
                cognome: utente.cognome,
                email: utente.email
            }
        });

    } catch (err) {
        console.error('Errore durante il login:', err);
        res.status(500).json({
            success: false,
            message: 'Errore interno del server durante il login.'
        });
    }
});