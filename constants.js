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
	infiniteStorage: false,
	automaticProduction: false,
}
Object.freeze(Debug);

export const Duration = {
	defaultDuration: 300,
}
Object.freeze(Duration);

export const PlayerState = {
	idle: "idle",
	idleLeft: "idleLeft",
	idleRight: "idleRight",
	walkingLeft: "walkingLeft",
	walkingRight: "walkingRight",
	talking: "talking",
}
Object.freeze(PlayerState);


export const TriggerType = {
	bring: "bring",
	interact: "interact",
}
Object.freeze(TriggerType);