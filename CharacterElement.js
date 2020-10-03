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
		this.appendChild(this.spriteElement);
	}

	static getProductCategoryFromProductType(productType) {
		return productType.split("_")[0];
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

	tick(game) {
		let sceneElement = document.querySelector("#world x-scene");
		const travelSpeed = 0.6;
		let travelDistance = 15;
		const distanceBetweenObjects = 10;
		const walkDelta = travelDistance * travelSpeed;

		// TODO FIX Player point and where they are facing
		let hitLocation = sceneElement.checkLocationCollision(this.point);
		if (hitLocation) {
			window.dispatchEvent(new CustomEvent("playerHitLocation", {detail:hitLocation.id}));
		}

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
			if (sceneElement.verifyBlockCollision(point.pointOffsetBy(xCollisionBoundary, 0))) {
				point.x = x;
			}
			this.point = point;
		}
	}

	static selector() {
		return "x-character";
	}
}