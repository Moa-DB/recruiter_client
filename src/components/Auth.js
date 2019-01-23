import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    withRouter
} from "react-router-dom";
import Protected from '../pages/Protected';
import Login from '../pages/Login';


/**
 * Anyone can access public but when a user tries to access a protected page
 * they should be redirected to login
 * @returns {*}
 * @constructor
 */
function Auth() {
    return (
        <Router>
            <div>
                <AuthButton/>
                <Route path="/public" component={Public}/>
                <Route path="/login" component={Login}/>
                <PrivateRoute path='/protected' component={Protected} />
            </div>
        </Router>
    )
}

/**
 * Set authenticated to true or false
 *
 * @type {{user: string, isAuthenticated: boolean, authenticate(*=): void, signout(*=): void, getItems(*)}}
 */
export const auth = {
    user: "",
    isAuthenticated: false,
    authenticate(cb) {
        this.isAuthenticated = true
        setTimeout(cb, 100)

        // this.getItems(cb)
    },
    signout(cb) {
        this.user = ""
        this.isAuthenticated = false
        setTimeout(cb, 100)
    },
    getItems(cb) {

    }
}


/**
 * Show logout button when logged in and the text You are not logged in when logged out
 * Uses withRouter since AuthButton is'nt rendered by React Router and we wont have history, location or match
 * But withRouter will re-render the component every time the route changes (which is what we want)
 */
const AuthButton = withRouter(({ history }) => (
    auth.isAuthenticated ? (
        <p>
            <button onClick={() => {
                auth.signout(() => history.push('/'))
            }}>Sign out</button>
        </p>
    ) : (
        <p>You are not logged in.</p>
    )
))

/**
 * Create a PrivateRoute with same API as Route
 * Render a Route and pass all props to it
 * Render component prop if user is authenticated, otherwise redirects
 * @param Component
 * @param rest
 * @constructor
 */
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        auth.isAuthenticated
            ? ( <Component {...props} auth={auth.isAuthenticated}/> ) //TODO should check something else than auth={auth.isAuthenticated} ?
            : ( <Redirect to={{
                pathname: '/login',
                state: { from: props.location } /* save a state key, so that we can redirect the user back to where they were before login */
            }} /> )
    )} />
)



const Public = () =>
    <div>
        <h3>About this site</h3>
        <span>Use this site to apply to jobs for...</span>
        <span>You have to register an account to use this site</span>
    </div>;

export default Auth;