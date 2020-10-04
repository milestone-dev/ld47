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
		this.messageBoxElement = document.getElementById("messageBox");
		this.messageLabelElement = document.getElementById("messageLabel");

		this.triggerController = new TriggerController(this);
		Triggers.forEach(t => this.triggerController.register(t));
		this.currentSceneElement = null;

		// FPS coordination
		this.speed = 1;
		this.delta = 0;
		this.lastFrameTimeMs = 0;
		this.elapsedTimeSinceLastTick;

		this.currentDialog = null;
		this._paused = false;
		this.playerElement = null;
		this.gameData = {};

		this.messageQueue = [];
		this.messageBoxClosedCallback = null;

		//window.addEventListener("someEvent", this.someFunction.bind(this));
		window.addEventListener("playerHitLocation", this.playerHitLocation.bind(this));
		window.addEventListener("playerEnteredLocation", this.playerEnteredLocation.bind(this));
		window.addEventListener("playerLeftLocation", this.playerLeftLocation.bind(this));

		//Debug stuff
		this.debugSelectionElement = document.createElement("div");
		this.debugSelectionElement.id = "debugSelection";
		this.selecitonStartPoint = new Point(0,0);

		this.init();
	}

	get fpsInterval() {
		return (1000 / 60) / this.speed;
	}

	set paused(paused) {
		this._paused = paused;
		if (paused) {
			this.stopWalking();
		}
	}

	get paused() {
		return this._paused;
	}

	pause() {
		this.paused = true;
	}

	unpause() {
		this.paused = false;
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
		this.playerElement.rect = new Rect(0,0, 83, 300);
		this.loadScene(window.location.hash.replace("#","") || "s001");
	}

	loadScene(id) {
		SceneElement.register();
		let previousScene = this.worldElement.querySelector("x-scene");
		let previousSceneId = null;
		if (previousScene) {
			previousSceneId = previousScene.id;
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

		this.currentSceneElement.onSceneLoad();
		this.currentSceneElement.appendChild(this.playerElement);
		window.dispatchEvent(new CustomEvent("sceneLoaded", {detail:this.currentSceneElement}));
		console.log("Loaded scene", id, this.currentSceneElement, this.playerElement.parentElement);

		this.triggerController.executeEnterSceneTriggers(id, previousSceneId);
		window.location.hash = "#"+id;

		return true;
	}

	tick(timestamp) {
		const panic = () => {
			console.log("Frames out of sync");
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
			if (this.currentFocusLabelElement.innerText != this.currentFocusObjectElement.dataset.title) {
				this.currentFocusLabelElement.innerText = this.currentFocusObjectElement.dataset.title;
			}
		} else {
			if (this.currentFocusLabelElement.innerText != "") {
				this.currentFocusLabelElement.innerText = "";
			}
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
		let currentFocusObjectId = this.currentSceneElement.getClosestObject(this.playerElement.rect.centerPoint, this.playerElement.interactionRange);
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
		if (this.playerElement.parentElement != this.currentSceneElement) {
			console.log("Player not in scene");
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
		if (this.paused) {
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

	onSpaceKeyUp(evt) {
		this.dismissCurrentMessage();
	}

	onBKeyUp(evt) {
		document.body.classList.toggle("debug");
	}

	onLKeyUp(evt) {
		this.loadScene("s00"+window.prompt("Scene #"));
	}

	onEKeyUp(evt) {
		if (this.paused) {
			return;
		}
		if (this.currentFocusObjectElement) {
			this.playerInteractWithElement(this.currentFocusObjectElement.id);
		}
	}

	onAKeyUp(evt) {
		if (this.paused) {
			return;
		}
		this.stopWalking();

	}

	onDKeyUp(evt) {
		if (this.paused) {
			return;
		}
		this.stopWalking();
	}

	stopWalking() {
		if (this.playerElement.state == PlayerState.walkingLeft) {
			this.playerElement.state = PlayerState.idleLeft;
		} else if (this.playerElement.state == PlayerState.walkingRight) {
			this.playerElement.state = PlayerState.idleRight;
		} else {
			this.playerElement.state = PlayerState.idleRight;
		}
	}

	closeMessageBox() {
		this.messageBoxElement.classList.remove("active");
		this.paused = false;
		if (this.messageBoxClosedCallback) {
			this.messageBoxClosedCallback(this);
		}
		this.messageBoxClosedCallback = null;
	}

	displayNextEnqueuedMessage() {
		if (!this.messageBoxElement.classList.contains("active")) {
			return;
		}

		if (this.messageQueue.length > 0) {
			let message = this.messageQueue.shift();
			this.messageLabelElement.innerText = message;
		} else {
			this.closeMessageBox();
		}
	}

	dismissCurrentMessage() {
		if (!this.messageBoxElement.classList.contains("active")) {
			return;
		}

		if (this.messageQueue.length > 0) {
			this.displayNextEnqueuedMessage();
		} else {
			this.closeMessageBox();
		}
	}

	////

	onMouseDown(evt) {
		// TODO Implement object measuring tool
	}

	onMouseUp(evt) {
		// TODO Implement object measuring tool
	}

	onMouseMove(evt) {
		// TODO Implement object measuring tool
	}

	playerInteractWithElement(objectId) {
		this.triggerController.executeInteractionTriggers(objectId);
	}

	playerHitLocation(evt) {
		this.triggerController.executeBringTriggers(evt.detail);
	}

	playerEnteredLocation(evt) {
		this.triggerController.executeEnterLocationTriggers(evt.detail);
	}

	playerLeftLocation(evt) {
		this.triggerController.executeLeaveLocationTriggers(evt.detail);
	}
	// Trigger helper methods, break out into separate controller later if I have time
	/// START TRIGGER PROXY STUFF

	getSwitch(switchId) {
		return this.gameData[switchId];
	}

	setSwitch(switchId) {
		this.gameData[switchId] = true;
	}

	clearSwitch(switchId) {
		delete this.gameData[switchId];
	}

	enableSceneElement(elementId) {
		let elm = this.currentSceneElement.querySelector("#" + elementId);
		if (elm) {
			elm.enable();
		}
	}

	disableSceneElement(elementId) {
		let elm = this.currentSceneElement.querySelector("#" + elementId);
		if (elm) {
			elm.disable();
		}
	}

	openMessageBox(callback) {
		this.messageBoxClosedCallback = callback;
		this.paused = true;
		this.messageBoxElement.classList.add("active");
		this.displayNextEnqueuedMessage();
	}

	enqueueMessage(message) {
		this.messageQueue.push(message);
		return this;
	}

	wait(timeout, callback) {
		window.setTimeout(e => {
			if (callback) {
				callback(this);
			}
		}, timeout);
	}

	playSound(sound, callback) {
		//TODO wait for sound end
		window.setTimeout(e => {
			if (callback) {
				callback(this);
			}
		}, 500);
	}

	/// END TRIGGER PROXY STUFF
}

window.g = new Game();