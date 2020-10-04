let constantList = function(...values) {
	let obj = {};
	values.forEach(value => {
		obj[value] = value;
	})
	Object.freeze(obj);
	return obj;
}


export const Debug = {
	skipIntro: true,
	muteMusic: true,
}
Object.freeze(Debug);

export const Duration = {
	defaultDuration: 300,
	fadeDuration: 300,
	timeWarpDuration: 1500,
}
Object.freeze(Duration);

export const PlayerState = {
	idle: "idle",
	idleLeft: "idleLeft",
	idleRight: "idleRight",
	walkingLeft: "walkingLeft",
	walkingRight: "walkingRight",
	talking: "talking",
	hurt: "hurt",
}
Object.freeze(PlayerState);


export const TriggerType = {
	bring: "bring",
	interact: "interact",
	sceneEnter: "sceneEnter",
	enterLocation: "enterLocation",
	leaveLocation: "leaveLocation",
}
Object.freeze(TriggerType);