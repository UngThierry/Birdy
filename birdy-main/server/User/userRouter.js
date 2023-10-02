/***************************************************************************************
 * Définit un routeur qui gère tous les services en lien avec la ressource utilisateur *
 ***************************************************************************************/
const express = require('express');
const dataB = require('../server.js');
const User = require('./User.js').default;

const router = express.Router();
router.use(express.json());
let user = new User(dataB);

// Service login/logout
router.get('/login', (req, res) => { 
    res.send("Vous êtes sur la page de login.") 
});

router.post('/login', (req, res) => {
    user.login(req, res);
});

router.get('/logout', (req, res) => {
    user.logout(req, res);
    //res.redirect('login');
});


// Ajout d'utilisateur
router.post('/Register', (req, res) => {
    user.addUser(req, res);
});

// Suppression d'utilisateur
router.get('/deleteUser', (req, res) => {
    user.deleteUser(req, res);
});

// Modification du mot de passe
router.post('/passwordReset', (req, res) => {
    user.passwordReset(req, res);
});

// Récupération des infos des utilisateurs
router.post('/name', (req, res) => {
    user.getUsername(req, res);
});

router.get('/', (req, res) => {
    user.getOwnUsername(req, res);
})

router.post('/', (req, res) => {
    user.getInfos(req, res);
});



module.exports = router;
