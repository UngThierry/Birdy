import React from 'react';
import axios from 'axios';

import Friend from './Friend';
import './Friendlist.css';

class Friendlist extends React.Component {

    constructor(props) {
        super(props);
        this.api_request = axios.create({
            timeout : 1000,
            headers: {'X-Custom-Header':'foobar'}
        });
    }


    render() {
        if (this.state === null)
            return (<div id="friend_list"></div>)
        return (
            <div id="friend_list">
                {this.state.friends.map((element) => (
                <p key={this.state.reload} className="listElem">
                    <Friend key={element} id={element} visitFriend={(usr) => {this.props.visitFriend(usr)}} delete={(id) => this.deleteFriend(id)} />
                </p>
                ))}
            </div>
        );
    }


    componentDidMount() {
        this.getFriends()
            .then((val) => {})
            .catch((err) => console.log(err));
    }


    /**
     * Récupère la liste des amis de l'utilisateur et la met à jour dans le state.
     */
    getFriends = () => {
        return new Promise((resolve, reject) => {
            this.api_request.post("/friends", {
                username: this.props.user
            })
            .then((res) => {
                if (res.data['status'] === 200) {
                    let friendsList = [];
                    res.data['friends'].map((element) => (
                        friendsList.push(parseInt(element, 10))
                    ));
                    console.log("Friendlist = ", friendsList);
                    this.setState({friends: friendsList})
                    resolve(true);
                }
            })
            .catch((err) => {
                reject(err)});
        });
    }


    /**
     * Permet de supprimer un utilisateur de sa liste d'amis
     */
    deleteFriend = (friend_id) => {
        this.api_request.post("/friends/deleteFriend", {
            to_user: friend_id
        })
        .then((res) => {
            if (res.data['status'] === 200)
                this.getFriends();
        })
        .catch((err) => {
            console.log(err);
        });
    }
}

export default Friendlist;