let constantList = function(...values) {
	let obj = {};
	values.forEach(value => {
		obj[value] = value;
	})
	Object.freeze(obj);
	return obj;
}

/* DEBUG */

export const Debug = {
	skipIntro: true,
	muteMusic: true,
	infiniteStorage: false,
	automaticProduction: false,
}
Object.freeze(Debug);

/* DURATION */

export const Duration = {
	defaultDuration: 300,
}
Object.freeze(Duration);

/* CUSTOMERS */

export const PlayerState = {
	idle: "idle",
	walkingLeft: "walkingLeft",
	walkingRight: "walkingRight",
	talking: "talking",
}
Object.freeze(PlayerState);