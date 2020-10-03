import "./hgl/extensions.js"
import {EventHandler} from "./hgl/eventhandler.js"
import {Point, Rect, Size} from "./hgl/geometry.js"

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
		// Input, or automation do not run while game is paused
		if (this.paused) {
			return;
		}

		//this.someController.tick();

		this.updateRequired = false;
	}

	onKeyUp(evt) {
		console.log(evt.key);
	}
}

window.g = new Game();