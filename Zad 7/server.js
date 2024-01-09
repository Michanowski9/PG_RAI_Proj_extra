const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const app = express();

app.use(session({ secret: 'secret-key', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: '...',
    clientSecret: '...',
    callbackURL: 'http://127.0.0.1:3000/auth/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    const user = {
      googleId: profile.id,
      displayName: profile.displayName,
    };

    return done(null, user);
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.get('/', (req, res) => {
  res.send('Welcome! <a href="/auth">Login with Google</a>');
});

app.get('/auth',
  passport.authenticate('google', { scope: ['profile'] })
);

app.get('/auth/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.send(`<h1>Profile</h1>
    <p>Welcome, ${req.user.displayName}!</p>
    <p>Google ID: ${req.user.googleId}</p>
    <p><a href="/logout">Logout</a></p>`);
});

app.get('/logout', (req, res) => {
  res.redirect('/');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
