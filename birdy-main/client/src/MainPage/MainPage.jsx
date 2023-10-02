import React from 'react';
import axios from 'axios';

import Login from '../Login/Login';
import Register from '../Register/Register';
import NavigationPanel from '../Navigation_panel/NavigationPanel';
import Profile from '../Profile/Profile';
import ChangePassword from '../changePassword/ChangePassword';
import Home from '../Home/Home';

class MainPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: "Login",
      authenticated: false,
      reload: true // va être utile pour recharger le composant Profile à chaque clic sur le bouton dans la navbar (via la prop key de Profile)
    };
    this.api_request = axios.create({
      timeout : 1000,
      headers: {'X-Custom-Header':'foobar'}
    });
  }

 
  render() {
    console.log(this.state);
    return (
      <div>
        {(this.state.currentPage !== "Login" && this.state.currentPage !== "Register") && <NavigationPanel logout={() => {this.setLogout()}} profile={() => {this.displayProfile()}} home={() => {this.displayHome()}} />}
        {(this.state.currentPage === "Login" && this.state.authenticated) && <Profile />}
        {(this.state.currentPage === "Login" && !this.state.authenticated) && <Login login={() => {this.setConnected()}} register={() => {this.register()}} />}
        {this.state.currentPage === "Register" && <Register login={() => {this.login()}} profile={() => {this.setConnected()}}/>}
        {this.state.currentPage === "Profile" && <Profile key={this.state.reload} pass={() => {this.changePassword()}} />}
        {this.state.currentPage === "resetPassword" && <ChangePassword profile={() => {this.displayProfile()}} />}
        {this.state.currentPage === "Home" && <Home user={this.state.username} />}
      </div>
    );
  }


  setConnected = () => {
    this.setState({authenticated: true, currentPage: "Profile"});
    this.api_request.get("/user")
      .then((res) => {
        if (res.data['status'] === 200)
          this.setState({username: res.data['username']});
      })
      .catch((err) => console.log(err));
  }


  setLogout = () => {
    this.setState({authenticated: false, currentPage: "Login"});
  }


  register = () => {
      this.setState({currentPage: "Register"});
  }


  login = () => {
    this.setState({currentPage: "Login"});
  }


  displayHome = () => {
      this.setState({currentPage: "Home"});
  }


  displayProfile = () => {
    if (this.state.currentPage === "Profile")
      this.setState({reload: !this.state.reload});
    else
      this.setState({currentPage: "Profile"});
  }


  changePassword = () => {
    this.setState({currentPage: "resetPassword"});
  }
  
}

export default MainPage;