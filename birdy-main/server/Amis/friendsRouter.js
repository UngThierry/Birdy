const express = require('express');
const dataB = require('../server.js');
const Friend = require('./Friends.js').default;

const router = express.Router();
router.use(express.json());
let friend = new Friend(dataB);

// Ajout d'un ami
router.post('/addFriend', (req, res) => {
    friend.addFriend(req, res);
});

// Suppression d'un ami
router.post('/deleteFriend', (req, res) => {
    friend.deleteFriend(req, res);
});

// récupération de la liste des amis
router.post('/', (req, res) => {
    friend.getFriends(req, res);
});

module.exports = router;