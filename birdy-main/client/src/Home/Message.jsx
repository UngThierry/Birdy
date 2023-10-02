import React from 'react';
import axios from 'axios';

import './Message.css';

/**
 * Les props à passer sont:
 *  => author_name: le nom de l'auteur du post
 *  => message: le message
 *  => message_id: l'identifiant unique du message
 *  => date: la date du post
 *  => likes: le nombre de likes
 *  => comments: la liste des commentaires du post
 *  => user : l'utilisateur dont c'est actuellement la session (passé depuis MainPage)
 *  => delete: la fonction permettant de supprimer le message (passées en cascade depuis Home)
 */

class Message extends React.Component {

    constructor(props) {
        super(props);
        this.api_request = axios.create({
            timeout : 1000,
            headers: {'X-Custom-Header':'foobar'}
        });
        this.state = {already_friend: false, already_liked: false};
        this.ref_comment = React.createRef();
    }

    
    render() {
        return (
            <div className="messageElement">
                <div className="message-box">
                    <article className="post"> 
                        <h1>{this.props.author_name}</h1> 
                        {(this.state.already_friend === false && this.props.author_name !== this.props.user) && <button onClick={(event) => {this.addFriend()}}>Add Friend</button>}
                        <h4><i>{this.props.date}</i></h4>
                        <article className="message">
                            {this.props.message}
                        </article>
                        <article className="function-bar">
                            <button onClick={(event) => {this.addLike()}}>♥</button>
                            {this.props.likes}
                            {this.state.already_liked === true && <span className="Error-msg">You have already liked this one !</span>}
                        </article>
                        <article className="comment">
                            {this.props.comments.map((element) => (
                            <div>
                                <h4><i>{element['username']}</i></h4><span>{element['comment']}</span>
                            </div>
                            ))}
                        </article>
                    </article>
                    <input type="text" placeholder="Add a comment" ref={this.ref_comment}/>
                    <button onClick={(event) => {this.addComment(this.ref_comment.current.value)}}>Send</button>
                </div>
                
                { this.props.author_name === this.props.user &&
                <div className="del_button">
                    <button onClick={(event) => {this.deleteMessage()}}>X</button>
                </div>}
            </div>
            
        );
    }


    /**
     * Permet à l'utilisateur de liker un message.
     */
    addLike() {
        this.api_request.post("/messages/like", {
            post_id: this.props.message_id
        })
        .then((res) => {
            if (res.data['status'] === 200) {
                this.setState({already_liked: true});
                if (res.data['message'] !== "Message déjà liké")
                    this.props.reload();
            }
        })
        .catch((err) => console.log(err));
    }


    /**
     * Permet à l'utilisateur d'ajouter en ami l'auteur d'un message.
     */
    addFriend() {
        this.api_request.post("/friends/addFriend", {
            username: this.props.author_name
        })
        .then((res) => {
            if (res.data['status'] === 200 && res.data['message'] !== "Vous êtes déjà ami avec cet utilisateur")
                this.setState({already_friend: true});
        })
        .catch((err) => console.log(err));
    }


    /**
     * Permet à l'utilisateur de commenter un message.
     * @param {string} text le message textuel qu'il veut envoyer en commentaire
     */
    addComment(text) {
        this.api_request.post("/messages/comment", {
            comment: text,
            msg_id: this.props.message_id,
            username: this.props.user
        })
        .then((res) => {
            if (res.data['status'] === 200)
                this.props.reload();
        })
        .catch((err) => console.log(err));
    }

    /**
     * Permet à l'utilisateur de supprimer son message.
     */
    deleteMessage() {
        this.props.delete(this.props.message_id);
    }
}

export default Message;