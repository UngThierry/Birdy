const Datastore = require('nedb');

class postDataBase {

    constructor() {
        this.dataB = new Datastore({filename: './Message/messages.db', autoload: true, onload: (err) => {
            if (err)
                console.log(err.message);
            else
                console.log("Mongo Database up and running !");
        }});
        this.dataB.persistence.setAutocompactionInterval(5000);
    }


    /**
     * 
     * @param {String} message ajoute un document représentant le message à la base de données 
     * @param {int} from_id l'identifiant de l'utilisateur qui envoie le message
     * @param {string} username le nom d'utilisateur associé à l'identifiant
     */
    addMessage(message, from_id, username) {
        return new Promise((resolve, reject) => {
            let doc = {
                author_id: from_id,
                author_name: username,
                message_date: new Date(),
                text: message,
                like: [],
                comments: []
            };
            this.dataB.insert(doc, (err, newDoc) => {
                if (err)
                    reject(err.message);
                else
                    resolve(newDoc);
            });
        });
    }


    /**
     * Supprime le message d'identifiant id.
     * @param {_id} id l'identifiant du message
     * @return Une Promise qui se résout en le message d'erreur si erreur, en true si la suppression a eu lieu, en false sinon.
     */
    deleteMessage(id) {
        return new Promise((resolve, reject) => {
            this.dataB.remove({_id: id}, {}, (err, numRemoved) => {
                if (err)
                    reject(err.message);
                else if (numRemoved === 1)
                    resolve(true);
                else
                    resolve(false);
            });
        });
    }


    /**
     * Retourne l'identifiant d'un message à partir du numéro de l'utilisateur et du contenu du message.
     * @param {string} username le nom d'utilisateur de l'auteur du post
     * @param {string} message le message textuel
     * @param {Date} date la date du post
     * @return Une Promise qui se résout en un message d'erreur si erreur et en l'identifiant du message sinon.
     */
    getMessageID(username, message, date) {
        return new Promise((resolve,reject) => {
            this.dataB.find({author_name: username, text: message, message_date: date}, (err, doc) => {
                if (err)
                    reject(err.message);
                else
                    resolve(doc[0]._id);
            });
        });
    }


    /**
     * Vérifie si un utilisateur a le droit de supprimer le message d'identifiant id.
     * @param {int} user_id l'identifiant de l'utilisateur
     * @param {*} id l'identifiant du message
     * @return une Promise qui se résout en le message d'erreur si erreur, en true si l'utilisateur
     * a les droits et en false sinon.
     */
    peutSupprimer(user_id, id) {
        return new Promise((resolve, reject) => {
            this.dataB.find({_id: id, author_id: user_id}, (err, doc) => {
                if (err)
                    reject(err.message);
                else if (doc === [])
                    resolve(false);
                else
                    resolve(true);
            });
        });
    }


    /**
     * Permet à un utilisateur de modifier le texte du message
     * @param {_id} id l'identifiant du message à modifier
     * @param {string} newPost le texte du nouveau message
     * @return une Promise qui se résout en le message d'erreur si erreur, en true si le remplacement
     * c'est bien fait et false sinon.
     */
    modifierMessage(id, newPost) {
        return new Promise((resolve, reject) => {
            this.dataB.update({_id: id}, { $set: {text: newPost} }, {}, (err, numReplaced) => {
                if (err)
                    reject(err.message);
                if (numReplaced === 1)
                    resolve(true);
                else
                    resolve(false);
            });
        });
    }


    /**
     * Retourne tous les messages d'un utilisateur.
     * @param {*} user_id 
     * @return Une Promise qui se résout en un message d'erreur si erreur ou en un tableau contenant
     * les messages de l'utilisateur sinon.
     */
    getMessages(user_id) {
        return new Promise((resolve, reject) => {
            this.dataB.find({author_id: user_id}, (err, docs) => {
                if (err)
                    reject(err.message);
                else
                    resolve(docs);
            });
        });
    }

    
    /**
     * Retourne tous les messages d'un utilisateur.
     * @param {string} username
     * @return Une Promise qui se résout en un message d'erreur si erreur ou en un tableau contenant
     * les messages de l'utilisateur sinon.
     */
    getMessagesByUsername(username) {
        return new Promise((resolve, reject) => {
            this.dataB.find({author_name: username}, (err, docs) => {
                if (err)
                    reject(err.message);
                else
                    resolve(docs);
            });
        })
    }


    /**
     * Vérifie que l'utilisateur n'a pas déjà liké un message.
     * @param {_id} post_id l'identifiant du message
     * @param {int} user_id l'identifiant de l'utilisateur
     * @return Une Promise qui se résout en le message d'erreur si erreur, en true si l'utilisateur
     * a déjà liké le message et false sinon
     */
    dejaLike(post_id, user_id) {
        return new Promise((resolve, reject) => {
            this.dataB.find({_id: post_id}, (err, doc) => {
                if (err)
                    reject(err.message);
                else {
                    if (doc[0].like.includes(user_id))
                        resolve(true);
                    else
                        resolve(false);
                }
            });
        });
    }


    /**
     * 
     * @param {_id} post_id l'identifiant du message à liker
     * @param {int} user_id l'identifiant de l'utilisateur qui like
     * @return Une Promise qui se résout en le message d'erreur si erreur, en true si l'ajout
     * du like a eu lieu et en false sinon.
     */
    addLike(post_id, user_id) {
        return new Promise((resolve, reject) => {
            this.dataB.update({_id: post_id}, { $push: {like: user_id} }, {}, (err, numReplaced) => {
                if (err)
                    reject(err.message);
                if (numReplaced === 1)
                    resolve(true);
                else
                    resolve(false);
            });
        });
    }


    /**
     * Permet à un utilisateur d'ajouter un commentaire à un message.
     * @param {_id} post_id l'identifiant du message à commenter
     * @param {*} username le nom d'utilisateur de l'auteur du commentaire
     * @param {string} comment le commentaire
     * @return Une Promise qui se résout en le message d'erreur si erreur, en true si l'ajout
     * du commentaire a eu lieu et en false sinon.
     */
    addComment(post_id, username, comment) {
        return new Promise((resolve, reject) => {
            this.dataB.update({_id: post_id}, { $push: {comments: {comment, username} } }, {}, (err, numReplaced) => {
                if (err)
                    reject(err.message);
                if (numReplaced === 1)
                    resolve(true);
                else
                    resolve(false);
            });
        });
    }


    /**
     * Va chercher tous les messages de la BD.
     * @returns une Promise qui se résout en le message d'erreur
     * si erreur et en les documents messages sinon
     */
    getAllMessages() {
        return new Promise((resolve, reject) => {
            this.dataB.find({}).sort({message_date: -1}).exec((err, docs)=>{
                if (err)
                    reject(err.message);
                else
                    resolve(docs);
            });
        });
    }
}

exports.default = postDataBase;