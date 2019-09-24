import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "./components/navbar.component";
import Main from "./components/main.component";
import CheatSheet from "./components/cheatsheet.component";
import MatchHistory from "./components/matchhistory.component";
import SavedBuilds from "./components/savedbuilds.component";

function App() {
  return (
    <Router>
      <Navbar />
      <br/>
      <Route path="/" exact component={Main} />
      <Route path="/cheatsheet" component={CheatSheet} />
      <Route path="/matchhistory" component={MatchHistory} />
      <Route path="/savedbuilds" component={SavedBuilds} />
    </Router>
  );
}

export default App;
