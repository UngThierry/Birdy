import React from 'react';
import axios from 'axios';

import img from '../Images/logo.jpg';
import './Login.css';

class Login extends React.Component {
    
    constructor(props) {
        super(props);
        this.ref_username = React.createRef();
        this.ref_password = React.createRef();
        this.api_request = axios.create({
            timeout : 1000,
            headers : {'X-Custom-Header':'foobar'}
        });
    }

    render(){
        return(
            <main id = "login-page">
                <div className = "login-form-box">
                    <div className = "login-form-logo">
                        <p className = "text-center">
                            <img src = {img} alt = "logo"/>
                        </p>
                    </div>
                <form>
                    <input type = "text" className = "form-control" placeholder = "Username" ref={this.ref_username}/>
                    <input type = "password" className = "form-control" placeholder = "Password" ref={this.ref_password}/>
                    <input type = "checkbox"/> Save Password
                    <input onClick={(event) => this.authenticate()} type = "button" className = "btn login-btn" value = "LOGIN"/>
                </form>
                <button onClick={() => {this.props.register()}} id="register">
                    New User?
                </button>
                </div>
            </main>
        );
    }


    authenticate = () => {
        let username_req = this.ref_username.current.value;
        let password_req = this.ref_password.current.value;
        this.api_request.post("/user/login", {
            username: username_req,
            password: password_req
        })
        .then((res) => {
            if(res.data['status'] === 200) {
                this.props.login();
            }
        })
        .catch((err) => console.log(err));
    }
}

export default Login;