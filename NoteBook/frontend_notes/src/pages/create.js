import React from 'react';
import '../App.css';
import { BrowserRouter as Router,
          Link } from "react-router-dom";


class CreatePage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      notesList: [],
      mode: true,
      activeNote:{
        'id':null,
        'date':'',
        'content':'',
      },
      editing:false,
      note_id:null,
      updated:false,
    }
    this.getCookie = this.getCookie.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  };

  abortController = new AbortController()

  componentDidMount(){
    console.log("mounted")
  }

  componentDidUpdate(){
    if(this.state.updated === true){
      return this.props.history.push('/');
    }
  }

  componentWillUnmount(){
  this.abortController.abort()
}

  getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();

              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
  }


  handleChange(e){
    console.log("handling..")
    e.stopPropagation()
    var value = e.target.value

    this.setState({
      activeNote:{
        ...this.state.activeNote,
        content:value
      }
    })
  }

  handleSubmit(e){
    console.log("submitting..")
    e.preventDefault()

    var csrftoken = this.getCookie('csrftoken')

    var url = 'http://127.0.0.1:8000/api/create-note/'

    fetch(url,{
      signal : this.abortController.signal,
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
      body:JSON.stringify(this.state.activeNote)
    }).then((response) => {
        this.setState({
          updated:true
        })
      }).catch(function(error){
        console.log("ERROR:", error)
      })
  }

    render(){
      var active_note = this.state.activeNote.content

        return(
          <div className="container main">
            <div className="container outer">
              <div >
                <h3>New Note</h3>
              </div>

              <form onSubmit={this.handleSubmit}>
                  <div>
                  <textarea onChange={this.handleChange} type="text"
                  value={active_note} rows={30} cols={49}
                  className="form-control" />
                  </div>
                  <div className="align-right">
                    <button type="button"><Link className="link-style" to="/">Cancel</Link></button>
                    <button className="align-right" type="submit">Save</button>
                  </div>
              </form>

            </div>
          </div>

        )
    }
}

export default CreatePage;
