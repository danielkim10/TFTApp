import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Navigation from "./components/navbar.component";
import Main from "./components/main.component";
import ChampionsCheatSheet from "./components/cheatsheet-pages/champions-cheatsheet.component";
import SynergiesCheatSheet from "./components/cheatsheet-pages/synergies-cheatsheet.component";
import ItemsCheatSheet from "./components/cheatsheet-pages/items-cheatsheet.component";
import MatchHistory from "./components/match-history/matchhistory.component";
import Match from "./components/match-history/match.component.js";
import SavedBuilds from "./components/savedbuilds.component";
import Create from "./components/create.component";
import Edit from "./components/edit-pages/edit.component";
import Champion from "./components/edit-pages/champion.component";
import Class from "./components/edit-pages/class.component";
import Item from "./components/edit-pages/item.component";
import Origin from "./components/edit-pages/origin.component";
import Guides from "./components/guides.component";

function App() {
  return (
    <Router>
      <div className>
        <Navigation />
        <br/>
        <Route path="/" exact component={Main} />
        <Route path="/cheatsheet/champions" component={ChampionsCheatSheet} />
        <Route path="/cheatsheet/synergies" component={SynergiesCheatSheet} />
        <Route path="/cheatsheet/items" component={ItemsCheatSheet} />
        <Route path="/matchhistory" component={MatchHistory} />
        <Route path="/matchhistory/:id" component={Match} />
        <Route path="/savedbuilds" component={SavedBuilds} />
        <Route path="/create" component={Create}/>
        <Route path="/edit" component={Edit} />
        <Route path="/champion/:id" component={Champion}/>
        <Route path="/class/:id" component={Class} />
        <Route path="/item/:id" component={Item} />
        <Route path="/origin/:id" component={Origin} />
        <Route path="/guides" component={Guides} />
      </div>
    </Router>

  );
}

export default App;
