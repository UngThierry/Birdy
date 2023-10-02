import React from 'react';
import axios from 'axios';

import MessageList from './MessageList';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.api_request = axios.create({
            timeout : 1000,
            headers: {'X-Custom-Header':'foobar'}
        });
        this.state = {reload: false};
    }


    render() {
        return (
            <MessageList key={this.state.reload} addMessage={(text) => {this.addMessage(text)}} user={this.props.user} delete={(id) => {this.deleteMessage(id)}} reload={() => {this.reload()}} />
        );
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

export default Home;