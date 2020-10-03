import "./hgl/extensions.js"

export class TriggerController {

	constructor(delegate) {
		this.delegate = delegate;
		this.triggers = [];
		this.switches = {};
	}

	register(trigger) {
		this.triggers.push(trigger);
	}

	removeTrigger(trigger) {
		this.triggers.removeItem(trigger);
	}

	runTriggersForLocation(location) {
		this.triggers.forEach(trigger => {
			if (trigger.location == location) {
				trigger.run(this.delegate);
				if (!trigger.preserve) {
					this.triggers.removeItem(trigger);
				}
			}
		})
	}
}

export class Trigger {
	constructor(type, location, trigger, preserve = false) {
		this.type = type;
		this.location = location;
		this.trigger = trigger;
		this.preserve = preserve;
	}

	run(delegate) {
		this.trigger(delegate);
	}
}