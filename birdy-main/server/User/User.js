const { json } = require('express');
const session = require('express-session');

class User {

    constructor(dataB) {
        this.dataB = dataB;
    }


    /**
     * Permet de créer le compte d'un utilisateur.
     * @param {Request} req la requête de l'utilisateur.
     * @param {Response} res la réponse de l'utilisateur.
     */
    addUser(req, res) {
        const { login, password, lastname, firstname, email } = req.body;
        // s'il manque une information
        if (! login || ! password || ! lastname || ! firstname || ! email)
            res.status(400).json({
                status: 400,
                message: "Formulaire invalide"
            });

        // si le username est déjà existant
        this.dataB.existLogin(login)
            .then((value) => {
                if (value)
                    res.status(409).json({
                    status: 409,
                    message: "Nom d'utilisateur déjà existant"
                });
                else {
                    this.dataB.addUser(lastname, firstname, login, email, password)
                        .then((value) => {
                            res.status(200).json({
                                status: 200,
                                message: "Compte créé avec succès"
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).json({
                                status: 500,
                                message: "Erreur lors de la création du compte"
                            });
                        });
                }
            })
            .catch((err) => {
                res.status(500).json({
                    status: 500,
                    message: "Erreur lors de la création du compte"
                });
            });
    }


    /**
     * Permet de supprimer définitivement un utilisateur de la base de données.
     * @param {Request} req la requête de l'utilisateur.
     * @param {Response} res la réponse du serveur.
     */
    deleteUser(req, res) {
        let id = req.session.userid;
        if (! id) {
            res.status(403).json({
                status: 403,
                message: "Veuillez vous authentifier"
            });
            return;
        }
        this.dataB.deleteUser(id)
            .then((value) => {
                if (! value)
                    res.status(500).json({
                        status: 500,
                        message: "Erreur interne : l'utilisateur n'a pas pu être supprimé"
                    });
                else
                    res.status(200).json({
                        status: 200,
                        message: "Compte supprimé avec succès"
                    });
            })
            .catch((err) => {
                res.status(500).json({
                    status: 500,
                    message: "Erreur interne : l'utilisateur n'a pas pu être supprimé"
                });
            });
    }


    /**
     * Permet à un utilisateur de s'authentifier et de générer sa session
     * @param {Request} req la requête du client
     * @param {Response} res la réponse à la requête du client
     */
    login(req, res) {
        const {username, password} = req.body;
        // s'il manque une information
        if(!username || !password) {
            res.status(400).json({
                status: 400,
                message: "Requête invalide : login et password nécessaires"
            });
            return;
        }
        // si les informations sont incorrectes
        this.dataB.checkLogin(username, password)
            .then((value) => {
                if (! value) {
                    req.session.destroy((err) => { });
                    res.status(403).json({
                        status: 403,
                        message: "Erreur dans le nom d'utilisateur ou le mot de passe"
                    });
                }
                // si tout se passe bien
                else {
                    req.session.regenerate(function (err) {
                        if (err)
                            res.status(500).json({
                                status: 500,
                                message: "Erreur interne"
                            });
                    });
                    req.session.userid = value;
                    res.status(200).json({
                        status: 200,
                        message: "Authentification réussie"
                    });
                }
            })
            .catch((err) => {
                res.status(500).json({
                    status: 500,
                    message: "Erreur interne BD"
                });
            });
    }

    
     /**
     * Permet à un utilisateur de se déconnecter de son compte.
     * @param {Request} req la requête du client
     * @param {Response} res la réponse à la requête du client
     */
    logout(req, res) {
        req.session.destroy((err) => { 
            if (err)
                res.status(500).json({
                    status: 500,
                    message: "Erreur interne au serveur"
                });
            else {
                res.status(200).json({
                    status: 200,
                    message: "Déconnexion réussie"
                });
                
            }
        });
    }


     /**
     * Permet à un utilisateur de changer son mot de passe.
     * @param {Request} req la requête du client
     * @param {Response} res la réponse à la requête du client
     */
    passwordReset(req, res) {
        let id = req.session.userid;
        if (! id) {
            res.status(403).json({
                status: 403, 
                message: "Veuillez vous authentifier"
            });
            return;
        }

        const { nPassword } = req.body;
        if (! nPassword) {
            res.status(400).json({
                status: 400,
                message: "Requête invalide : formulaire invalide"
            });
            return;
        }
        this.dataB.passwordReset(id, nPassword)
            .then((value) => {
                res.status(200).json({
                    status: 200,
                    message: "Mot de passe correctement changé"
                });
            })
            .catch((err) => {
                res.status(500).json({
                    status: 500,
                    message: "Erreur interne BD"
                });
            }); 
    }

    
     /**
     * Permet de récupérer les informations à afficher sur la page de profil de l'utilisateur.
     * @param {Request} req la requête du client
     * @param {Response} res la réponse à la requête du client
     */
    getInfos(req, res) {
        let id = req.session.userid;
        if (! id) {
            res.status(403).json({
                status: 403, 
                message: "Veuillez vous authentifier"
            });
            return;
        }

        const { username } = req.body;
        if (! username) {
            res.status(400).json({
                status: 400,
                message: "Requête invalide : formulaire invalide"
            });
            return;
        }

        this.dataB.getUser(username)
            .then((value) => {
                console.log("value : ", value);
                if (! value)
                    res.status(500).json({
                        status: 500,
                        message: "Utilisateur demandé inexistant"
                    });
                
                else {
                    let userid = value;
                    this.dataB.getInfos(userid)
                        .then((value) => {
                            if (! value)
                                res.status(500).json({
                                    status: 500,
                                    message: "Utilisateur demandé inexistant"
                                });

                            else
                                res.status(200).json({
                                    status: 200,
                                    message: "Informations correctement retrouvées",
                                    lastname: value[0],
                                    firstname: value[1],
                                    username: value[2],
                                    email: value[3]
                                });
                        })
                        .catch((err) => {
                            res.status(500).json({
                                status: 500,
                                message: "Erreur interne du serveur"
                            });
                        });
                }     
            })
            .catch((err) => {
                res.status(500).json({
                    status: 500,
                    message: "Erreur interne du serveur"
                });
            });
    }


    /**
     * Permet à un utilisateur authentifié de récupérer son username (plus spécifique que getInfos())
     * @param {Request} req la requête de l'utilisateur
     * @param {Response} res la réponse du serveur
     */
    getOwnUsername(req, res) {
        let id = req.session.userid;
        if (! id) {
            res.status(403).json({
                status: 403,
                message: "Veuillez vous authentifier"
            });
            return;
        }

        this.dataB.getUsername(id)
            .then((value) => {
                if (! value)
                    res.status(500).json({
                        status: 500,
                        message: "Utilisateur introuvable"
                    });
                else
                    res.status(200).json({
                        status: 200,
                        message: "Utilisateur trouvé",
                        username: value
                    });
            })
            .catch((err) => {
                res.status(500).json({
                    status: 500,
                    message: "Erreur interne BD"
                });
            });
    }

    /**
     * Permet d'obtenir le username d'un utilisateur en particulier.
     * @param {Request} req la requête de l'utilisateur
     * @param {Response} res la réponse du serveur
     */
    getUsername(req, res) {
        let id = req.session.userid;
        if (! id) {
            res.status(403).json({
                status: 403,
                message: "Veuillez vous authentifier"
            });
            return;
        }

        const { usr_id } = req.body;
        if (! usr_id) {
            res.status(400).json({
                status: 400,
                message: "Formulaire invalide"
            })
            return;
        }

        this.dataB.getUsername(usr_id)
            .then((value) => {
                if (! value)
                    res.status(500).json({
                        status: 500,
                        message: "Utilisateur introuvable"
                    });
                else
                    res.status(200).json({
                        status: 200,
                        message: "Utilisateur trouvé",
                        username:value
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

exports.default = User;