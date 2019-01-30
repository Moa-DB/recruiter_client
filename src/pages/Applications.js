import React, {Component} from "react";
import ApplicationsHandler from '../components/ApplicationsHandler';



class Applications extends Component{

    constructor(props) {
        super(props)

        this.state = {
        }
    }
    render(){
        return (
            <div>
                <ApplicationsHandler/>
            </div>
        )
    }
}

export default Applications;