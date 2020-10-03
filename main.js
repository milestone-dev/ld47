import "./hgl/extensions.js"
import {EventHandler} from "./hgl/eventhandler.js"
import {Point, Rect, Size} from "./hgl/geometry.js"
import {CharacterElement} from "./CharacterElement.js"
import {SceneElement} from "./SceneElement.js"
import {PlayerState} from "./Constants.js"
import {TriggerController} from "./TriggerController.js"
import {Triggers} from "./triggers.js"

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
		this.interactionCursorElement = document.getElementById("interactionCursor");
		this.sceneRepositoryElement = document.getElementById("repository");
		this.paused = true;

		this.introScreenElement = document.getElementById("intro-screen");
		this.titleScreenElement = document.getElementById("title-screen");

		this.triggerController = new TriggerController(this);
		Triggers.forEach(t => this.triggerController.register(t));
		this.currentSceneElement = null;

		// FPS coordination
		this.speed = 1;
		this.delta = 0;
		this.lastFrameTimeMs = 0;
		this.elapsedTimeSinceLastTick;

		this.currentDialog = null;
		this.paused = false;
		this.playerElement = null;
		this.gameData = {};

		//window.addEventListener("someEvent", this.someFunction.bind(this));
		window.addEventListener("playerHitLocation", this.playerHitLocation.bind(this));

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
		this.loadScene("scene001");
	}

	startGame() {
		CharacterElement.register();
		this.playerElement = new CharacterElement();
		this.playerElement.rect = new Rect(20, this.worldElement.getH() - 320, 83, 300);
		this.worldElement.appendChild(this.playerElement);
	}

	loadScene(id) {
		SceneElement.register();
		let previousScene = this.worldElement.querySelector("x-scene");
		if (previousScene) {
			this.sceneRepositoryElement.appendChild(previousScene);
		}
		this.currentSceneElement = null;

		let scene = this.sceneRepositoryElement.querySelector("#"+id);
		if (scene) {
			this.worldElement.appendChild(scene);
			this.currentSceneElement = scene;
		}
		console.log(id, scene)
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
		this.updateInteractionCursor();
		this.updateRequired = false;
	}

	updateInteractionCursor() {
		let playerCenterPoint = this.playerElement
	}

	updateCamera() {
		if (!this.currentSceneElement) {
			return;
		}
		let cameraWidth = this.cameraElement.getW();
		let sceneWidth = this.currentSceneElement.getW();
		let playerX = this.playerElement.point.x;
		let x = 0;
		x = cameraWidth / 2;
		x -= playerX;
		if (x > 0) {x = 0}
		if (x < (sceneWidth-cameraWidth) * -1) {
			x = (sceneWidth-cameraWidth) * -1;
		}
		this.worldElement.setTransform(x, 0);
	}

	onKeyDown(evt) {
		//console.log("onKeyDown", evt.key);
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
		//console.log("onKeyUp",evt.key);
		if (this.playerElement.state == PlayerState.walkingLeft && evt.key == "a") {
			this.playerElement.state = PlayerState.idleLeft;
		}
		if (this.playerElement.state == PlayerState.walkingRight && evt.key == "d") {
			this.playerElement.state = PlayerState.idleRight;
		}
	}

	playerHitLocation(evt) {
		let location = evt.detail;
		this.triggerController.runTriggersForLocation(location);
	}

	getSwitch(switchId) {
		this.gameData[switchId];
	}

	setSwitch(switchId, state = true) {
		this.gameData[switchId] = state;
	}
}

window.g = new Game();