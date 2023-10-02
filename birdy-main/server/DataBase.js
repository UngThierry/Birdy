const sqlite3 = require('sqlite3').verbose();

/**
 * Crée un objet base de données qui encapsule notre BD et ses méthodes
 */
class DataBase {

    /**
     * Crée un objet de type base de données et ouvre cette base de données.
     * @param {string} dbPath le chemin d'accès à la base de données
     */
    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
            if (err)
                console.error("An eror occured during the DB creation");
            else
                console.log("DB up and running !");
        });
        this.initialisation();
    }


    /**
     * Initialise la base de données en créant les tables suivantes :
     *  @ users(rowid, lastname, firstname, username, email, password)
     *  @ friends(rowid, from_user, to_user, since)
     */
    initialisation() {
        let initUser = `CREATE TABLE IF NOT EXISTS users (
            lastname VARCHAR(50) NOT NULL,
            firstname VARCHAR(50) NOT NULL,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(50) NOT NULL,
            password VARCHAR(50) NOT NULL
            );`;
        let initFriends = `CREATE TABLE IF NOT EXISTS friends (
            from_user VARCHAR(50) NOT NULL,
            to_user VARCHAR(50) NOT NULL,
            since TIMESTAMP NOT NULL,
            PRIMARY KEY (from_user, to_user)
            );`;
        this.db.run(initUser, () => console.log("User table operational"));
        this.db.run(initFriends, () => console.log("Friends table operational"));
    }


    /**
     * Ajoute un utilisateur à la base de données.
     * @param {string} lastname le nom de famille de l'utilisateur
     * @param {string} firstname le prénom de l'utilisateur
     * @param {string} username le pseudo de l'utilisateur
     * @param {string} password le mot de passe de l'utilisateur (en clair)
     * @return {Promise} une promesse qui se résout en le message d'erreur si elle échoue 
     * et se résout en l'identifiant du nouvel utilisateur sinon.
     */
     addUser(lastname, firstname, username, email, password) {
        return new Promise((resolve, reject) => {
            let newUserReq = "INSERT INTO users VALUES (?, ?, ?, ?, ?);";
            this.db.run(newUserReq, lastname, firstname, username, email, password, (err) => {
            if (err)
                reject(err.message);
            else
                resolve(this.lastID);
            });
        });    
    }


    /**
     * Permet de supprimer un utilisateur (authentifié) de la base de données.
     * @param {int} id l'identifiant (rowid) de l'utilisateur à supprimer.
     * @return {Promise} une promesse qui se résout en true si l'opération se déroule normalement
     * ou qui se réout en le message d'erreur si l'opération a échoué. 
     */
    deleteUser(id) {
        return new Promise((resolve, reject) => {
            let req = `DELETE FROM users WHERE rowid='${id}';`;
            this.db.run(req, (err) => {
                if (err)
                    reject(err.message);
                else
                    resolve(true);
            });
        });
    }


    /**
     * Permet de récupérer l'identifiant d'un utilisateur à partir de son nom d'utilisateur.
     * @param {string} username le nom d'utilisateur dont on veut le rowid correspondant.
     * @return {Promise} une promesse qui se résout en le message d'erreur si la requête échoue et qui
     * se résout en le rowid de l'utilisateur si elle réussit ou en undefined si l'utilisateur n'existe pas.
     */
    getUser(username) {
        return new Promise((resolve, reject) => {
            let req = `SELECT rowid FROM users WHERE username='${username}';`;
            this.db.get(req, (err, row) => {
                if (err)
                    reject(err.message);
                else if (row)
                    resolve(row.rowid);
                else
                    resolve(undefined);
            });
        });
    }


    /**
     * Permet de récupérer le nom d'un utilisateur à partir de son identifiant.
     * @param {int} id l'identifiant de l'utilisateur
     * @return une Promise qui se résout en le message d'erreur en cas de problème, en le nom d'utilisateur s'il a bien été trouvé et en undefined sinon. 
     */
    getUsername(id) {
        return new Promise((resolve, reject) => {
            let req = `SELECT username FROM users WHERE rowid='${id}';`;
            this.db.get(req, (err, row) => {
                if (err)
                    reject(err.message);
                else if (row)
                    resolve(row.username);
                else
                    resolve(undefined);
            })
        });
    }


    /**
     * Vérifie que l'existence d'un nom d'utilisateur dans la BD.
     * @param {String} username le nom d'utilisateur dont on veut vérifier l'existence dans la base de données
     * @return {Promise} une promesse qu se résout en le message d'erreur si la requête 
     * échoue et qui se résout en le rowid de l'utilisateur s'il existe bien ou bien en
     * undefined dans le cas contraire.
     */
    existLogin(username){
        return new Promise((resolve, reject) => {
            let exist = `SELECT rowid FROM users WHERE username='${username}';`;
            this.db.get(exist, (err, row) => {
                if (err)
                    reject(err.message);
                else if (row)
                    resolve(row.rowid); 
                else
                    resolve(undefined);           
            });
        }); 
    }


    /**
     * Vérifie les informations de login fournies par l'utilisateur.
     * @param {string} username
     * @param {string} password
     * @return {Promise} une promesse qu se résout en le message d'erreur si la requête 
     * échoue et qui se résout en le rowid de l'utilisateur si le login est correct
     * ou bien en undefined dans le cas contraire.
     */
    checkLogin(username, password) {
        return new Promise((resolve, reject) => {
            let req = `SELECT rowid FROM users WHERE username='${username}' AND password='${password}';`;
            this.db.get(req, (err, row) => {
                if (err)
                    reject(err.message);
                else if (row)
                    resolve(row.rowid);
                else
                    resolve(undefined);
            });
        });
    }
    

    /**
     * Permet à un utilisateur (authentifié) de modifier son mot de passe.
     * @param {int} id le numéro d'utilisateur (rowid) 
     * @param {string} nPassword le nouveau mot de passe
     * @return une promesse qu se résout en le message d'erreur si la requête 
     * échoue et qui se résout en true sinon.
     */
    passwordReset(id, nPassword) {
        return new Promise((resolve, reject) => {
            let req = `UPDATE users SET password='${nPassword}' WHERE rowid='${id}';`;
            this.db.run(req, (err, row) => {
                if (err)
                    reject(err.message);
                else
                    resolve(true);
            });
        });
    }


    /**
     * Permet d'obtenir les informations d'un utilisateur.
     * @param {int} id le numéro d'utilisateur (rowid) 
     * @return une promesse qu se résout en le message d'erreur si la requête 
     * échoue, en un tableau contenant les informations si tout se passe bien et en undefined si on n'a rien trouvé.
     */
    getInfos(id) {
        return new Promise((resolve, reject) => {
            let req = `SELECT lastname, firstname, username, email FROM users WHERE rowid='${id}';`
            this.db.get(req, (err, row) => {
                if (err)
                    reject(err.message);
                else if (row)
                    resolve([row.lastname, row.firstname, row.username, row.email]);
                else
                    resolve(undefined);
            });
        });
    }


    /**
     * Vérifie l'existance de la relation 'est ami' de from_id à to_id.
     * @param {int} from_id l'identifiant de l'utilisateur à l'origie de la relation
     * @param {int} to_id l'identifiant de l'utilisateur sur lequel s'exerce la relation
     * @return une promesses qui se résout en true si la relation existe, qui se résout en undefined si elle n'existe pas et en le message
     * d'erreur si une erreur est rencontrée. 
     */
    existFriendship(from_id, to_id) {
        return new Promise((resolve, reject) => {
            let req = `SELECT rowid FROM friends WHERE from_user='${from_id}' AND to_user='${to_id}';`;
            this.db.get(req, (err, row) => {
                if (err)
                    reject(err.message);
                else if (row)
                    resolve(true);
                else
                    resolve(undefined);
            });
        });
    }


    /**
     * Rajoute une entrée à la table friends avec les valeurs spécifiées.
     * @param {int} from_id l'identifiant de l'utilisateur qui demande à suivre l'autre
     * @param {int} to_id l'identifiant de l'utilisateur à suivre
     * @return {Promise} une promesse qui se résout en le message d'erreur si elle échoue 
     * et se résout en l'identifiant de la nouvelle entrée sinon.
     */
    addFriend(from_id, to_id) {
        return new Promise((resolve, reject) => {
            let req = `INSERT INTO friends VALUES ('${from_id}', '${to_id}', datetime('now'));`;
            this.db.run(req, (err) => {
                if (err)
                    reject(err.message);
                else
                    resolve(true);
            });
        });
    }


    /**
     * Permet de supprimer un lien d'amitié de la base de données.
     * @param {int} from_id l'identifiant (rowid) de l'utilisateur à qui vait initié la relation.
     * @param {int} to_id l'identifiant (rowid) de l'utilisateur sur qui la relation s'appliquait.
     * @return {Promise} une promesse qui se résout en true si l'opération se déroule normalement
     * ou qui se réout en le message d'erreur si l'opération a échoué. 
     */
    deleteFriend(from_id, to_id) {
        return new Promise((resolve, reject) => {
            let req = `DELETE FROM friends WHERE from_user='${from_id}' AND to_user='${to_id}';`;
            this.db.run(req, (err, row) => {
                if (err)
                    reject(err.message);
                else
                    resolve(true);
            });
        });
    }


    /**
     * Permet d'accéder la liste de tous les amis d'un utilisateur.
     * @param {string} username le username de l'utilisateur dont on veut les amis.
     * @return {Promise} une promesse qui se résout en la liste des identifiants des amis
     * de l'utilisateur si l'opération se déroule bien et qu'il a des amis, qui se résout en undefined
     * si l'opération se passe bien mais qu'il n'a pas d'amis ou que le nom d'utilisateur
     * ne correspond à aucun utilisateur de la BD, et qui se résout en le message d'erreur sinon.
     */
    getFriends(username) {
        return new Promise((resolve, reject) => {
            this.getUser(username)
                .then((val) => {
                    if (! val)
                        resolve(undefined);
                    else {
                        let friendsID = [];
                        let req = `SELECT to_user FROM friends WHERE from_user='${val}';`;
                        this.db.all(req, (err, rows) => {
                            if (err)
                                reject(err.message);
                            else if (rows) {
                                rows.forEach(element => {
                                    friendsID.push(element.to_user);
                                });
                                resolve(friendsID);
                            }
                            else
                                resolve(undefined);
                            });
                    }
                })
                .catch((err) => reject(err.message));
        });
    }

    
    /**
     * Ferme la base données.
     */
    close() {
        this.db.close((err) => {
            if (err)
                console.error(err.message);
            else
                console.log("Database sucessfully closed");
        });
    }

}

exports.default = DataBase;