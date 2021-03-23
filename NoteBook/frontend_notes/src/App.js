import React from 'react';
import './App.css';
import { BrowserRouter as Router,
          Route,
          Switch,
          Link,
          Redirect } from "react-router-dom";
import CreatePage from "./pages/create.js";
import UpdatePage from "./pages/update.js";
import ListPage from "./pages/list.js";


class App extends React.Component{

    render(){

        return(
          <div>
            <Router>
              <Switch>
              <Route exact path="/" component={ListPage} />
              <Route exact path="/create/" component={CreatePage} />
              <Route exact path="/update/" component={UpdatePage} />
              </Switch>
            </Router>
          </div>

       )
    }
}
export default App;
