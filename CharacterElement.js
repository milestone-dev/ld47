import {EntityElement} from "./hgl/elements.js"
import {Rect, Point} from "./hgl/geometry.js"
import {PlayerState} from "./Constants.js"

export class CharacterElement extends EntityElement {
	constructor(id = "player") {
		super();
		this.id = id;
		this._state = PlayerState.idle;
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

	verifyCollision(x) {
		this.worldElement = document.getElementById("world");
		return true;
	}

	tick(game) {
		const travelSpeed = 0.9;
		let travelDistance = 15;
		const distanceBetweenObjects = 10;
		const walkDelta = travelDistance * travelSpeed;

		if (this.state == PlayerState.walkingLeft || this.state == PlayerState.walkingRight) {
			let x = this.point.x;
			if (this.state == PlayerState.walkingLeft) {
				x -= walkDelta;
			} if(this.state == PlayerState.walkingRight) {
				x += walkDelta;
			}
			let point = this.point;
			if (this.verifyCollision(x)) {
				point.x = x;
			}
			this.point = point;
		}

		return;
		// let minX = this.parentElement.getW() - this.getW();

		// let aheadObjectElm = this.previousSibling;
		// if (aheadObjectElm) {
		// 	minX = aheadObjectElm.point.x - this.getW() - distanceBetweenObjects;
		// }
		// if (minX < x) {
		// 	this.classList.add("hold");
		// 	return;
		// } else {
		// 	this.classList.remove("hold");
		// }
	
		// if (x < minX) {
		// 	x += walkDelta;
		// 	this.classList.add("moving");
		// }
		
		// if (x >= minX) {
		// 	x = minX;
		// 	if (this.classList.contains("moving")) {
		// 		this.classList.remove("moving");
		// 		if (!aheadObjectElm) {
		// 			window.dispatchEvent(new CustomEvent("productStoppedFirstInLine", {detail:this}));
		// 		}
		// 	}
		// }

		// let point = this.point;
		// point.x = x;
		// this.point = point;
	}

	static selector() {
		return "x-character";
	}
}