import React, { Component } from 'react';
import {server} from '../config';
import './ApplicationsHandler.css';


/**
 * Lets the user create an application in three steps. Step one lets the user choose competence from a drop down list and
 * write number of years in that competence in a input field. Step two lets the user add time periods to the application
 * by giving two dates as input. Step three lets the user view the application and then hand it in or cancel.
 */
class ApplicationsHandler extends Component {
    constructor() {
        super();

        this.state = {
            applications: [],
            dividedApplications: [],
            selectedApplications: [],
            selectedApplication: null,
            showApplicationsListView: true,
            showDetailedView: false,
            fromDate: "0",
            toDate: "0",
            applicationDate: "0",
            competences: [],
            competence: "",
            name: "",
            page: 0,
        };

        this.fetchApplications = this.fetchApplications.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.applicationDetailedView = this.applicationDetailedView.bind(this);
        this.applicationsListView = this.applicationsListView.bind(this);
        this.changeView = this.changeView.bind(this);
        this.filterApplications = this.filterApplications.bind(this);
        this.fetchCompetences = this.fetchCompetences.bind(this);
        this.createFilterPostBody = this.createFilterPostBody.bind(this);
        this.fetchFilteredApplications = this.fetchFilteredApplications.bind(this);
        this.splitApplicationsList = this.splitApplicationsList.bind(this);
        this.changePage = this.changePage.bind(this);

    }


    componentDidMount() {
        this.fetchCompetences();
        this.fetchFilteredApplications(this.createFilterPostBody());
    }

    /**
     * GETs all the applications from the server.
     */
    fetchApplications() {
        fetch(server + "/applications/filter",
            {credentials: 'include'}
        )
            .then(res => res.json())
            .then(data => this.setState({applications: data}, ()=>{this.splitApplicationsList()}))
            .catch(e => console.log(e))
    }

    /**
     * POSTs a request with filter parameters to receive matching applications in the response.
     */
    fetchFilteredApplications(filterParameters) {
        fetch(server + "/applications/filter",
            {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(filterParameters),
            }
        )
            .then(res => res.json())
            .then(data => this.setState({applications: data}, ()=>{this.splitApplicationsList()}))
            .catch(e => console.log(e))
    }

    /**
     * GETs all the competences from the server.
     */
    fetchCompetences() {
        fetch(server + "/competences",
            {credentials: 'include'}
        )
            .then(res => res.json())
            .then(data => this.setState({competences: data}))
            .catch(e => console.log(e))
    }


    /**
     * Handles changed selection in the competence selector.
     * @param event
     */
    handleSelect(event) {
        this.setState({competence: event.target.value});
    }

    /**
     * Handles input from the input fields.
     * @param event
     */
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    splitApplicationsList(){
        let i = 0;
        let subList = [];
        let applicationsList = [];
        if(this.state.applications.length > 0){
            this.state.applications.forEach((application, index) =>
                {
                    if(index % 15 === 0 && index !== 0){
                        applicationsList[i] = subList;
                        i++;
                        subList = [];
                    }
                    subList.push(application)
                }
            )
            applicationsList[i] = subList;
        }
        this.setState({dividedApplications: applicationsList, selectedApplications: applicationsList[0]})
    }

    changePage(direction){
        let pageNr = this.state.page;
        if(direction === "+" && pageNr < this.state.dividedApplications.length - 1){
            pageNr = pageNr +1;
        }
        else if(direction === "-" && pageNr > 0){
            pageNr = pageNr -1;
        }
        this.setState({selectedApplications: this.state.dividedApplications[pageNr], page: pageNr})
    }


    applicationDetailedView(){
        let application = this.state.selectedApplication;
        return <div >
            <p className="FormText">Application</p>
                    <div key={"l" + application.id}>
                        <div id={"showApplication"}>
                            <h2>{application.status.name}</h2>
                            <p>Name: {application.person.name + " " + application.person.surname}</p>
                            <p>SSN: {application.person.ssn}</p>
                            <p>Email: {application.person.email}</p>


                            <h2>Competence profiles: </h2>
                            <ul>
                                {application.competenceProfiles.map((competenceProfile, index) =>
                                    <li key={"l" + competenceProfile.competence.name}>
                                        {competenceProfile.competence.name + ", " + competenceProfile.yearsOfExperience + " years"}
                                    </li>)}</ul><br/>
                            <h2>Availabilities: </h2>
                            <ul>
                                {application.availabilities.map((availability, index) =>
                                    <li key={availability.fromDate + availability.toDate}>{"from: " + availability.fromDate + ", to: " + availability.toDate}
                                    </li>)}
                            </ul>
                        </div>
                    </div>
        </div>;
    }

    applicationsListView(){
        if(this.state.selectedApplications && this.state.selectedApplications.length > 0){
            return <div id={"listView"}>
                { this.state.selectedApplications.map((application, index) =>
                    <div id={"listDiv"} key={"l" + application.id} onClick={()=>this.setState({showDetailedView: true, selectedApplication: application},this.applicationDetailedView)}>
                        <p id={"listName"}>{application.person.name + " " + application.person.surname}</p><p id={"listDate"}>{application.date}</p>
                    </div>)
                }
                <p id={"pageNr"}>{(this.state.page + 1) + "/" + this.state.dividedApplications.length}</p>
            </div>;
        }
        else{
            return <div id={"listView"}>no results</div>
        }
    }

    changeView(viewName){
        this.setState({
            showDetailedView: viewName === "detailed",
            showApplicationsListView: viewName === "list",
        })
    }

    createFilterPostBody(){
        return {
            "name": this.state.name,
            "application_date": this.state.applicationDate === "0" ? "" : this.state.applicationDate,
            "competence": this.state.competence === "All" ? "" : this.state.competence,
            "from_time": this.state.fromDate === "0" ? "" : this.state.fromDate,
            "to_time": this.state.toDate === "0" ? "" : this.state.toDate,
             }
    }

    filterApplications(){
        return (<div id={"filterChoices"}>
            <div>
            <label>
                <p className="FormText">available from:</p>
                <input
                    name="fromDate"
                    type="date"
                    value={this.state.fromDate}
                    onChange={this.handleInputChange}/>
            </label>
            <label>
                <p className="FormText">available to:</p>
                <input
                    name="toDate"
                    type="date"
                    value={this.state.toDate}
                    onChange={this.handleInputChange}/>
            </label></div>
            <label>
                <p className="FormText">application date:</p>
                <input
                    name="applicationDate"
                    type="date"
                    value={this.state.applicationDate}
                    onChange={this.handleInputChange}/>
            </label>
            <p className="FormText">select competence below:</p>
            <select name="competence" value={this.state.competence} onChange={this.handleSelect}>
                <option
                    value={"All"}
                    key={"All"} >{"all competences"}
                </option>
                { this.state.competences.map((competence) =>
                    <option
                        value={competence.name}
                        key={competence.name} >{competence.name}
                    </option>)
                }
            </select>
            <label>
                name:
                <input
                    name="name"
                    type="text"
                    value={this.state.name}
                    onChange={this.handleInputChange}/>
            </label>
            <br/>
            <button name="filter" onClick={()=>this.fetchFilteredApplications(this.createFilterPostBody())} >search for matching applications</button>
        </div>)
    }

    render() {
        if(this.state.showDetailedView){
            return(
                <div className={"OuterDiv"}>
                    {this.applicationDetailedView()}
                    <button name="submit" onClick={()=>this.changeView("list")} >go back to applications list</button>
                </div>
            )
        }
        else if(this.state.showApplicationsListView){
            return(
                <div className={"OuterDiv"}>
                    {this.filterApplications()}
                    {this.applicationsListView()}
                    <br/>
                    <button name="changePage" onClick={()=>this.changePage("-")} >previous page</button>
                    <button name="changePage" onClick={()=>this.changePage("+")} >next page</button>
                </div>
            );
        }

    }
}

export default ApplicationsHandler;