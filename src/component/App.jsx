import React, { Component } from 'react';
import '../styles/App.css';

function SwitchBtn(props) {
  function handleClick(event) {
    const type = props.type;
    const value = event.target.value;
    // props.updateState({type:value});
  }
  const type = props.type[0].toUpperCase()+props.type.slice(1);
  return (
    <div className="check-btn">
      <span>{`${type} On`}</span>
      <label className="switch">
        <input type="checkbox" onClick={handleClick} />
        <span className="slider round"></span>
      </label>
      <span>{`Off`}</span>
    </div>
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      power: false,
      start: false,
      strict: false,
      steps: []
    };
  }

  soundPlay(type) {
    try {
      let audio = require(`../media/simonSound${type}.mp3`);
      let sound = new Audio(audio);
      sound.play().catch(err => console.log('Play Error:', err));
      setTimeout(() => sound.pause(), 1000);
    } catch(err) {
      console.log('Audio Error:', err);
    }
  }

  handleMouseDown(type) {
    return (event) => {
      this.soundPlay(type);
      event.preventDefault();
      event.target.classList.add('lighten');
    };
  }
  handleMouseUp(type) {
    return (event) => {
      event.preventDefault();
      event.target.classList.remove('lighten');
    };
  }

  
  render() {
    
    return (
      <div className="App">
        <h2>Simon Game</h2>
        <div className="play-board">
          <div className="row">
          <div className="square green" onMouseDown={this.handleMouseDown('Green')} onMouseUp={this.handleMouseUp('Green')}></div>
            <div className="square red" onMouseDown={this.handleMouseDown('Red')} onMouseUp={this.handleMouseUp('Red')}></div>
          </div>
          <div className="row">           
            <div className="square yellow" onMouseDown={this.handleMouseDown('Yellow')} onMouseUp={this.handleMouseUp('Yellow')}></div>
            <div className="square blue" onMouseDown={this.handleMouseDown('Blue')} onMouseUp={this.handleMouseUp('Blue')}></div>
          </div>
          <div className="circle">
            <p className="score">--</p>
          </div>
        </div>
        <div className="control-board">
          <div className="btn-left">
            <SwitchBtn type='power' />
            <SwitchBtn type='strict' />
          </div>
          <div>
            <button className="btn-right start">Start</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
