import React, {Component} from "react";
import {
    Redirect,
} from "react-router-dom";
import {auth} from '../components/Auth';
import {server} from '../config';


class Login extends Component{

    state = {
        redirectToReferrer: false,
        username: "",
        password: ""
    }

    constructor(props) {
        super(props);
        this.state = {
            redirectToReferrer: false,
            username: "",
            password: "",};

        this.handleInputChange = this.handleInputChange.bind(this);
        this.login = this.login.bind(this);
    }

    login = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const url = server;



        fetch(url + '/perform_login', {
            method: 'POST',
            body: data,
        })
            .then((response) => {
                console.log(response);
                if(!response.ok && response.status === 401) throw new Error("Unauthorized, wrong username or password");
                else if(!response.ok && response.status === 500) throw new Error("Internal Server Error");
                else return response;
            })
            .then((data) => {
                auth.authenticate(() => {
                    this.setState({ redirectToReferrer: true });
                });
            })
            .catch((error) => {
                alert(error)
            });
    };

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;


        this.setState({
            [name]: value
        });
    }

    render(){

        const { from } = this.props.location.state || { from: { pathname: '/' } } /* save the route the user came from to be able to redirect after login */
        const { redirectToReferrer } = this.state

        if (redirectToReferrer === true) {
            return <Redirect to={from} />
        }

        return(
            <div>
                <form onSubmit={this.login}>
                    <label>
                        Username:
                        <input
                            name="username"
                            type="text"
                            value={this.state.username}
                            onChange={this.handleInputChange}/>

                    </label>
                    <br />
                    <label>
                        Password:
                        <input
                            name="password"
                            type="password"
                            value={this.state.password}
                            onChange={this.handleInputChange}/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }
}

export default Login;