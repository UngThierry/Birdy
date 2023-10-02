import React from 'react';
import axios from 'axios';

import profile_pic from '../Images/profil.jpg';
import Friendlist from '../Friends/Friendlist';
import MessageList from '../Home/MessageList';

import './Profile.css';


class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.api_request = axios.create({
            timeout : 1000,
            headers: {'X-Custom-Header':'foobar'}
        });
        this.state = {reload: false};
    }


    render() {
        if (this.state !== null) {
            return (
                <main id="profile_page">
                    <section id="profile">
                        <div className="section-title">
                            <h1>Profile</h1>
                        </div>
                        <div className="section-body">
                            <div id="photo-profile">
                                <img src={profile_pic} alt="profile-pic" />
                            </div>
                            <div id="infos">
                                <p><i><b>Username :</b></i> {this.state.username}</p>
                                <p><i><b>Lastname :</b></i> {this.state.lastname}</p>
                                <p><i><b>Firstname :</b></i> {this.state.firstname}</p>
                                <p><i><b>E-mail :</b></i> {this.state.email}</p>
                            </div>
                            { this.state.user === this.state.username &&
                            <div id="reset-pass">
                                <button onClick={(event) => this.props.pass()} > Change password ? </button>
                            </div>
                            }
                        </div>
                    </section>
                    <section id="friends">
                        <div className="section-title">
                            <h1>Friends</h1>
                        </div>
                        { this.state.username &&        // Mettre une condition sinon undefined transmis à Friendlist via user
                        <div className="section-body" id="list_amis">
                            <Friendlist key={this.state.username} user={this.state.username} visitFriend={(usr) => {this.visitFriendProfilePage(usr)}} />
                        </div>
                        }
                    </section>
                    <section id="message">
                        <div className="section-title">
                            <h1>Messages</h1>
                        </div>
                        { this.state.username &&        // Mettre une condition sinon undefined transmis à Friendlist via user
                        <div className="section-body" id="list_message">
                            <MessageList key={this.state.reload} addMessage={(text) => {this.addMessage(text)}} user={this.state.user} delete={(id) => {this.deleteMessage(id)}} reload={() => {this.reload()}} />
                        </div>
                        }
                    </section>
                </main>
            );
        }
        else {
            return (
                <main id="profile_page"></main>
            );
        }
    }


    componentDidMount() {
        this.getOwnUsername()
            .then((username) => {
                this.getInfos(username);
            })
            .catch((err) => console.log(err));
    }

    /**
     * Permet de récupérer le nom d'utilisateur de la personne connectée à son compte et de mettre à jour l'état.
     */
    getOwnUsername = () => {
        return new Promise((resolve, reject) => {
            this.api_request.get('/user')
            .then((res) => {
                if (res.data['status'] === 200) {
                    this.setState({username: res.data['username'], user: res.data['username']});
                    resolve(res.data['username']);
                }
            })
            .catch((err) => reject(err.message));
        });
    }


    /**
     * Permet de récupérer toutes les informations (sauf le mot de passe ;) de l'utilisateur spécifié en paramètre.
     * @param {string} user le nom d'utilisateur associé au compte dont on veut les infos.
     */
    getInfos = (user) => {
        this.api_request.post("/user", {
            username: user
        })
        .then((res) => {
            this.setState({
                lastname: res.data['lastname'],
                firstname: res.data['firstname'],
                username: res.data['username'],
                email: res.data['email']
            });
        })
        .catch((err) => console.log(err.message));
    }


    /**
     * Permet de spécifier que l'on visite la page de profil d'un autre utilisateur. Met à jour l'état.
     * Utile pour désactiver la fonctionnalité de changement de mot de passe sur une page qui ne nous appartient pas.
     * @param {string} username le nom d'utilisateur de la page que l'on veut visiter
     */
    visitFriendProfilePage = (usr) => {
        this.setState({username: usr}, () => {
            this.getInfos(this.state.username);
        });
    }

    addMessage = (text) => {
        this.api_request.post("/messages/addPost", {
            post: text
        })
        .then((res) => {
            if (res.data['status'] === 200)
                this.setState({reload: ! this.state.reload});
        })
        .catch((err) => console.log(err));
    }


    deleteMessage = (id) => {
        this.api_request.post("/messages/deletePost", {
            msg_id: id
        })
        .then((res) => {
            if (res.data['status'] === 200)
                this.setState({reload: ! this.state.reload});
        })
        .catch((err) => console.log(err));
    }

    reload = () => {
        this.setState({reload: ! this.state.reload});
    }

}

export default Profile;