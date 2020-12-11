import './App.css';
import React, { useState, useEffect } from 'react';
import soundfile from './Alarm-ringtone.mp3';
import { Howl, Howler } from 'howler';

function App() {
	return (
		<div className="bg-indigo-100 h-screen w-screen overflow-auto">
			<header className="bg-indigo-500 h-20 text-center text-indigo-200 text-4xl">
				Start a new session
			</header>
			<div className="flex h-full">
				<div className="w-1/4 h-full">
					<div className="w-1/2  m-auto ">
						<Sessions />
					</div>
				</div>

				<div className="w-3/4 h-full ">
					<div className="w-1/2 h-1/2 m-auto ">
						<Timer />
					</div>
				</div>
			</div>
			<div className="bg-indigo-500 h-20 w-full text-indigo-200 text-center">
				Footer
			</div>
		</div>
	);
}

// Format ending and starting time HH/MM by getting Date object
// This could be in a util file
function getHHMM(date) {
	if (!date) {
		return null;
	}
	let hh = date.getHours();
	let mm = date.getMinutes();

	if (mm < 10) {
		mm = '0' + mm;
	}
	if (hh < 10) {
		hh = '0' + hh;
	}
	return hh + ':' + mm;
}

function getDDMMYYYY(date) {
	if (!date) {
		return null;
	}
	let dd = date.getDate();
	let mm = date.getMonth();
	let yyyy = date.getFullYear();

	if (dd < 10) {
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm;
	}
	return dd + '/' + mm + '/' + yyyy;
}

const today = getDDMMYYYY(new Date());

function HelloWorld() {
	return <h1>Hello world!</h1>;
}

function Sessions() {
	// This components gets session data from localStorage and displays it

	const [ sessions, setSessions ] = useState(localStorage.getItem(today));

	// After each session I need to retrieve local storage and push the new session to it
	// Then after updating I need to set updated storage again.
	// I may need a new Date object for retrieving Today's sessions.
	let session_prototype = {
		'28/11/2020': [
			{
				session_time: 30,
				start_time: '15:37',
				finish_time: '16:07',
				project_name: null
			},
			{
				session_time: 45,
				start_time: '16:30',
				finish_time: '17:15',
				project_name: null
			}
		]
	};
	// Retrieving a specific date give me an array consist of session objects.
	// I need to push completed session objects to this array
	// Then I need to update the local storage.

	//Display sessions as list items
	// TODO -> This should only repeat when localStorage is updated, not in each render.
	const session_display = [];
	// const ss = session_prototype["28/11/2020"]
	const ss = JSON.parse(sessions);
	console.log('session_prototype is: ', session_prototype);
	for (let i in ss) {
		const session = ss[i];
		console.log(session);
		session_display.push(
			<li>
				{session['start_time']} - {session['finish_time']} ={' '}
				{session['session_time']} min{' '}
			</li>
		);
	}

	let arr = { minutes: 5, time: '16:07' };
	function addSession() {
		console.log('Session is added');
		localStorage.setItem('sessions', JSON.stringify(arr));
		setSessions(localStorage.getItem('sessions'));
	}
	function removeSession() {
		console.log('Session is removed');
		localStorage.removeItem('sessions');
		setSessions(localStorage.getItem('sessions'));
	}

	return (
		<div className="flex-column">
			<h2>Sessions</h2>
			<div>{today}</div>
			<div className="sessions">
				<ul>{session_display}</ul>
				<div>
					<button
						className="btn btn-info btn-sm"
						onClick={addSession}
					>
						Add
					</button>
					<button
						className="btn btn-info btn-sm"
						onClick={removeSession}
					>
						Remove
					</button>
				</div>
			</div>
		</div>
	);
}

function Timer() {
	const [ seconds, setSeconds ] = useState(0);
	// Set up starter minutes utilizing localStorage
	const starter_session = localStorage.getItem('starterminutes');
	let starter = 5;
	if (starter_session) {
		starter = parseInt(starter_session);
	}
	const [ starterminutes, setStarterMinutes ] = useState(starter);

	const [ minutes, setMinutes ] = useState(starterminutes);
	const [ intervalID, setintervalID ] = useState(null);

	const [ zero, setZero ] = useState(null);
	const [ isOn, setOnOff ] = useState(false);
	const [ isCompleted, completedOnOff ] = useState(false);

	const [ startTime, setStartTime ] = useState(null);
	const [ endTime, setEndTime ] = useState(null);

	let endString = null;
	let startString = null;

	// const today = "28/11/2020";
	// var alarm = new Howl({
	//   src: [{soundfile}]
	// });

	// console.log(alarm);
	// alarm.load();

	// function playAlarm(){
	//   alarm.play();
	//   console.log("alarm is played");
	//   setTimeout(() => {
	//     alarm.pause();
	//     alarm.load();
	//   }, 1000)
	// }

	function handleTimer() {
		// start timer
		if (isOn === false) {
			setintervalID(
				setInterval(() => {
					setSeconds((c) => c - 1);
					//console.log("interval is triggered");
				}, 1000)
			);
			setOnOff(true);
			completedOnOff(false);
			setStartTime(new Date());
		} else {
			// reset timer
			clearInterval(intervalID);
			console.log('Timer has stopped');
			console.log('Interval is cleaned');
			setOnOff(false);
			setSeconds(0);
			setMinutes(starterminutes);
		}
	}

	console.log(seconds);

	if (minutes >= 1 && seconds < 0 && isOn === true) {
		console.log('below 0 seconds');
		setSeconds(59);
		setMinutes((m) => m - 1);
	} else if (minutes <= 0 && seconds <= 0 && isOn === true) {
		// session ends after completion
		clearInterval(intervalID);
		//console.log("interval is cleaned");
		//console.log("Session is completed");
		setSeconds(0);
		setMinutes(starterminutes);
		setOnOff(false);
		completedOnOff(true);
		const end = new Date();
		setEndTime(end);

		// record session to localStorage TODO
		// This stores the data TWICE for some reason
		// It turns out STRICT MODE was causing this.
		// It renders components twice when they have state methods.
		if (!localStorage.getItem(today)) {
			localStorage.setItem(today, '[]');
		}
		const all_sessions_today = JSON.parse(localStorage.getItem(today));
		console.log('all_sessions before adding last one:', all_sessions_today);

		startString = getHHMM(startTime);
		endString = getHHMM(end);
		const completed_session = {
			session_time: starterminutes,
			start_time: startString,
			finish_time: endString,
			project_name: null
		};
		all_sessions_today.push(completed_session);
		console.log('all_sessions after adding last one:', all_sessions_today);
		localStorage.setItem(today, JSON.stringify(all_sessions_today));
	}

	// Adds a zero to display when seconds are below 10
	if (minutes >= 1 && seconds < 10) {
		if (zero === null) {
			setZero(0);
		}
	} else {
		if (zero != null) {
			setZero(null);
		}
	}

	function handleSessionTime(event) {
		let input_value = parseInt(event.target.value);
		if (input_value >= 1 && input_value <= 60) {
			console.log('minutes is changed');
			setMinutes(input_value);
			setStarterMinutes(input_value);
			localStorage.setItem('starterminutes', String(input_value));
			// This prevents floating numbers appearing as starter minute
			event.target.value = input_value;
		} else {
			alert(`You must put a number between 1 and 60 to make this work!`);
			event.target.value = starterminutes;
		}
	}

	endString = getHHMM(endTime);
	// console.log(startString);
	// console.log(endString);
	console.log('BEFORE RETURN localstorage: ', localStorage.getItem(today));

	return (
		<div className="flex">
			{minutes ? (
				<h1 className="text-4xl pt-4 pb-2">
					{isOn ? (
						minutes
					) : (
						<input
							min="1"
							max="60"
							onBlur={handleSessionTime}
							defaultValue={starterminutes}
							className="w-10 bg-indigo-100 text-center"
						/>
					)}{' '}
					m : {zero}
					{seconds} s
				</h1>
			) : (
				<h1 className="text-4xl pt-4 pb-2">{seconds} s </h1>
			)}

			<button
				onClick={handleTimer}
				className="bg-indigo-500 hover:bg-indigo-700 text-gray-300 w-16 h-8 mt-6 ml-6 text-xl border-2 rounded-lg font-semibold focus:outline-none"
			>
				{isOn ? 'Reset' : 'Start'}
			</button>
			{isCompleted ? (
				<h2>You Completed a Session at {endString}!</h2>
			) : (
				''
			)}
			{/* <button onClick={playAlarm} className="btn btn-info btn-sm">
            Alarm
            </button> */}
		</div>
	);
}

class TimerClass extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			start: 5,
			intervalID: null,
			isOn: false,
			isCompleted: false
		};
		this.handleTimer = this.handleTimer.bind(this);
	}

	handleTimer() {
		if (this.state.isOn === false) {
			let intervalID = setInterval(() => {
				this.setState({
					start: this.state.start - 1
				});
				// console.log("interval is triggered");
			}, 1000);
			this.setState({
				intervalID: intervalID,
				isOn: true,
				isCompleted: false
			});
		} else {
			clearInterval(this.state.intervalID);
			this.setState({
				isOn: false,
				start: 5
			});
		}
	}

	componentDidUpdate() {
		if (this.state.start <= 0 && this.state.isOn === true) {
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
				<button
					onClick={this.handleTimer}
					className="bg-indigo-300 border-gray-100"
				>
					{this.state.isOn ? 'Reset' : 'Start'}
				</button>
				{this.state.isCompleted ? (
					<h2>You Completed a Session!</h2>
				) : (
					''
				)}
			</div>
		);
	}
}

export default App;
