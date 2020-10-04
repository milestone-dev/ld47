import "./hgl/extensions.js"
import {EntityElement} from "./hgl/elements.js"
import {Rect, Point} from "./hgl/geometry.js"
import {SceneElement} from "./SceneElement.js"
import {PlayerState} from "./Constants.js"

export class CharacterElement extends EntityElement {
	constructor(id = "player") {
		super();
		this.id = id;
		this._state = PlayerState.idleRight;
		this.spriteElement = document.createElement("div");
		this.spriteElement.classList.add("sprite");
		this.interactionRange = 300;
		this.characterLocations = [];
		this.currentSceneElement = null;
		this.appendChild(this.spriteElement);
		window.addEventListener("sceneLoaded", evt => {
			this.currentSceneElement = evt.detail;
		});
	}

	static getProductCategoryFromProductType(productType) {
		return productType.split("_")[0];
	}

	offsetY(yOffset) {
		this.point.offsetBy(0, yOffset);
		this.reloadRect();
	}

	set type(type) {
		this._type = type;
		this.dataset.type = type;
	}

	get type() {
		return this._type;
	}

	set state(state) {
		this._state = state;
		this.dataset.state = state;
	}

	get state() {
		return this._state;
	}

	updateLocations() {
		//TODO make generic for any character
		let currentLocations = [];
		let previousLocationsSnapshot = this.characterLocations.clone();
		// TODO FIX Player point and where they are facing
		let hitLocation = this.currentSceneElement.checkLocationCollision(this.rect.centerPoint);
		if (hitLocation) {
			let hitLocationId = hitLocation.id;
			if (!currentLocations.contains(hitLocationId)) {
				currentLocations.push(hitLocationId);
			}
			window.dispatchEvent(new CustomEvent("playerHitLocation", {detail:hitLocationId}));
		}

		this.characterLocations = currentLocations;

		let leftLocations = previousLocationsSnapshot.filter(l => {
			return !this.characterLocations.contains(l);
		});

		let enteredLocations = this.characterLocations.filter(l => {
			return !previousLocationsSnapshot.contains(l);
		});

		enteredLocations.forEach(locationId => {
			window.dispatchEvent(new CustomEvent("playerEnteredLocation", {detail:locationId}));
		});

		leftLocations.forEach(locationId => {
			window.dispatchEvent(new CustomEvent("playerLeftLocation", {detail:locationId}));
		});
	}

	tick(game) {
		// TODO remove this super hack
		if (!this.currentSceneElement) {
			console.error("No scene");
			return;
		}

		const travelSpeed = 0.6;
		let travelDistance = 15;
		const distanceBetweenObjects = 10;
		const walkDelta = travelDistance * travelSpeed;
		this.updateLocations();


		if (this.state == PlayerState.walkingLeft || this.state == PlayerState.walkingRight) {
			let x = this.point.x;
			let xCollisionBoundary = 0;
			if (this.state == PlayerState.walkingLeft) {
				x -= walkDelta;
			} if(this.state == PlayerState.walkingRight) {
				x += walkDelta;
				xCollisionBoundary = this.getW();
			}
			let point = this.point;
			if (this.currentSceneElement.verifyBlockCollision(point.pointOffsetBy(xCollisionBoundary, 0))) {
				point.x = x;
			}
			this.point = point;
		}
	}

	static selector() {
		return "x-character";
	}
}