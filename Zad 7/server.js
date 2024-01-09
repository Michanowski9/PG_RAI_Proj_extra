const express = require('express'); // Importuje framework Express.js
const passport = require('passport'); // Importuje moduł Passport do uwierzytelniania
const GoogleStrategy = require('passport-google-oauth20').Strategy; // Importuje strategię uwierzytelniania Google dla Passport
const session = require('express-session'); // Importuje moduł sesji dla Express

const app = express(); // Tworzy instancję aplikacji Express

app.use(session({ secret: 'secret-key', resave: true, saveUninitialized: true })); // Konfiguruje sesję Express z sekretem i opcjami resave i saveUninitialized

app.use(passport.initialize()); // Inicjalizuje Passport
app.use(passport.session()); // Ustawia obsługę sesji dla Passport

passport.use(new GoogleStrategy({ // Konfiguruje strategię uwierzytelniania Google dla Passport
    clientID: '...',
    clientSecret: '...',
    callbackURL: 'http://127.0.0.1:3000/auth/callback'
  },
  function(accessToken, refreshToken, profile, done) { // Funkcja zwrotna wywoływana po pomyślnym uwierzytelnianiu przez Google
    const user = {
      googleId: profile.id,
      displayName: profile.displayName,
    };

    return done(null, user); // Zwraca użytkownika do Passport
  }
));

passport.serializeUser((user, done) => done(null, user)); // Serializuje użytkownika do sesji
passport.deserializeUser((obj, done) => done(null, obj)); // Deserializuje użytkownika z sesji

app.get('/', (req, res) => { // Obsługuje żądanie GET na głównej stronie
  res.send('Welcome! <a href="/auth">Login with Google</a>');
});

app.get('/auth', // Obsługuje żądanie GET na ścieżce /auth, rozpoczynając proces uwierzytelniania
  passport.authenticate('google', { scope: ['profile'] })
);

app.get('/auth/callback', // Obsługuje żądanie GET na ścieżce /auth/callback, po pomyślnym uwierzytelnianiu
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

app.get('/profile', (req, res) => { // Obsługuje żądanie GET na ścieżce /profile, wyświetla profil użytkownika
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.send(`<h1>Profile</h1>
    <p>Welcome, ${req.user.displayName}!</p>
    <p>Your Google ID: ${req.user.googleId}</p>
    <p><a href="/logout">Logout</a></p>`);
});

app.get('/logout', (req, res) => { // Obsługuje żądanie GET na ścieżce /logout, przekierowuje użytkownika na stronę główną
  res.redirect('/');
});

const port = process.env.PORT || 3000; // Ustala numer portu zmienną środowiskową lub domyślnie 3000
app.listen(port, () => { // Uruchamia serwer na określonym porcie
  console.log(`Server is running on port ${port}`);
});