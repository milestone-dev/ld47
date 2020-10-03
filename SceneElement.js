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

		//TODO: Clean up hack by listening to some type of layout event
		window.setTimeout(e=>{this.updateSizeFromComputedSize()}, 100);
	}

	verifyBlockCollision(point) {
		let canPass = true;
		if (!this.rect.containsPoint(point)) {
			canPass = false; 
		}
		this.querySelectorAll(".block").forEach(e => {
			let r = e.getRectFromCSS();
			if (e.getRectFromCSS().containsPoint(point)) {
				canPass = false;
			}
		})
		return canPass;
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

	getNearbyOjects(point) {

	}

	tick(game) {
	}

	static selector() {
		return "x-scene";
	}
}