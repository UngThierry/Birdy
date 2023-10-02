import React from 'react';
import axios from 'axios';

import img from '../Images/logo.jpg';
import './Register.css';

class Register extends React.Component {
    
    constructor(props) {
        super(props);
        this.api_request = axios.create({
            timeout : 1000,
            headers : {'X-Custom-Header':'foobar'}
        });
        this.ref_firstname = React.createRef();
        this.ref_lastname = React.createRef();
        this.ref_username = React.createRef();
        this.ref_email = React.createRef();
        this.ref_password = React.createRef();
    }

    render(){
      return( 
        <main id = "register-page">
            <div className = "register-form-box">
                <div className = "register-form-logo">
                    <p className = "text-center">
                        <img src = {img} alt = "logo"/>
                    </p>
                </div>
            <form>
                <input type = "text" className = "form-control" placeholder = "Firstname" ref={this.ref_firstname} />
                <input type = "text" className = "form-control" placeholder = "Lastname" ref={this.ref_lastname} />
                <input type = "text" className = "form-control" placeholder = "Username" ref={this.ref_username} />
                <input type = "email" className = "form-control" placeholder = "Email" ref={this.ref_email} />
                <input type = "password" className = "form-control" placeholder = "Password" ref={this.ref_password} />
                <input type = "button" className = "btn register-btn" value = "REGISTER" onClick={(event) => this.register()}/>
            </form>
            <button onClick={() => {this.props.login()}} id="login_button">
                    Already have an account ?
            </button>
            </div>
        </main>
        );
    }

    /*checkEmail = () => {
        let email_req = this.ref_email.current.value;
        if (email_req.search("@") === -1) {

        }
    }*/

    register = () => {
        let username_req = this.ref_username.current.value;
        let firstname_req = this.ref_firstname.current.value;
        let lastname_req = this.ref_lastname.current.value;
        let email_req = this.ref_email.current.value;
        let password_req = this.ref_password.current.value;

        this.api_request.post('user/Register', {
            login: username_req,
            password: password_req,
            lastname: lastname_req,
            firstname: firstname_req,
            email: email_req
        })
        .then((res) => {
            if (res.data['status'] === 200) {
                this.api_request.post('user/login', {
                    username: username_req,
                password: password_req
                })
                .then((res) => {
                    if (res.data['status'] === 200)
                        this.props.profile();
                })
                .catch((err) => console.log(err));
            }
        })
        .catch((err) => console.log(err));
    }
}

export default Register;