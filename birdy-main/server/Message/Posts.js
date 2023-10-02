const dataBaseUsers = require('../server.js');
const { use } = require('../User/userRouter.js');


class Posts {

    constructor(dataB) {
        this.dataB = dataB;
    }


    /**
     * Ajoute un message à la base de données.
     * @param {Request} req la requête de l'utilisateur
     * @param {Response} res la réponse du serveur
     */
    addMessage(req, res) {
        let id = req.session.userid;
        if (! id) {
            res.status(403).json({
                status: 403,
                message: "Veuillez vous authentifier"
            });
            return;
        }
        
        const { post } = req.body;
        if (! post) {
            res.status(400).json({
                status: 400,
                message: "Formulaire invalide : message vide"
            });
            return;
        }

        let user = dataBaseUsers.getUsername(id);
        user.then((value) => {
            if (! value) {
                res.status(500).json({
                    status: 500,
                    message: "Erreur BD : l'utilisateur n'a pas été trouvé"
                });
                return;
            }

            this.dataB.addMessage(post, id, value)
                .then((val) => {
                    res.status(200).json({
                        status: 200,
                        message: "Post correctement ajouté"
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        status: 500,
                        message: `Erreur BD : ${err}`
                    });
                });
        })
        .catch((err) => {
            res.status(500).json({
                status: 500,
                message: `Erreur BD : ${err}`
            });
        });
    }
    

    /**
     * Supprime le message de l'utilisateur (authentifié) s'il a les droits dessus.
     * @param {Request} req la requête de l'utilisateur
     * @param {Result} res la réponse du serveur
     */
    deleteMessage(req, res) {
        let id = req.session.userid;
        if (! id) {
            res.status(403).json({
                status: 403,
                message: "Veuillez vous authentifier"
            });
            return;
        }

        const { msg_id } = req.body;
        if (! msg_id) {
            res.status(400).json({
                status: 400,
                message: "Formulaire invalide : message vide"
            });
            return;
        }

        this.dataB.deleteMessage(msg_id)
            .then((value) => {
                if (value)
                    res.status(200).json({
                        status: 200,
                        message: "Post correctement supprimé"
                    });
                
                    if (! value)
                        res.status(500).json({
                            status: 500,
                            message: "Erreur lors de la suppression du message"
                        });
            })
            .catch((err) => {
                res.status(500).json({
                    status: 500,
                    message: `Erreur DB : ${err}`
                });
            });
    }

    
    /**
     * Permet à un utilisateur authentifié de modifier un de ses messages
     * @param {Request} req la requête de l'utilisateur
     * @param {Response} res la réponse du serveur
     */
    modifierMessage(req, res) {
        let id = req.session.userid;
        if (! id) {
            res.status(403).json({
                status: 403,
                message: "Veuillez vous authentifier"
            });
            return;
        }

        const { newPost, msg_id } = req.body;
        if (! newPost || ! msg_id) {
            res.status(400).json({
                status: 400,
                message: "Formulaire invalide"
            });
        }

        this.dataB.modifierMessage(msg_id, newPost)
            .then((value) => {
                if (value)
                    res.status(200).json({
                        status: 200,
                        message: "Post correctement modifié"
                    });
                if (! value)
                    res.status(500).json({
                        status: 500,
                        message: "Erreur lors de la modification du message"
                    });
            })
            .catch((err) => {
                res.status(500).json({
                    status: 500,
                    message: `Erreur DB : ${err}`
                });
            });
    }


    /**
     * Permet à un utilisateur de récupérer tous les messages de l'utilisateur dont l'identifiant est fourni dans le corps
     * de la requête.
     * @param {Request} req la requête de l'utilisateur
     * @param {Response} res la réponse du serveur
     */
    getMessages(req, res) {

        let id = req.session.userid;
        if (! id) {
            res.status(403).json({
                status: 403,
                message: "Veuillez vous authentifier"
            });
            return;
        }

        const { username } = req.body;
        if (! username)
            this.dataB.getMessages(id)
                .then((value) => {
                    res.status(200).json({
                        status: 200,
                        message: value
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        status: 500,
                        message: `Erreur DB : ${err}`
                    });
                });
        else
            this.dataB.getMessagesByUsername(username)
                .then((value) => {
                    res.status(200).json({
                        status: 200,
                        message: value
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        status: 500,
                        message: `Erreur DB : ${err}`
                    });
                });
    }


    /**
     * Permet à un utilisateur authentifié de récupérer tous les messages
     * de la BD.
     * @param {Request} req la requête de l'utilisateur
     * @param {Response} res la réponse du serveur
     */
    getAllMessages(req, res) {
        let id = req.session.userid;
        if (! id) {
            res.status(403).json({
                status: 403,
                message: "Veuillez vous authentifier"
            });
            return;
        }

        this.dataB.getAllMessages()
            .then((val) => {
                if (! val)
                    res.status(500).json({
                        status: 500,
                        message: "Erreur BD : messages introuvables"
                    });
                else
                    res.status(200).json({
                        status: 200,
                        message: "Messages trouvés",
                        msg: val
                    });
            })
            .catch((err) => {
                res.status(500).json({
                    status: 500,
                    message: `Erreur interne BD : ${err}`
                })
            });
    }

    /**
     * Permet à un utilisateur de liker un message
     * @param {Request} req la requête de l'utilisateur
     * @param {Response} res la réponse du serveur
     */
    addLike(req, res) {
        let id = req.session.userid;
        if (! id) {
            res.status(403).json({
                status: 403,
                message: "Veuillez vous authentifier"
            });
            return;
        }

        const { post_id } = req.body;
        if (! post_id) {
            res.status(400).json({
                status: 400,
                message: "Formulaire invalide"
            });
            return;
        }

        this.dataB.dejaLike(post_id, id)
            .then((value) => {
                if (value)
                    res.status(200).json({
                    status: 200,
                    message: "Message déjà liké"
                });
                else
                    this.dataB.addLike(post_id, id)
                        .then((value) => {
                            if (value)
                                res.status(200).json({
                                    status: 200,
                                    message: "Like ajouté"
                                });
                            if (! value)
                                res.status(500).json({
                                    status: 500,
                                    message: "Erreur DB. Le like n'a pas été ajouté"
                                });
                        })
                        .catch((err) => {
                            res.status(500).json({
                                status: 500,
                                message: `Erreur DB : ${err}`
                            });
                        });
            })
            .catch((err) => {
                res.status(500).json({
                    status: 500,
                    message: `Erreur DB : ${err}`
                });
            });
    }


    /**
     * Permet à un utilisateur authentifié d'ajouter un commentaire à un post
     * @param {Request} req la requête de l'utilisateur
     * @param {Response} res la réponse du serveur
     */
    addComment(req, res) {
        let id = req.session.userid;
        if (! id) {
            res.status(403).json({
                status: 403,
                message: "Veuillez vous authentifier"
            });
            return;
        }

        const { comment, msg_id, username } = req.body; // message : le message à commenter, comment : le commentaire, user_id: le user_id de l'auteur du message
        if (! comment || ! msg_id || ! username) {
            res.status(400).json({
                status: 400,
                message: "Formulaire invalide"
            });
            return;
        }

        this.dataB.addComment(msg_id, username, comment)
            .then((value) => {
                if (! value)
                    res.status(500).json({
                        status: 500,
                        message: "Erreur interne DB. Commentaire non-ajouté."
                    })
                else
                    res.status(200).json({
                        status: 200,
                        message: "Commentaire correctement ajouté"
                    });
            })
            .catch((err) => {
                res.status(500).json({
                    status: 500,
                    message: `Erreur interne BD : ${err}`
                });
            });
    }

    /**
     * Permet à un utilisateur authentifié de récupérer l'identifiant d'un message.
     * @param {Request} req la requête de l'utilisateur
     * @param {Response} res la réponse du serveur
     */
    getID(req, res) {
        let id = req.session.userid;
        if (! id) {
            res.status(403).json({
                status: 403,
                message: "Veuillez vous authentifier"
            });
            return;
        }

        const { message, username, date } = req.body; // message : le message à commenter, comment : le commentaire, user_id: le user_id de l'auteur du message
        if (! message || ! username || ! date) {
            res.status(400).json({
                status: 400,
                message: "Formulaire invalide"
            });
            return;
        }

        this.dataB.getMessageID(message, username, date)
            .then((msg_id) => {
                if (! msg_id)
                    res.status(500).json({
                        status: 500,
                        message: "Le message est introuvable"
                    });
                else
                    res.status(200).json({
                        status: 200,
                        message: "Identifiant trouvé",
                        ident: msg_id
                    });
            })
            .catch((err) => {
                res.status(500).json({
                    status: 500,
                    message: "Erreur interne BD"
                });
            });
    }
}

exports.default = Posts;