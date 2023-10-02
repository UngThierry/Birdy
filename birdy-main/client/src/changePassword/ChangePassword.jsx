import React from 'react';
import axios from 'axios';

import "./ChangePassword.css";

class ChangePassword extends React.Component {

    constructor(props) {
        super(props);
        this.api_request = axios.create({
            timeout : 1000,
            headers : {'X-Custom-Header':'foobar'}
        });
        this.ref_currPass = React.createRef();
        this.ref_newPass = React.createRef();
        this.ref_newPassConf = React.createRef();
        this.state = {error: false};
    }


    render() {
        return (
            <main id="formulaire">
                <h1> Change password </h1>
                <div id="pass_infos">
                    <div id="old_pass">
                        <input type="password" placeholder="Current password" ref={this.ref_currPass} />
                    </div>
                    <div id="new_pass">
                        <input type="password" placeholder="New password" ref={this.ref_newPass} />
                    </div>
                    <div id="new_pass_confirm">
                        <input type="password" placeholder="Confirm new password" ref={this.ref_newPassConf} />
                    </div>
                    
                </div>
                <div id="submit">
                        <button onClick={() => {this.setNewPassword()}}> Submit </button>
                        {this.state.error === true && 
                        <div id="error_message">
                            The new password and its confirmation must be the same
                        </div>
                        }
                </div>
            </main>
        )
    }


    /**
     * Vérifie si le contenu des champs nouveau pasword et confirmation
     * correspondent.
     */
    checkNewPassword = () => {
        return new Promise((resolve, reject) => {
            if (this.ref_newPass.current.value !== this.ref_newPassConf.current.value) {
                this.setState({error: true});
                reject(false);
            }
            else {
                this.setState({error: false})
                resolve(true);
            }
        });
    }


    /**
     * Fait la demande au serveur du changement de mot de passe.
     */
    setNewPassword = () => {
        this.checkNewPassword()
            .then((val) => {
                this.api_request.post("/user/passwordReset", {
                    nPassword: this.ref_newPass.current.value
                })
                .then((res) => {
                    if (res.data['status'] === 200) {
                        this.props.profile();
                    }
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => {});
    }
}

export default ChangePassword;