import {EntityElement} from "./hgl/elements.js"

export class SceneElement extends EntityElement {
	constructor() {
		super();

		this.querySelectorAll(".block").forEach(e => {
			e.setRectFromDataset();
		});

		this.querySelectorAll(".location").forEach(e => {
			e.setRectFromDataset();
		})

		this.querySelectorAll(".object").forEach(e => {
			e.setRectFromDataset();
		})
	}

	verifyBlockCollision(point) {
		let collided = true;
		this.querySelectorAll(".block").forEach(e => {
			let r = e.getRectFromCSS();
			if (e.getRectFromCSS().containsPoint(point)) {
				collided = false;
			}
		})
		return collided;
	}

	checkLocationCollision(point) {
		let location = null;
		this.querySelectorAll(".location").forEach(e => {
			let r = e.getRectFromCSS();
			if (e.getRectFromCSS().containsPoint(point)) {
				location = e;
			}
		})
		return location;
	}

	tick(game) {
	}

	static selector() {
		return "x-scene";
	}
}