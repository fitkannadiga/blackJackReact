import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.scss';
import Home from './components/Home/home';
import Game from './components/Game/game';


export default class App extends Component {
  render() {
    return (
      <Router>
        <div id="main-wrapper">
        <img src="/static/img/blackjack2.png" class="card-image"/>
        <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/game">
              <Game />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}
