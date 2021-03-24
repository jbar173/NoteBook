import React from 'react';
import '../App.css';
import { BrowserRouter as Router,
          Link } from "react-router-dom";
import { FaMoon } from 'react-icons/fa';
import { FaSun } from 'react-icons/fa';


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
      day: true,
      updated:false,
    }
    this.getCookie = this.getCookie.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
    this.light_mode = this.light_mode.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  };

  abortController = new AbortController()

  componentDidMount(){
    console.log("mounted")
    var light_mode = this.props.location.state.day_mode
    this.setState({
      day:light_mode
    });   
  }

  componentDidUpdate(){
    if(this.state.updated === true){
      return this.props.history.push({pathname:"/", state: { day_mode: this.state.day } });
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

  light_mode(day){
    if(day === true){
      console.log("Switching to night mode");
      this.setState({
        day:false
      })
    }else{
      console.log("Switching to day mode");
      this.setState({
        day:true
      })
    }
  }

    render(){
      var active_note = this.state.activeNote.content
      var self = this
      var day = this.state.day

        return(
          <div className="container">
            {day===true ?

                (<div className="container main day">
                  <div className="container outer">

                    <div className="align-right">
                      <button onClick={() => self.light_mode(true)}>
                      <span><FaMoon className="icons"/></span></button>
                    </div>

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
                          <button type="button"><Link className="link-style"
                            to={{pathname:"/", state: { day_mode: day } }}>Cancel</Link></button>
                          <button className="align-right" type="submit">Save</button>
                        </div>
                    </form>

                  </div>
                </div>

              )

          :

              (<div className="container main night">
                <div className="container outer">

                  <div className="align-right">
                    <button onClick={() => self.light_mode(false)}>
                    <span><FaSun className="icons"/></span></button>
                  </div>

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
                        <button type="button"><Link className="link-style"
                          to={{pathname:"/", state: { day_mode: day } }}>Cancel</Link></button>
                        <button className="align-right" type="submit">Save</button>
                      </div>
                  </form>

                </div>
              </div>
            )
          }
    </div>)
  }
}

export default CreatePage;
