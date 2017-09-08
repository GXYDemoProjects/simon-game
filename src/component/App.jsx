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
  render() {
    return (
      <div className="App">
        <h2>Simon Game</h2>
        <div className="play-board">
          <div className="row">
          <div className="square green"></div>
          <div className="square red"></div>
          </div>
          <div className="row">           
          <div className="square yellow"></div>
          <div className="square blue"></div>
          </div>
          <div className="circle">
            <p className="score">11</p>
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
