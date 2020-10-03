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
		this.sceneRepositoryElement = document.getElementById("repository");

		this.interactionCursorElement = document.getElementById("interactionCursor");
		this.currentFocusObjectElement = null;

		this.introScreenElement = document.getElementById("introScreen");
		this.titleScreenElement = document.getElementById("titleScreen");
		this.currentFocusLabelElement = document.getElementById("currentFocusLabel");

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
		
	}

	startGame() {
		if (this.loadScene("s001")) {
			CharacterElement.register();
			this.playerElement = new CharacterElement();
			this.playerElement.rect = new Rect(20, this.worldElement.getH() - 320, 83, 300);
			this.currentSceneElement.appendChild(this.playerElement);
		}
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
		} else {
			console.error("Failed to load scene", id);
			return false;
		}
		console.log("Loaded scene", id);

		return true;
	}

	tick(timestamp) {
		const panic = () => {
			console.error("Frames out of sync");
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
		if (this.currentFocusObjectElement) {
			this.currentFocusLabelElement.innerText = this.currentFocusObjectElement.dataset.title;
		} else {
			this.currentFocusLabelElement.innerText = "";
		}
	}

	updateGame(elapsedTimeSinceLastTick = 30) {
		if (this.paused) {
			return;
		}

		//this.someController.tick();

		if (!this.currentSceneElement) {
			return;
		}
		this.playerElement.tick();
		this.updateCamera();
		this.updateInteractionCursor();
		this.updateRequired = false;
	}

	updateInteractionCursor() {
		let currentFocusObjectId = this.currentSceneElement.getClosestOject(this.playerElement.rect.centerPoint, this.playerElement.interactionRange);
		if (!currentFocusObjectId) {
			this.currentFocusObjectElement = null;
			this.interactionCursorElement.classList.remove("active");
			return;
		}
		this.currentFocusObjectElement = this.currentSceneElement.querySelector("#"+currentFocusObjectId);
		this.interactionCursorElement.setRect(this.currentFocusObjectElement.getRelativeRect());
		this.interactionCursorElement.classList.add("active");
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
		let key = evt.key.toLowerCase();
		if (!this.playerElement) {
			return;
		}
		switch(key) {
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
		let key = evt.key.toLowerCase();
		if (!this.playerElement) {
			return;
		}
		if (this.playerElement.state == PlayerState.walkingLeft && key == "a") {
			this.playerElement.state = PlayerState.idleLeft;
		}
		if (this.playerElement.state == PlayerState.walkingRight && key == "d") {
			this.playerElement.state = PlayerState.idleRight;
		}
		if (this.currentFocusObjectElement && key == "e") {
			this.playerInteractWithElement(this.currentFocusObjectElement.id);
		}
	}

	playerInteractWithElement(objectId) {
		this.triggerController.executeInteractionTriggers(objectId);
	}

	playerHitLocation(evt) {
		let location = evt.detail;
		console.log(location);
		this.triggerController.executeBringTriggers(location);
	}

	// Trigger helper methods, break out into separate controller later if I have time

	getSwitch(switchId) {
		return this.gameData[switchId];
	}

	setSwitch(switchId) {
		this.gameData[switchId] = true;
	}

	clearSwitch(switchId) {
		delete this.gameData[switchId];
	}

	enableSceneObject(objectId) {
		let elm = this.currentSceneElement.querySelector("#" + objectId);
		elm.disabled = false;
	}

	disableSceneObject(objectId) {
		let elm = this.currentSceneElement.querySelector("#" + objectId);
		elm.disabled = true;
	}
}

window.g = new Game();