const express = require('express');
const Posts = require('./Posts.js').default;
const postDataBase = require('./postDataBase.js').default;

const router = express.Router();
router.use(express.json());

const dataB = new postDataBase();
let posts = new Posts(dataB);

// Ajout d'un message
router.post('/addPost', (req, res) => {
    posts.addMessage(req, res);
});

// Suppression d'un message
router.post('/deletePost', (req, res) => {
    posts.deleteMessage(req, res);
});

// Modification d'un message
router.post('/modPost', (req, res) => {
    posts.modifierMessage(req, res);
});

// Récupération des messages d'un utilisateur
router.post('/getPosts', (req, res) => {
    posts.getMessages(req, res);
});

// Ajout d'un like sur un message
router.post('/like', (req, res) => {
    posts.addLike(req, res);
});

// Ajout d'un commentaire sur un message
router.post('/comment', (req, res) => {
    posts.addComment(req, res);
});

// Récupération de l'identifiant d'un message
router.post('/getMessageID', (req, res) => {
    posts.getID(req, res);
});

// Récupération de tous les messages
router.get('/', (req, res) => {
    posts.getAllMessages(req, res);
});

module.exports = router;