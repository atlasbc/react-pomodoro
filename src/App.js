import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <h3>With Class</h3>
      <TimerClass/>
      <h3>With Hooks</h3>
      <Timer/>
      </header>
    </div>
  );
}

function HelloWorld(){
  return <h1>Hello world!</h1>
}

function Timer(){
  const [timer, setTimer] = useState(5);
  const [isOn, setOnOff] = useState(false);
  const [intervalID, setintervalID] = useState(null);
  const [isCompleted, completedOnOff] = useState(false);

  function handleTimer(){
    if (isOn === false){
      setintervalID(setInterval(() => {
        setTimer(c => c - 1);
        console.log("interval is triggered");
      }, 1000));
      setOnOff(true);
      completedOnOff(false);
    }
    else{
      clearInterval(intervalID);
      console.log("Timer has stopped");
      console.log("Interval is cleaned");
      setOnOff(false);
      setTimer(5);
    }    
  }

  console.log(timer);

  if (timer <= 0 && isOn === true){
    clearInterval(intervalID);
    console.log("interval is cleaned");
    setTimer(5);
    setOnOff(false);
    completedOnOff(true);
  }

  return (
    <div>
          <h1>{timer}</h1>
            <button onClick={handleTimer} className="btn btn-info btn-sm">
            {isOn ? "Reset" : "Start"}
            </button>
            {isCompleted ? <h2>You Completed a Session!</h2>: ""}
          
    </div>
    
         )
}

class TimerClass extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      start: 5,
      intervalID: null,
      isOn: false,
      isCompleted: false
    };
    this.handleTimer = this.handleTimer.bind(this);
  }
  
  handleTimer(){
    if (this.state.isOn === false){
      let intervalID = setInterval(() => {
        this.setState({
          start: this.state.start -1
        });
        console.log("interval is triggered");
      }, 1000);
      this.setState({
        intervalID: intervalID,
        isOn: true,
        isCompleted: false
      });
    }
    else{
      clearInterval(this.state.intervalID);
      this.setState({
        isOn: false,
        start: 5
      });
    }
  }

  componentDidUpdate(){
    if (this.state.start <= 0 && this.state.isOn === true){
      clearInterval(this.state.intervalID);
      this.setState({
        isOn: false,
        start: 5,
        isCompleted: true
      });
    }
  }

  render() {

    return (
      <div>
        <h1>{this.state.start}</h1>
        <button onClick={this.handleTimer} className="btn btn-info btn-sm">
        {this.state.isOn ? "Reset" : "Start"}
        </button>
        {this.state.isCompleted ? <h2>You Completed a Session!</h2>: ""}
      </div>

    )
  }
}


export default App;
