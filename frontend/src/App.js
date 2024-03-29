import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Navigation from "./components/navbar.component";
import Main from "./components/main-page/main/main.component";
import ChampionsCheatSheet from "./components/cheatsheet-pages/champions-cheatsheet/champions-cheatsheet.component";
import TraitsCheatSheet from "./components/cheatsheet-pages/traits-cheatsheet/traits-cheatsheet.component";
import ItemsCheatSheet from "./components/cheatsheet-pages/items-cheatsheet/items-cheatsheet.component";
import MatchHistory from "./components/match-history/match-history-main/match-history.component";
import Profile from "./components/match-history/profile/profile";
import SampleData from "./components/match-history/sample-data/sample-data";
import Teams from "./components/teams/teams.component";

function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <br/>
        <Route path="/" exact component={Main} />
        <Route path="/cheatsheet/champions" component={ChampionsCheatSheet} />
        <Route path="/cheatsheet/traits" component={TraitsCheatSheet} />
        <Route path="/cheatsheet/items" component={ItemsCheatSheet} />
        <Route path="/matchhistory" component={MatchHistory} />
        <Route path="/profile" component={Profile} />
        <Route path="/sampledata" component={SampleData} />
        <Route path="/savedteams" component={Teams} />
      </div>
    </Router>

  );
}

export default App;
