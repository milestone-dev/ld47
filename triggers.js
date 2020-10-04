import {Point, Rect, Size} from "./hgl/geometry.js"
import {Trigger} from "./TriggerController.js"
import {TriggerType} from "./Constants.js"

export const Triggers = [

	//SOO1

	new Trigger(TriggerType.sceneEnter, "s001",(g, d) => {
		if (d.previousSceneId == "s002") {
			g.playerElement.point = new Point(850, 65);
			g.setSwitch("s001-onBin");
			g.enableSceneObject("s001-window01");
			g.disableSceneElement("s001-bin");
		} else {
			g.playerElement.point = new Point(80, 270);
		}
	}, true),

	new Trigger(TriggerType.interact, "s001-bin",(g, d) => {
		if (!g.getSwitch("s001-onBin")) {
			g.playerElement.offsetY(-215);
			g.setSwitch("s001-onBin");
			g.enableSceneObject("s001-window01");
			g.disableSceneElement("s001-bin");
		}
	}, true),

	new Trigger(TriggerType.bring, "s001-binLeft",(g, d) => {
		if (g.getSwitch("s001-onBin")) {
			g.playerElement.offsetY(215);
			g.clearSwitch("s001-onBin");
			g.disableSceneElement("s001-window01");
			g.enableSceneObject("s001-bin");
		}
	}, true),

	new Trigger(TriggerType.bring, "s001-binRight",(g, d) => {
		if (g.getSwitch("s001-onBin")) {
			g.playerElement.offsetY(215);
			g.clearSwitch("s001-onBin");
			g.disableSceneElement("s001-window01");
			g.enableSceneObject("s001-bin");
		}
	}, true),

	new Trigger(TriggerType.interact, "s001-dumpster",(g, d) => {
		if (!g.getSwitch("s001-hasStone")) {
			console.log("I found a ");
			g.setSwitch("s001-hasStone");
		}
	}),

	new Trigger(TriggerType.interact, "s001-window01",(g, d) => {
		if (!g.getSwitch("s001-hasStone")) {
			console.log("I can't break it with my bare hands");
		} else {
			g.loadScene("s002");
		}
	}, true),

	//SOO2

	new Trigger(TriggerType.sceneEnter, "s002",(g, d) => {
		if (d.previousSceneId == "s003") {
			g.playerElement.point = new Point(750, 270);
		} else {
			g.playerElement.point = new Point(350, 270);
		}
	}, true),

	new Trigger(TriggerType.interact, "s002-window01",(g, d) => {
		g.loadScene("s001");
	}, true),

	new Trigger(TriggerType.interact, "s002-door01",(g, d) => {
		g.loadScene("s003");
	}, true),

	new Trigger(TriggerType.interact, "s002-cupboard",(g, d) => {
		if (g.getSwitch("s003-inspectedAlarmBox")) {
			if (!g.getSwitch("global-hasPliers")) {
				console.log("These pliers might be useful.");
				g.setSwitch("global-hasPliers");
			} else {
				console.log("I already have the tools I need");
			}
		} else {
			console.log("Tools. I can't think of anything I need in there");
		}
	}, true),

	//SOO3

	new Trigger(TriggerType.sceneEnter, "s003",(g, d) => {
		if (d.previousSceneId == "s002") {
			g.playerElement.point = new Point(350, 270);
		} else {
			g.playerElement.point = new Point(350, 270);
		}
	}, true),

	new Trigger(TriggerType.interact, "s003-door01",(g, d) => {
		g.loadScene("s002");
	}, true),


	new Trigger(TriggerType.bring, "s003-alarmWarn",(g, d) => {
		console.log("If I move further the alarm will go off!");
		if (!g.getSwitch("s003-observedAlarmSensor")) {
			g.setSwitch("s003-observedAlarmSensor");
		}
	}),

	new Trigger(TriggerType.interact, "s003-alarm",(g, d) => {

		if (g.setSwitch("s003-alarmDisabled")) {
			return;
		}

		if (g.getSwitch("s003-observedAlarmSensor")) {
			if (g.getSwitch("s003-inspectedAlarmBox")) {
				if (g.getSwitch("global-hasPliers")) {
					console.log("Cutting the cord.");
					g.setSwitch("s003-alarmDisabled");
					g.disableSceneElement("s003-alarmBlock");
					// TODO actually disable the blockade
				} else {
					console.log("I need a way to disable this alarm.");
				}
			} else {
				console.log("This seems to be the box for the alarm. There doesn't seem to be any way to disable it.");
				g.setSwitch("s003-inspectedAlarmBox")
			}
		} else {
			console.log("Not sure what this box is for");
		}
	}, true),
];