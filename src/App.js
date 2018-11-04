import React, { Component } from 'react';
import './App.css';
import Board from './components/Board';
import GameHeader from './components/GameHeader';
import Difficulty from './constants/enum-difficulty';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      stage: null,
      difficulty: Object.keys(Difficulty)[0],
      score: null,
      difficultyMutable: false
    }
    this.changeGame = this.changeGame.bind(this);
  }
  changeGame(stateKey,value){
    this.setState({
      [stateKey]: value
    })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Memory Match Game</h1>
          <GameHeader handleChange={this.changeGame}
                      gameStage={this.state.stage}
                      difficulty={this.state.difficulty} />
        </header>
        <Board gameStage={this.state.stage}
               score={this.state.score}
               difficultyMutable={this.state.difficultyMutable}
               difficulty={this.state.difficulty}
               changeGame={this.changeGame} />
      </div>
    );
  }
}

export default App;
