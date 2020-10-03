import "./hgl/extensions.js"
import {TriggerType} from "./Constants.js"

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

	executeBringTriggers(location) {
		this.triggers.forEach(trigger => {
			if (trigger.type == TriggerType.bring && trigger.identifier == location) {
				trigger.run(this.delegate);
				if (!trigger.preserve) {
					this.triggers.removeItem(trigger);
				}
			}
		})
	}

	executeInteractionTriggers(objectId) {
		this.triggers.forEach(trigger => {
			if (trigger.type == TriggerType.interact && trigger.identifier == objectId) {
				trigger.run(this.delegate);
				if (!trigger.preserve) {
					this.triggers.removeItem(trigger);
				}
			}
		})
	}
}

export class Trigger {
	constructor(type, identifier, trigger, preserve = false) {
		this.type = type;
		this.identifier = identifier;
		this.trigger = trigger;
		this.preserve = preserve;
	}

	run(delegate) {
		this.trigger(delegate);
	}
}