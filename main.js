import "./hgl/extensions.js"
import {EventHandler} from "./hgl/eventhandler.js"
import {Point, Rect, Size} from "./hgl/geometry.js"
import {CharacterElement} from "./CharacterElement.js"
import {PlayerState} from "./Constants.js"

class Game {

	constructor() {
		this.gameElement = document.getElementById("game");

		this.updateRequired = false;
		this.currentTouchClientPoint = new Point(0,0);
		this.currentTouch = null;
		this.touchHasMoved = false;

		this.resizeTimeout = null;
		this.chunkUpdateTimeout = null;

		this.loopAudioElement = document.getElementById("loop");
		this.introAudioElement = document.getElementById("intro");
		this.cameraElement = document.getElementById("camera");
		this.worldElement = document.getElementById("world");
		this.paused = true;

		this.introScreenElement = document.getElementById("intro-screen");
		this.titleScreenElement = document.getElementById("title-screen");

		// FPS coordination
		this.speed = 1;
		this.delta = 0;
		this.lastFrameTimeMs = 0;
		this.elapsedTimeSinceLastTick;

		this.currentDialog = null;
		this.paused = false;
		this.playerElement = null;

		//window.addEventListener("someEvent", this.someFunction.bind(this));

		this.init();
	}

	get fpsInterval() {
		return (1000 / 60) / this.speed;
	}

	init() {
		this.eventHandler = new EventHandler(this, window);
		window.requestAnimationFrame(this.tick.bind(this));
		window.setInterval(this.updateStatus.bind(this), 300);
		window.focus();
		this.startGame();
	}

	startGame() {
		CharacterElement.register();
		this.playerElement = new CharacterElement();
		this.playerElement.rect = new Rect(20, this.worldElement.getH() - 320, 83, 300);
		this.worldElement.appendChild(this.playerElement);
	}

	tick(timestamp) {
		const panic = () => {
			console.log("panic");
			this.delta = 0;
		}
		if (timestamp < this.lastFrameTimeMs + this.fpsInterval) {
			window.requestAnimationFrame(this.tick.bind(this));
			return;
		}

		this.delta += timestamp - this.lastFrameTimeMs;
		this.lastFrameTimeMs = timestamp;

		let numUpdateSteps = 0;
		while (this.delta >= this.fpsInterval) {
			this.updateGame(this.fpsInterval);
			this.delta -= this.fpsInterval;
			if (++numUpdateSteps >= 240) {
				panic();
				break;
			}
		}
		//If there was a draw function, call it here
		window.requestAnimationFrame(this.tick.bind(this));
	}

	updateStatus() {
	}

	updateGame(elapsedTimeSinceLastTick = 30) {
		if (this.paused) {
			return;
		}

		//this.someController.tick();

		this.playerElement.tick();
		this.updateCamera();
		this.updateRequired = false;
	}

	updateCamera() {
		let cameraWidth = this.cameraElement.getW();
		let worldWidth = this.worldElement.getW();
		let playerX = this.playerElement.point.x;
		let x = 0;
		x = cameraWidth / 2;
		x -= playerX;
		if (x > 0) {x = 0}
		if (x < (worldWidth-cameraWidth) * -1) {
			x = (worldWidth-cameraWidth) * -1;
		}
		this.worldElement.setTransform(x, 0);
	}

	onKeyDown(evt) {
		console.log("onKeyDown", evt.key);
		switch(evt.key) {
			case "a":
				this.playerElement.state = PlayerState.walkingLeft;
			break;
			case "d":
				this.playerElement.state = PlayerState.walkingRight;
			break;
		}
	}
	onKeyUp(evt) {
		console.log("onKeyUp",evt.key);
		if (this.playerElement.state == PlayerState.walkingLeft && evt.key == "a") {
			this.playerElement.state = PlayerState.idle;	
		}
		if (this.playerElement.state == PlayerState.walkingRight && evt.key == "d") {
			this.playerElement.state = PlayerState.idle;	
		}
	}
}

window.g = new Game();