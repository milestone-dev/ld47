import {EntityElement} from "./hgl/elements.js"
import {Rect, Point} from "./hgl/geometry.js"
import {ObjectElement} from "./SceneChildElements.js"

export class SceneElement extends EntityElement {
	constructor() {
		super();
		ObjectElement.register();

		this.querySelectorAll("x-block").forEach(e => {
			e.setRectFromDataset();
		});

		this.querySelectorAll("x-location").forEach(e => {
			e.setRectFromDataset();
		});

		this.querySelectorAll("x-object").forEach(e => {
			e.setRectFromDataset();
		});

	}

	onSceneLoad() {
		//TODO: Clean up hack by listening to some type of layout event
		window.setTimeout(e=>{this.updateSizeFromComputedSize()}, 100);
	}

	verifyBlockCollision(point) {
		let canPass = true;
		if (!this.rect.containsPoint(point)) {
			canPass = false; 
		}
		this.querySelectorAll("x-block").forEach(e => {
			if (e.disabled) {
				return;
			}
			let r = e.getRectFromCSS();
			if (e.getRectFromCSS().containsPoint(point)) {
				canPass = false;
			}
		})
		return canPass;
	}

	checkLocationCollision(point) {
		let location = null;
		this.querySelectorAll("x-location").forEach(e => {
			if (e.disabled) {
				return;
			}
			let r = e.getRectFromCSS();
			if (e.getRectFromCSS().containsPoint(point)) {
				location = e;
			}
		})
		return location;
	}

	getClosestOject(point, range) {
		let closestObject = null;
		let shortestDistance = 100000;

		this.querySelectorAll("x-object").forEach(e => {
			if (e.disabled) {
				return;
			}
			let objectCenterPoint = e.getRectFromCSS().centerPoint;
			let horizontalDistance = Math.abs(objectCenterPoint.x - point.x);
			if (horizontalDistance <= range) {
				if (horizontalDistance < shortestDistance) {
					closestObject = e.id;
					shortestDistance = horizontalDistance;
				}
			}
		});
		return closestObject;
	}

	tick(game) {
		this.querySelectorAll("x-object").forEach(e => {
			e.tick();
		})
	}

	static selector() {
		return "x-scene";
	}
}