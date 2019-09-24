import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar=dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">Bad TFT</Link>
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
          </ul>
        </div>
      </nav>
    )
  }
}
