import React, { Component } from 'react';
import {server} from '../config';
import './ApplicationsHandler.css';


/**
 * Lets the user browse applications in a list with multiple pages, view details about applications and update their status.
 * A box with search filters lets the user filter applications.
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
            status: 0,
            oldStatus: "",
        };

        this.fetchApplications = this.fetchApplications.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.applicationDetailedView = this.applicationDetailedView.bind(this);
        this.applicationsListView = this.applicationsListView.bind(this);
        this.changeView = this.changeView.bind(this);
        this.filterApplications = this.filterApplications.bind(this);
        this.fetchCompetences = this.fetchCompetences.bind(this);
        this.createFilterPostBody = this.createFilterPostBody.bind(this);
        this.fetchFilteredApplications = this.fetchFilteredApplications.bind(this);
        this.splitApplicationsList = this.splitApplicationsList.bind(this);
        this.changePage = this.changePage.bind(this);
        this.putStatus = this.putStatus.bind(this);
        this.getStatuses = this.getStatuses.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.updateSelectedApplication = this.updateSelectedApplication.bind(this);
        this.updateApplicationLists = this.updateApplicationLists.bind(this);

    }

    componentDidMount() {
        this.fetchCompetences();
        this.getStatuses();
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
            .then(data => this.setState({applications: data}, ()=>{this.splitApplicationsList(); this.updateSelectedApplication();}))
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
     * GETs all statuses.
     */
    getStatuses(){
        fetch(server + "/statuses",
            {credentials: 'include'}
        )
            .then(res => res.json())
            .then(data => this.setState({statuses: data, status: data[0].name}))
            .catch(e => console.log(e))
    }

    /**
     * Sends a PUT request to the server to update status of an application. The "oldStatus" state variable is placed in
     * the body of the request for handling concurrency. If someone else is updating the status of the same application
     * error 409 will be thrown and the message presented to the user. All applications will also be fetched again to
     * get the latest version of the current "selectedApplication" and its new status.
     * @param id, id of the application to be updated
     * @param status, the new status
     */
    putStatus(id, status){
        let api = status;
        if(status === "ACCEPTED")
            api = "accept";
        else if(status === "REJECTED")
            api = "reject";
        else if(status === "UNHANDLED")
            api = "unhandle";
        else{
            alert("Unknown status.")
            return;
        }

        let requestBody = { "status": this.state.oldStatus.name}
        fetch(server + "/applications/" + id + "/" + api,
            {
                credentials: 'include',
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody),
            }
        )
            .then((response) => {
                return response.json();
            })
            .then((response) =>
             {
                if (!response.ok && response.status === 409) throw new Error(response.message);
                else if (!response.ok && response.status === 500) throw new Error("Internal Server Error");
                else return response;
             })
            .then(data =>{
                this.updateApplicationLists(data);})
            .catch(e => {
                alert(e.message + "\n \n Please try to update the status again.");
                this.fetchFilteredApplications(this.createFilterPostBody());
            })
    }

    /**
     * Updates all the lists containing applications and replace the old version of the given application.
     * @param updatedApplication, the application to update the applications lists with.
     */
    updateApplicationLists(updatedApplication){

        let applications = this.state.applications;
        applications.forEach((application) =>{
            if(application.id === updatedApplication.id){
                application.status = updatedApplication.status;
            }
        });

        let applicationsInPage = this.state.selectedApplications;
        applicationsInPage.forEach((application) =>{
            if(applicationsInPage.id === updatedApplication.id){
                application.status = updatedApplication.status;
            }
        });

        let dividedApplications = this.state.dividedApplications;
        dividedApplications[this.state.page] = applicationsInPage;
        this.setState({
            selectedApplication: updatedApplication,
            oldStatus: updatedApplication.status,
            applications: applications,
            selectedApplications: applicationsInPage,
            dividedApplications: dividedApplications,
        })
    }

    /**
     * Iterates trough all applications and updates the currently viewed application and its status is added to
     * the state variable "oldStatus".
     */
    updateSelectedApplication(){
        if(!this.state.showDetailedView && !this.selectedApplication)
            return;
        this.state.applications.forEach((application, index) =>{
            if(this.state.selectedApplication.id === application.id){
                this.setState({selectedApplication: application, oldStatus: application.status})
            }
        }
            )
    }



    /**
     * Handles input from the input fields and updates their corresponding state variables.
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

    /**
     * Sets state variables depending on what view shall be rendered.
     * @param viewName, name of the view that is to be rendered.
     */
    changeView(viewName){
        this.setState({
            showDetailedView: viewName === "detailed",
            showApplicationsListView: viewName === "list",
        })
    }

    /**
     * Divides a raw list of applications into a list containing smaller lists representing pages.
     */
    splitApplicationsList(){
        let i = 0;
        let subList = [];
        let applicationsList = [];
        if(this.state.applications.length > 0){
            this.state.applications.forEach((application, index) =>
                {
                    if(index % 12 === 0 && index !== 0){
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

    /**
     * Updates state variables 'page' to the new page and 'selectedApplications' to the new position in "dividedApplicaitons"
     * which holds nested lists of applications divided into pages.
     * @param direction
     */
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


    /**
     * Presents the user with a detailed view of the selected application.
     * @returns {*}
     */
    applicationDetailedView(){
        let application = this.state.selectedApplication;
        return <div >
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

    /**
     * Presents the user with a drop down list to select a new status for the currently viewed application.
     * Takes the selected status and calls a fetch method.
     * @returns {*}
     */
    updateStatus(){
        return(
            <div className={"SideBox"}>
                <p className="FormText">change status below:</p>
                <select name="status" value={this.state.status} onChange={this.handleInputChange}>
                    { this.state.statuses.map((status) =>
                        <option
                            value={status.name}
                            key={status.name} >{status.name}
                        </option>)
                    }
                </select>
                <br/>
                <br/>
                <button name="changeStatus" onClick={()=>this.putStatus(this.state.selectedApplication.id, this.state.status)} >update status</button>
            </div>
        )
    }

    /**
     * Iterates trough all applications in the current 'page' of applications and displays them.
     * @returns {*}
     */
    applicationsListView(){
        if(this.state.selectedApplications && this.state.selectedApplications.length > 0){
            return <div id={"listView"}>
                { this.state.selectedApplications.map((application, index) =>
                    <div id={"listDiv"} key={"l" + application.id} onClick={()=>this.setState({showDetailedView: true, selectedApplication: application, oldStatus: application.status},this.applicationDetailedView)}>
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

    /**
     * Generates Json from state variables for filtered application fetch.
     * @returns {{name: string, application_date: string, competence: string, from_time: string, to_time: string}}
     */
    createFilterPostBody(){
        return {
            "name": this.state.name,
            "application_date": this.state.applicationDate === "0" ? "" : this.state.applicationDate,
            "competence": this.state.competence === "All" ? "" : this.state.competence,
            "from_time": this.state.fromDate === "0" ? "" : this.state.fromDate,
            "to_time": this.state.toDate === "0" ? "" : this.state.toDate,
             }
    }

    /**
     * Presents the user with a form taking filter parameters to narrow down applications. On submit, a function that
     * generates a Json request from the state variables associated with the form inputs is triggered, and the result is
     * posted to the server using fetch.
     * @returns {*}
     */
    filterApplications(){
        return (<div className={"SideBox"}>
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
            <select name="competence" value={this.state.competence} onChange={this.handleInputChange}>
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
            <br/>
            <label>
                name:
                <br/>
                <input
                    name="name"
                    type="text"
                    value={this.state.name}
                    onChange={this.handleInputChange}/>
            </label>
            <br/>
            <br/>
            <button name="filter" onClick={()=>this.fetchFilteredApplications(this.createFilterPostBody())} >search for matching applications</button>
        </div>)
    }

    render() {
        if(this.state.showDetailedView){
            return(
                <div className={"OuterDiv"}>
                    {this.updateStatus()}
                    {this.applicationDetailedView()}
                    <br/>
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