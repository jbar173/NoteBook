import React from 'react';
import '../App.css';
import { BrowserRouter as Router,
          Link,
          Redirect } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { FaMoon } from 'react-icons/fa';
import { FaSun } from 'react-icons/fa';


class UpdatePage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      notesList: [],
      mode: true,
      activeNote:{
        id:null,
        date:'',
        content:''
      },
      editing:false,
      note_id:null,
      day: true,
      updated:false,
    }
    this.fetchNotes = this.fetchNotes.bind(this)
    this.fetchSingle = this.fetchSingle.bind(this)
    this.light_mode = this.light_mode.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.getCookie = this.getCookie.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.startEdit = this.startEdit.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
  };

  abortController = new AbortController()

  componentDidMount(){
    this.fetchNotes();
    var receivedId = this.props.location.state.note_id
    var light_mode = this.props.location.state.day_mode
    console.log("receivedId: " + receivedId);
    this.setState({
      day:light_mode,
      note_id:receivedId
    });
    this.fetchSingle(receivedId);
  }

  componentDidUpdate(){
    if(this.state.updated === true){
      return this.props.history.push({pathname:"/",
      state: { day_mode: this.state.day } });
    }
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
  { signal: this.abortController.signal })
  .then(response => response.json())
  .then(data =>
      this.setState({
        notesList:data
      }),
    )
  }

  fetchSingle(receivedId){
    console.log("Fetching single...")
    var note_num = receivedId
    fetch(`http://127.0.0.1:8000/api/note-detail/${note_num}/`)
      .then(response => response.json())
      .then(data =>
        this.setState({
          activeNote:data
        }),
      )
  }

  handleDelete(e){
    e.stopPropagation();
    e.preventDefault();
    var csrftoken = this.getCookie('csrftoken')
    var note_num = this.state.activeNote.id

    var url = `http://127.0.0.1:8000/api/delete-note/${note_num}/`

    fetch(url,{
      signal : this.abortController.signal,
      method: 'DELETE',
      headers:{
          'Content-type':'application/json',
          'X-CSRFToken':csrftoken,
      },
     }).then((response => {
        this.setState({
          updated:true
        })
      }))
   }

  handleSubmit(e){
    console.log("Updating single...")
    e.preventDefault()
    var csrftoken = this.getCookie('csrftoken')
    var note_num = this.state.note_id

    var url = `http://127.0.0.1:8000/api/update-note/${note_num}/`

    fetch(url,{
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
      })
    }

  startEdit(note){
    this.setState({
      activeNote:note,
      editing:true,
    })
  }

  handleChange(e){
    var name = e.target.name
    var value = e.target.value

    this.setState({
      activeNote:{
        ...this.state.activeNote,
        content:value
      }
    })
  }

  componentWillUnmount(){
    this.abortController.abort()
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

      var this_note = this.state.activeNote.content
      var day = this.state.day
      var self = this

      return(
        <div className="container">

          {day===true ?

            (<div className="container main day">
              <div className="container outer">

                  <div className="align-right">
                    <button onClick={() => self.light_mode(true)}>
                    <span><FaMoon className="icons"/></span></button>
                  </div>

                  <div>
                    <h3>Update Note</h3>
                  </div>

                  <form onSubmit={this.handleSubmit}>

                        <div className="align-delete">
                          <button type="button" onClick={this.handleDelete}>
                          <FaTrashAlt className="icons"/></button>
                        </div>

                        <div>
                          <textarea onClick={() => self.startEdit(this_note)}
                          onChange={this.handleChange} rows={30} cols={49} id="u-box"
                          name="content" value={this_note} className="form-control" />
                        </div>

                        <div>
                            <div className="align-right">
                              <button type="button"><Link className="link-style"
                                  to={{pathname:"/", state: { day_mode: day } }}>
                                  Cancel</Link></button>
                              <button className="align-right" type="submit">Save changes</button>
                            </div>
                        </div>

                    </form>

              </div>
            </div>)

        :

        (<div className="container main night">
          <div className="container outer">

              <div className="align-right">
                <button onClick={() => self.light_mode(false)}>
                <span><FaSun className="icons"/></span></button>
              </div>

              <div>
                <h3>Update Note</h3>
              </div>

              <form onSubmit={this.handleSubmit}>

                    <div className="align-delete">
                      <button onClick={this.handleDelete}>
                      <FaTrashAlt className="icons"/></button>
                    </div>

                    <div>
                      <textarea onClick={() => self.startEdit(this_note)}
                      onChange={this.handleChange} rows={30} cols={49} id="u-box"
                      name="content" value={this_note} className="form-control" />
                    </div>

                    <div>
                        <div className="align-right">
                          <button type="button"><Link className="link-style"
                              to={{pathname:"/", state: { day_mode: day } }}>
                              Cancel</Link></button>
                          <button className="align-right" type="submit">Save changes</button>
                        </div>
                    </div>

                </form>

          </div>
        </div>)
        }
    </div>)

  }
}

export default UpdatePage;
