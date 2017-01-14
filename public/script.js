var socket = io();
var ENTER_KEY = 13;
var username;

$(document).ready(function() {

	var button = $("#button");
	var usernameInput = $("#usernameInput");
	var loginForm = $("#form");
	var scoreDisplay = $("#score");
	var userScore = sessionStorage.getItem("userScore") || 0;
	var clearSessionButton = $("#clearSessionButton");
	var allowAnswer = false;
	button.attr('disabled', 'disabled');
	button.css({'background-color': 'grey'});



	console.log(sessionStorage.getItem("username"));

	if (sessionStorage.getItem("username") === null) {
		usernameInput.on("keypress", function(e) {
			switch(e.which) {
				case ENTER_KEY:
				// submit
				username = usernameInput.val();
				sessionStorage.setItem("username", username);
				socket.emit('add user', username);
				loginForm.hide();
				scoreDisplay.show();
				button.show();
				$("#score").html('Score: ' + userScore);

				break;
			}
		});
	} else {
		$("#score").html('Score: ' + userScore);
		username = sessionStorage.getItem("username");
		button.show();
		loginForm.hide();
		scoreDisplay.show();
		var r= $('<input type="button" id="clearSessionButton" value="Clear My Session Data"/>');
		$('#wrapper').append(r);
	}

	var buzzSound = document.createElement('audio');
	buzzSound.setAttribute('src', './buzzSound.wav');
	var rightSound = document.createElement('audio');
	rightSound.setAttribute('src', './rightSound.wav');
	var wrongSound = document.createElement('audio');
	wrongSound.setAttribute('src', './wrongSound.mp3');

	button.on("click", function() {
		socket.emit('click button', username);
		buzzSound.play();
	});

	$('#wrapper').on( 'click', '#clearSessionButton', function () {
		sessionStorage.clear();
		location.reload();
	});

	function setBuzzed(data) {
		if (data.username === username) {
			button.css({'background-color': '#99ff99'});
		} else {
			button.css({'background-color': '#ff9999'});
		}
		button.attr('disabled', 'disabled');
	}

	socket.on('login', function(data) {
		if (data.isBuzzed) {
			setBuzzed({});
		}
	});
	socket.on('allowed answer', function(data) {
		button.removeAttr('disabled');
		button.css({'background-color': 'white'});

	});

	socket.on('button clicked', function(data) {
		setBuzzed(data);
	});

	socket.on('answer is correct', function(data) {
		console.log(data);
		if (data.username === username) {
			button.addClass( 'correctClass' );
			rightSound.play();
			$("#score").html('Score: ' + ++userScore);
			sessionStorage.setItem("userScore", userScore);
		}

		else {
			button.attr('disabled', 'disabled');
			button.css({'background-color': 'grey'});
		}

		setTimeout(function() {
			console.log("remove");
			button.removeClass('correctClass');
			button.attr('disabled', 'disabled');
			button.css({'background-color': 'grey'});

		}, 5000);

	});

	socket.on('answer is wrong', function(data) {
		console.log(data);
		if (data.username === username) {
			button.addClass( 'incorrectClass' );
			wrongSound.play();
			$("#score").html('Score: ' + --userScore);
			sessionStorage.setItem("userScore", userScore);
		}

		else {
			button.attr('disabled', 'disabled');
			button.css({'background-color': 'grey'});
		}
		setTimeout(function() {
			console.log("remove");
			button.removeClass('incorrectClass');
			button.attr('disabled', 'disabled');
			button.css({'background-color': 'grey'});
		}, 5000);

	});

	socket.on('cleared', function(data) {
		console.log('button cleared');
		button.attr('disabled', 'disabled');
		button.css({'background-color': 'grey'});
	});
});
