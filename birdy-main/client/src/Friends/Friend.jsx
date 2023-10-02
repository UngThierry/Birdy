import React from 'react';
import axios from 'axios';

import friend_pic from '../Images/friend_pic.png'
import './Friend.css';

class Friend extends React.Component {

    constructor(props) {
        super(props);
        this.api_request = axios.create({
            timeout : 1000,
            headers: {'X-Custom-Header':'foobar'}
        });
    }


    render() {
        if (this.state === null)
            return (
                <div className="friend"></div>
            );
        return (
            <div className="friend">
                <div className="friend-pic">
                    <img src={friend_pic} alt='avatar-friend'/>
                </div>
                <div className="friend-info">
                    <button onClick={(event) => {this.props.visitFriend(this.state.username)}}> {this.state.username} </button>
                </div>
                <div className="delete_button">
                    <button  onClick={(event) => {this.deleteFriend()}}> X </button>
                </div>
            </div>
        );
    }

    
    componentDidMount() {
        this.getUsername();
    }


    /**
     * Récupère le nom d'utilisateur de l'ami à partir de l'identifiant passé depuis Friendlist.
     */
    getUsername = () => {
        this.api_request.post("/user/name", {
            usr_id: this.props.id
        })
            .then((res) => {
                if (res.data['status'] === 200) {
                    this.setState({username: res.data['username']});
                }
            })
            .catch((err) => console.log(err));
    }


    deleteFriend() {
        this.props.delete(this.props.id);
    }
}

export default Friend;