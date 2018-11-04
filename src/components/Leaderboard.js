import React, { Component } from 'react';
import LeaderForm from './LeaderForm';
import LeaderLists from './LeaderLists';
import DifficultySelector from './DifficultySelector';
import Difficulty from '../constants/enum-difficulty';

let highScoreLists = {};
class Leaderboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      highScoreLists: highScoreLists,
      renderForm: false,
      newHighScoreIndex: null,
      currentList: null,
      formSubmitted: false
    }
    this.submitForm = this.submitForm.bind(this);
    this.changeDifficulty = this.changeDifficulty.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.score !== this.props.score) {
      this.checkLeaderlist(this.props.score);
    }
  }
  componentWillUnmount() {
    highScoreLists = this.state.highScoreLists;
  }
  checkLeaderlist(score){
    if (this.state.highScoreLists[this.props.difficulty]) {
      this.compareScore(score);
    } else {
      this.createLeaderList();
    }
  }
  createLeaderList(){
    let lists = this.state.highScoreLists;
    let listsKeyArr = Object.keys(lists);
    let difficultyKeysArr = Object.keys(Difficulty);
    if (listsKeyArr.length &&
        this.props.difficulty !== difficultyKeysArr[difficultyKeysArr.length -1]) {
      lists = this.sortListsOrder(lists, listsKeyArr);
    } else {
      lists[this.props.difficulty] = [];
    }
    this.setState({
      highScoreLists: lists,
      renderForm: true,
      newHighScoreIndex: 0
    });
  }
  sortListsOrder(lists, listArr){
    for (let i = 0; i < listArr.length; i++) {
      if (Difficulty[this.props.difficulty] < Difficulty[listArr[i]]) {
        listArr.splice(i, 0, this.props.difficulty);
        let sortedLists = {};
        lists[this.props.difficulty] = [];
        listArr.forEach(list => {sortedLists[list] = lists[list]});
        return sortedLists;
      }
    }
    lists[this.props.difficulty] = [];
    return lists;
  }
  compareScore(score){
    let leaderScores = this.state.highScoreLists[this.props.difficulty];
    if (leaderScores.some(leaderScore => score < leaderScore.score)) {
      for (let i = 0; i < leaderScores.length; i++) {
        if (score < leaderScores[i].score) {
          this.setState({
            newHighScoreIndex: i,
            renderForm: true
          });
          break;
        }
      }
    } else if (leaderScores.length < 10) {
      this.setState({
        renderForm: true,
        newHighScoreIndex: leaderScores.length
      });
    }
  }
  submitForm(data) {
    let lists = this.state.highScoreLists;
    let scores = lists[this.props.difficulty];
    scores.splice(this.state.newHighScoreIndex,0,{score: this.props.score, name: data});
    let top10 = scores.slice(0,10);
    lists[this.props.difficulty] = top10;
    this.setState({
      highScoreLists: lists,
      renderForm: false,
      currentList: this.props.difficulty,
      formSubmitted: true
    });
    this.props.changeDifficultySelect("difficultyMutable", true);
  }
  changeDifficulty(e){
    this.props.changeDifficultySelect("difficulty", e.target.value);
  }
  renderForm(){
    if (this.state.renderForm) {
      return <LeaderForm onSubmit={this.submitForm}
                         rank={this.state.newHighScoreIndex + 1}
                         difficulty={this.props.difficulty} />;
    } else {
      return (!this.state.formSubmitted && <h3>Your score wasn't fast enough for the leaderboard.  Good luck next time.</h3>
      );
    }
  }
  renderList(){
    if (Object.keys(this.state.highScoreLists).length) {
      return <LeaderLists difficulty={this.props.difficulty}
                         index={this.state.newHighScoreIndex}
                         currentList={this.state.currentList}
                         highScoreLists={this.state.highScoreLists} />;
    } else {
      return <h3>The Leaderboards are currently empty.  Join the Leaderboards by completing one of the games!</h3>;
    }
  }
  renderDifficultySelect(){
    return (
      <div>
        <h3>Optionally, before you play again, you can change the difficulty level:</h3>
        <DifficultySelector handleDifficulty={this.changeDifficulty} difficulty={this.props.difficulty} />
      </div>
    );
  }
  render() {
    return (
      <div>
        {this.props.score && this.renderForm()}
        {!this.state.renderForm && this.renderList()}
        {!this.state.renderForm && this.props.difficultyMutable && this.renderDifficultySelect()}
      </div>
    );
  }
}

export default Leaderboard;
