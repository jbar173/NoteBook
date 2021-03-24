import React from 'react';
import '../App.css';
import { BrowserRouter as Router,
          Link,
          Redirect } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { FaMoon } from 'react-icons/fa';
import { FaSun } from 'react-icons/fa';


class ListPage extends React.Component{
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
    this.fetchNotes = this.fetchNotes.bind(this)
    this.light_mode = this.light_mode.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.getCookie = this.getCookie.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
  };

abortController = new AbortController()

componentDidMount(){
  try{
    var light_mode = this.props.location.state.day_mode
    this.setState({
      day:light_mode
    });
  }catch{
    this.setState({
      day:true
    });
  }
  this.fetchNotes()
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

fetchNotes(){
  console.log("Fetching notes...")
  fetch('http://127.0.0.1:8000/api/notes-list/',
  { signal: this.abortController.signal } )
  .then(response => response.json())
  .then(data =>
      this.setState({
        notesList:data
      }),
  )
}

handleDelete(id){
  var csrftoken = this.getCookie('csrftoken')

  var url = `http://127.0.0.1:8000/api/delete-note/${id}/`

  fetch(url,{
    signal : this.abortController.signal,
    method: 'DELETE',
    headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
    },
   }).then((response => {
      this.fetchNotes()
    }))
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
      var notes = this.state.notesList
      var self = this
      var day = this.state.day

      return(
      <div className="container">
        {day===true ?

              (<div className="container main-list day">
                <div className="container list-outer">

                  <div className="align-right">
                    <button onClick={() => self.light_mode(true)}>
                    <span><FaMoon className="icons"/></span></button>
                  </div>

                  <div className="welcome">
                    <h3>Welcome to NoteBook</h3>
                  </div>

                  <div className="container create-col">
                    <div className="create-arrow-image">
                      <button style={{cursor:"pointer"}}
                      className="arrow-button"><Link to={{pathname:"/create/",
                      state: {day: day} }}
                      className="link-style">New Note</Link></button>
                    </div>
                  </div>

                  <div className="container notelist-outer">
                    <div className="container notelist">
                        {notes.map(function(note,index){
                          return(
                              <button key={index} className="note" style={{cursor:"pointer"}}>
                                  <div className="row align-right">
                                    <button type="button" onClick={() => self.handleDelete(note.id)}
                                    style={{cursor:"pointer"}}>
                                    <FaTrashAlt className="icons"/></button>
                                  </div>
                                  <Link className="link-style"
                                  to={{pathname:"/update/", state: {note_id: note.id, day_mode: day} }}>
                                    <h5 id="date-style">{note.date}</h5>
                                    <p className="co">{note.content}</p>
                                  </Link>
                              </button>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              )

        :

          (<div className="container main-list night">
            <div className="container list-outer">

              <div className="align-right">
                <button onClick={() => self.light_mode(false)}>
                <span><FaSun className="icons"/></span></button>
              </div>

              <div className="welcome">
                <h3>Welcome to NoteBook</h3>
              </div>

              <div className="container create-col">
                <div className="create-arrow-image">
                  <button style={{cursor:"pointer"}}
                  className="arrow-button"><Link to={{pathname:"/create/",
                  state: {day: day} }}
                  className="link-style">New Note</Link></button>
                </div>
              </div>

              <div className="container notelist-outer">
                <div className="container notelist">
                    {notes.map(function(note,index){
                      return(
                          <button key={index} className="note" style={{cursor:"pointer"}}>
                              <div className="row align-right">
                                <button type="button" onClick={() => self.handleDelete(note.id)}
                                style={{cursor:"pointer"}}>
                                <FaTrashAlt className="icons"/></button>
                              </div>
                              <Link className="link-style"
                              to={{pathname:"/update/", state: {note_id: note.id, day: day} }}>
                                <h5 id="date-style">{note.date}</h5>
                                <p className="co">{note.content}</p>
                              </Link>
                          </button>
                        )
                      })}
                  </div>
                </div>
              </div>
            </div>
          )
        }
  </div>)
  }
}



export default ListPage;
