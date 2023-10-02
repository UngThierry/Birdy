import React from 'react';
import axios from 'axios';

import './NavigationPanel.css';
import Logo from '../Images/logo1.jpg';

class NavigationPanel extends React.Component {

    constructor(props) {
        super(props);
        this.api_request = axios.create({
            timeout : 1000,
            headers : {'X-Custom-Header':'foobar'}
        });
    }

    render() {
        return (
        <header>
            <div id="logo">
                <img src={Logo} alt="logo-birdy"/>
            </div>
            <nav>
                <ul>
                    <li><button className="NavigationPanelButton" onClick={(event) => {this.props.home()}}>Home</button></li>
                    <li><button className="NavigationPanelButton" onClick={(event) => {this.props.profile()}}>Profile</button></li>
                    <li><button className="NavigationPanelButton" onClick={(event) => {this.doLogout()}}>Logout</button></li>
                </ul>
            </nav>
        </header>
        );
    }


    doLogout = () => {
        this.api_request.get('user/logout')
            .then((res) => {
                if (res.data['status'] === 200) {
                    this.props.logout();
                }
            })
            .catch((err) => console.log(err));
    }
}




export default NavigationPanel;