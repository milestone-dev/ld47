import {Point, Rect, Size} from "./geometry.js"

export default {};

Element.prototype.setHidden = function(hidden, mode = "block") {
	let display = hidden ? "none" : mode;
	if (display == this.style.display) {
		return;
	}
	this.style.display = display;
}

Element.prototype.toggleDisplay = function() {
	if (this.style.display == "none") {
		this.show();
	} else {
		this.hide();
	}
}

Element.prototype.hasParent = function(parent) {
	var elm = this.parentElement
	while(elm) {
		if (elm == parent) {
			return true;
		}
		elm = elm.parentElement;
	}
	return false;
}

Element.prototype.hide = function() {
	this.setHidden(true);
}

Element.prototype.show = function() {
	this.setHidden(false);
}

Element.prototype.setFilter = function(filter) {
	if (!filter) {
		filter = "";
	}
	this.style.filter = filter;
}

Element.prototype.getRect = function() {
	let r = this.getBoundingClientRect();
	return new Rect(r.x,
		r.y,
		r.width,
		r.height);
}

Element.prototype.getRelativeRect = function() {
	let r = window.getComputedStyle(this);
	return new Rect(r.getPropertyValue("left"),
		r.getPropertyValue("top"),
		r.getPropertyValue("width"),
		r.getPropertyValue("height"));
}

Element.prototype.getRectFromCSS = function() {
	return new Rect(parseInt(this.style.left) || 0, 
		parseInt(this.style.top) || 0, 
		parseInt(this.style.width) || 0, 
		parseInt(this.style.height) || 0);
}

Element.prototype.setRectFromDataset = function() {
	let r = Rect.fromString(this.dataset.rect);
	this.setX(r.point.x);
	this.setY(r.point.y);
	this.setW(r.size.w);
	this.setH(r.size.h);
}

Element.prototype.setRect = function(rect) {
	this.setPoint(rect.point.x, rect.point.y);
	this.setSize(rect.size.w, rect.size.h);
}

Element.prototype.setX = function(x) {
	this.style.left = `${x}px`;
}

Element.prototype.setY = function(y) {
	this.style.top = `${y}px`;
}

Element.prototype.getX = function() {
	return parseInt(this.style.left);
}

Element.prototype.getY = function() {
	return parseInt(this.style.top);
}

Element.prototype.setW = function(w) {
	this.style.width = `${w}px`;
}

Element.prototype.setH = function(h) {
	this.style.height = `${h}px`;
}

Element.prototype.getW = function() {
	return this.getBoundingClientRect().width;
}

Element.prototype.getH = function() {
	return this.getBoundingClientRect().height;
}

Element.prototype.getOpacity = function() {
	return parseInt(this.style.opacity);
}

Element.prototype.setOpacity = function(o) {
	this.style.opacity = o;
}

Element.prototype.setSize = function(w,h) {
	this.setW(w);
	this.setH(h);
}

Element.prototype.setPoint = function(x, y) {
	if (typeof x == "object") {
		y = x.y;
		x = x.x;
	}
	this.setX(x);
	this.setY(y);
}

Element.prototype.setTransform = function(x, y) {
	this.style.transform = `translate(${x}px, ${y}px)`;
}

Element.prototype.getPoint = function() {
	if (this.dataset.point) {
		return Point.fromString(this.dataset.point);
	}
	return new Point(this.getX(), this.getY());
}

Element.prototype.removeChildren = function() {
	while (this.firstChild) {
		this.removeChild(this.firstChild);
	}
}

Element.prototype.toggleClass = function(className, toggle) {
	if (toggle) {
		this.classList.add(className);
	} else {
		this.classList.remove(className);
	}
}

String.prototype.uppercaseFirst = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

Object.prototype.clone = function() {
	return Object.assign({}, this);
}

Array.prototype.clone = function() {
	return this.slice(0);
}

Array.prototype.randomItem = function() {
	return this[Math.floor(Math.random()*(this.length))];
}

Array.prototype.randomize = function() {
	return this.sort(e => {return 0.5 - Math.random()});
}

Array.prototype.contains = function(element) {
	return this.indexOf(element) != -1;
}

Array.prototype.removeItem = function(item) {
	let i = this.indexOf(item);
	if (i == -1) {
		return;
	}
	this.splice(i, 1);
}