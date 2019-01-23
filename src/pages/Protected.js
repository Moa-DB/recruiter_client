import React, {Component} from "react";



class Protected extends Component{

    componentDidUpdate(){

    }

    constructor(props) {
        super(props)

        this.state = {
            data: null
        }
    }

 /*   componentDidMount(){
        this.fetchItems()
    }*/


    /*fetchItems = () => {

        fetch('/list', {
            method: 'GET',
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log('response=' + response);
                    return response.json()
                }
            })
            .then((responseData) => {
                console.log(responseData)
                this.setState({data: responseData});
            })

    }*/

    /**
     * Fetches items from database when a new item is added in the frontend
     * Or when an item is marked as done (and should disappear)
     * @param item
     */
    addListItem = (item) => {
        this.fetchItems()
    }

    render(){
        return (
            <div>
                <h3>Applications</h3>
                <p>this should be protected...</p>

                {/* PROTECTED CONTENT HERE */}
                {/*<NewItem update = {this.addListItem} />
                <ItemList data = {this.state.data} update = {this.addListItem}/>*/}
            </div>
        )
    }
}

export default Protected;