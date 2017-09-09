import React, {Component} from 'react';
import GithubCorner from 'react-github-corner';
import '../styles/App.css';

function SwitchBtn(props) {
  const type = props.type[0].toUpperCase() + props.type.slice(1);
  return (
    <div className="check-btn">
      <span>{`${type} On`}</span>
      <label className="switch">
        <input type="checkbox" onClick={props.onClick}/>
        <span className="slider round"></span>
      </label>
      <span>{`Off`}</span>
    </div>
  );
}

class App extends Component {
  constructor() {
    super();

    this.exampleTimerId = 0;
    this.waitTimerId = 0;
    this.soundTimerId = 0;
    this.start = false;
    this.power = false;
    this.strict = false;
    this.singleStep = 0;
    this.gameSteps = [];
    this.disableClick = true;
    this.currentAudio = null;
    this.type = ['green', 'red', 'yellow', 'blue'];
    this.greenMouseDown = this.handleMouseDown('green').bind(this);
    this.redMouseDown = this.handleMouseDown('red').bind(this);
    this.yellowMouseDown = this.handleMouseDown('yellow').bind(this);
    this.blueMouseDown = this.handleMouseDown('blue').bind(this);
    this.greenMouseUp = this.handleMouseUp('green').bind(this);
    this.redMouseUp = this.handleMouseUp('red').bind(this);
    this.yellowMouseUp = this.handleMouseUp('yellow').bind(this);
    this.blueMouseUp = this.handleMouseUp('blue').bind(this);
    this.state = {
      score: '--'
    };
  }

  // effect

  initialAudio(type) {
    let audio;
    try {
      const source = require(`../media/simonSound${type}.mp3`);
      audio = new Audio(source);
    } catch (err) {
      audio = null;
      console.error('Do not support Audio API');
    }
    return audio;
  }

  squarePlay(interval) {
    const step = this.singleStep;
    const type = this.type[this.gameSteps[step]];
    this.singleStep += 1;
    this[type].classList.add('lighten');
    this.currentAudio = this.initialAudio(type);
    if (this.currentAudio) {
      this.currentAudio.play().catch(err => console.log(err));
    }
    if (this.singleStep === this.gameSteps.length) {
        clearInterval(this.exampleTimerId);
    }
    this.soundTimerId = setTimeout(() => {
      if (this.currentAudio) {
        this.currentAudio.pause();
      }
      this[type].classList.remove('lighten');
      if (this.singleStep === this.gameSteps.length) {
        this.disableClick = false;
        this.singleStep = 0;
        this.waitTimerId = setTimeout(() => {
            this.finalResult('error');
          }, 4000);
      }
    }, interval - 200);
  }
  examplePlay() {
    const len = this.gameSteps.len;
    const interval = len < 10 ? 1500 : 900;
    this.disableClick = true;
    this.exampleTimerId = setInterval(() => {
      this.squarePlay(interval);
    }, interval);
  }

  updateScore() {
    let score = this.gameSteps.length.toString();
    score = score.length < 2 ? '0' + score.toString() : score;
    this.setState({score: score});
  }

  finalResult(message) {
    this.disableClick = true;
    if (message === 'error') {
      this.setState({score: 'Error'});
      this.currentAudio = this.initialAudio('error');
      if (this.currentAudio) {
        this.currentAudio.play();
      }
      setTimeout(() => {
        if (this.currentAudio) {
          this.currentAudio.pause();
        }
        if (this.strict) {
          this.startGame();
        } else {
          this.updateScore();
          this.examplePlay();
        }
      }, 1000);
    }
    if (message === 'success') {
      this.setState({score: 'Success'});
      this.currentAudio = this.initialAudio('success');
      if (this.currentAudio) {
        this.currentAudio.play();
      }
      setTimeout(() => {
        if (this.currentAudio) {
          this.currentAudio.pause();
        }
      }, 1000);
    }
  }

  handleMouseDown(type) {
    return (event) => {
      if (!this.power || !this.start || this.disableClick) {
        return;
      }
      event.preventDefault();
      // clear waitTimerId
      if (this.waitTimerId) {
        clearTimeout(this.waitTimerId);
      }
      // sigle step right
      const needStep = this.gameSteps[this.singleStep];
      const needType = this.type[needStep];
      if (type === needType) {
        this.currentAudio = this.initialAudio(type);
        // if it's middle step if it's final single step if it's final game step
      } else {
        // step wrong
        this.currentAudio = this.initialAudio('error');
        this.setState({score: 'Error'});
      }
      if (this.currentAudio) {
        this.currentAudio.play();
      }
      event.target.classList.add('lighten');
    };
  }
  handleMouseUp(type) {
    return (event) => {
      if (!this.power || !this.start || this.disableClick) {
        return;
      }
      event.preventDefault();
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }
      event.target.classList.remove('lighten');
      const needStep = this.gameSteps[this.singleStep];
      const needType = this.type[needStep];
      if (type === needType) {
        this.singleStep += 1;
        // if it's middle step
        if (this.singleStep < this.gameSteps.length) {
          this.waitTimerId = setTimeout(() => {
            this.finalResult('error');
          }, 4000);
        }
        // if it's final single step
        if (this.singleStep === this.gameSteps.length && this.gameSteps.length < 20) {
          this.gameSteps.push(this.getRandom());
          this.updateScore();
          this.singleStep = 0;
          this.examplePlay();
        }
        // if it's final game step
        if (this.singleStep === this.gameSteps.length && this.gameSteps.length >= 20) {
          this.finalResult('success');
        }
      } else {
        // step wrong if strict = true
        if (this.strict) {
          this.startGame();
        } else {
          this.updateScore();
          this.examplePlay();
        }
      }

      //
    };
  }

  // logic
  getRandom() {
    return Math.floor(Math.random() * 4);
  }

  // score

  togglePower() {
    this.power = !this.power;
    if(!this.power) {
      this.resetGame();
    }
    console.log('this.power:',this.power);
  }

  toggleStrict() {
    this.strict = !this.strict;
    console.log('this.strict:',this.strict);
  }

  resetGame() {
    if (this.exampleTimerId) {
      clearInterval(this.exampleTimerId);
    }
    if(this.currentAudio) {
      this.currentAudio.pause();
    }
    if (this.soundTimerId) {
      clearTimeout(this.soundTimerId);
    }
    if (this.waitTimerId) { 
      clearTimeout(this.waitTimerId);
    }
    this.start = false;
    this.singleStep = 0;
    this.gameSteps = [];
    this.disableClick = true;
    this.currentAudio = null;
    this.setState({score: '--'});
  }

  startGame() {
    this.resetGame();
    if(this.power) {
      this.start = true;
      this.gameSteps.push(this.getRandom());
      this.updateScore();
      this.examplePlay();
    }
  }

  render() {

    return (
      <div className="App">
        <GithubCorner 
          href="https://github.com/GuoXiaoyang/Simon-Game"
          bannerColor="#EF4F4F"
          octoColor="#272727"
        />
        <h2>Simon Game</h2>
        <div className="play-board">
          <div className="row">
            <div
              className="square green"
              ref={div => this.green = div}
              onMouseDown={this.greenMouseDown}
              onMouseUp={this.greenMouseUp}></div>
            <div
              className="square red"
              ref={div => this.red = div}
              onMouseDown={this.redMouseDown}
              onMouseUp={this.redMouseUp}></div>
          </div>
          <div className="row">
            <div
              className="square yellow"
              ref={div => this.yellow = div}
              onMouseDown={this.yellowMouseDown}
              onMouseUp={this.yellowMouseUp}></div>
            <div
              className="square blue"
              ref={div => this.blue = div}
              onMouseDown={this.blueMouseDown}
              onMouseUp={this.blueMouseUp}></div>
          </div>
          <div className="circle">
            <p className="score">{this.state.score}</p>
          </div>
        </div>
        <div className="control-board">
          <div className="btn-left">
            <SwitchBtn type='power' onClick={() => this.togglePower()}/>
            <SwitchBtn type='strict' onClick={() => this.toggleStrict()}/>
          </div>
          <div>
            <button className="btn-right start" onClick={() => this.startGame()}>Start</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
