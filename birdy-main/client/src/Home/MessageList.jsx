import React from 'react';
import axios from 'axios';

import Message from './Message';
import './MessageList.css';

class MessageList extends React.Component {

    constructor(props) {
      super(props);
      this.state ={
				search:''
			};
      this.api_request = axios.create({
        timeout : 1000,
        headers: {'X-Custom-Header':'foobar'}
      });
      this.ref_npost = React.createRef();
    }

    updateSearch(event){
		this.setState({search: event.target.value.substr(0,20)});
		}

    render() {
      let filteredMessages = undefined;
			if (this.state.messages !== undefined) {
				filteredMessages = this.state.messages.filter(
					(element) => {
						return element['text'].includes(this.state.search) || element['author_name'].includes(this.state.search) || element['message_date'].includes(this.state.search) ;
					}
				);
			}
      if (this.state === null)
        return(
        	<div id="message_list"></div>
        );
				
      return (
      	<div>
        	<div className="searchBar">
						<input
							type="text"
							name="searchBar"
							id="searchBar"
							placeholder="Search ..."
							value={this.state.search}
							onChange={this.updateSearch.bind(this)}
						/>
          </div>
          <div id="addPanel">
            <textarea id="newPost" type="text" placeholder="What do you want to say ?" ref={this.ref_npost} />
            <button onClick={(event) => {this.addPost()}}>Send</button>
          </div>
          <div id="message_list">
            {filteredMessages !== undefined && filteredMessages.map((element, index) => (
            	<p className="messageElem">
                <Message key={index} author_name={element['author_name']} message_id={element['_id']} message={element['text']} date={element['message_date']} likes={element['like'].length} comments={element['comments']} user={this.props.user} delete={(id) => {this.props.delete(id)}} reload={() => {this.props.reload()}} />
              </p>
            ))}
          </div>
        </div>
      );
  	}

    componentDidMount(){
      this.getMessages();
    }

    /**
     * Récupère tous les messages dans la base de données.
     */
    getMessages() {
      this.api_request.get("/messages")
        .then((res) => {
            this.setState({messages: res.data['msg']});
        })
        .catch((err) => console.log(err));
    }

    /**
     * Permet d'ajouter un message à la BD tout en signalant la modification à Home.
     */
    addPost() {
      this.props.addMessage(this.ref_npost.current.value);
    }
		
}

export default MessageList;