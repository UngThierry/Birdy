class Friends {

    constructor(dataB) {
        this.dataB = dataB;
    }


    /**
     * Permet à un utilisateur (authentifié) d'ajouter un ami.
     * @param {Request} req la requête de l'utilisateur
     * @param {Response} res la réponse du serveur
     */
    addFriend(req, res) {
        const { username } = req.body;

        if (! username) {
            res.status(400).json({
                status: 400,
                message: "Formulaire invalide"
            });
            return;
        }

        let id = req.session.userid;
        if (! id) {
            res.status(403).json({
                status: 403,
                message: "Veuillez vous authentifier"
            });
            return;
        }

        this.dataB.getUser(username)
            .then((user_id) => {
                if (! user_id)
                    res.status(500).json({
                        status: 500,
                        message: "Erreur DB : utlisateur introuvable"
                    })
                else
                    this.dataB.existFriendship(id, user_id)
                        .then((value) => {
                            if (value)
                                res.status(200).json({
                                    status: 200,
                                    message: "Vous êtes déjà ami avec cet utilisateur"
                                });
                            else
                                this.dataB.addFriend(id, user_id)
                                    .then((value) => {
                                        if (! value) {
                                            res.status(500).json({
                                                status: 500,
                                                message: "Erreur lors de l'ajout de l'ami"
                                            });
                                        }
                                        else
                                            res.status(200).json({
                                                status: 200,
                                                message: "Ami ajouté"
                                            });
                                        })
                                    .catch((err) => {
                                        console.log(err);
                                        res.status(500).json({
                                            status: 500,
                                            message: "Erreur BD (addFriend)"
                                        });
                                    });
                        })
                        .catch((err) => {
                            res.status(500).json({
                                status: 500,
                                message: "Erreur BD (existFriendship)"
                            });
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
     * Permet à un utilisateur (authentifié) de supprimer un ami.
     * @param {Request} req la requête de l'utilisateur
     * @param {Response} res la réponse du serveur
     */
    deleteFriend(req, res) {
        const { to_user } = req.body;

        if (! to_user) {
            res.status(400).json({
                status: 400,
                message: "Formulaire invalide"
            });
            return;
        }
        let id = req.session.userid;
        if (! id) {
            res.status(403).json({
                status: 403,
                message: "Veuillez vous authentifier"
            });
            return;
        }
        this.dataB.existFriendship(id, to_user)
            .then((value) => {
                if (! value)
                    res.status(400).json({
                        status: 400,
                        message: "Vous n'êtes pas ami avec cet utilisateur"
                    });
                else
                    this.dataB.deleteFriend(id, to_user)
                        .then((value) => {
                            res.status(200).json({
                                status: 200,
                                message: "Ami correctement supprimé"
                            });
                        })
                        .catch((err) => {
                            res.status(500).json({
                                status: 500,
                                message: "Erreur BD"
                            });
                        });
            })
            .catch((err) => {
                res.status(500).json({
                    status: 500,
                    message: "Erreur BD"
                });
            });
    }

    
    /**
     * Permet à un utilisateur de récupérer la liste de ses amis.
     * @param {Request} req la requête de l'utilisateur
     * @param {Response} res la réponse du serveur
     */
    getFriends(req, res) {
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
                message: "Formulaire invalide"
            });
            return;
        }
        this.dataB.getFriends(username)
            .then((value) => {
                if (! value)
                    res.status(200).json({
                        status: 200,
                        message: "Vous n'avez pas encore d'amis"
                    });
                else
                    res.status(200).json({
                        status: 200,
                        message: "Amis trouvés",
                        friends: value
                    });
            })
            .catch((err) => {
                res.status(500).json({
                    status: 500,
                    message: "Erreur BD"
                });
            });
    }
}

exports.default = Friends;