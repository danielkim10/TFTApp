import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar=dark bg-dark navbar-expand">
        <Link to="/" className="navbar-brand">Main</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
              <Link to="/cheatsheet" className="nav-link">Cheat Sheet</Link>
            </li>
            <li className="navbar-item">
              <Link to="/matchhistory" className="nav-link">Match History</Link>
            </li>
            <li className="navbar-item">
              <Link to="/savedbuilds" className="nav-link">Saved Builds</Link>
            </li>
            <li className="navbar-item">
              <Link to="/create" className="nav-link">Create</Link>
            </li>
            <li className="navbar-item">
              <Link to="/edit" className="nav-link">Edit</Link>
            </li>
            <li className="navbar-item">
              <Link to="/guides" className="nav-link">Guides</Link>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}
