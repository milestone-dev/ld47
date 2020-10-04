import {Point, Rect, Size} from "./hgl/geometry.js"
import {Trigger} from "./TriggerController.js"
import {TriggerType} from "./Constants.js"

export const Triggers = [

	//SOO1

	new Trigger(TriggerType.sceneEnter, "s001",(g, d) => {
		if (d.previousSceneId == "s002") {
			g.playerElement.point = new Point(850, 65);
			g.setSwitch("s001-onBin");
			g.enableSceneElement("s001-window01");
			g.disableSceneElement("s001-bin");
		} else {
			g.playerElement.point = new Point(80, 270);
		}
	}, true),

	new Trigger(TriggerType.interact, "s001-bin",(g, d) => {
		if (!g.getSwitch("s001-onBin")) {
			g.playerElement.offsetY(-215);
			g.setSwitch("s001-onBin");
			g.enableSceneElement("s001-window01");
			g.disableSceneElement("s001-bin");
		}
	}, true),

	new Trigger(TriggerType.bring, "s001-binLeft",(g, d) => {
		if (g.getSwitch("s001-onBin")) {
			g.playerElement.offsetY(215);
			g.clearSwitch("s001-onBin");
			g.disableSceneElement("s001-window01");
			g.enableSceneElement("s001-bin");
		}
	}, true),

	new Trigger(TriggerType.bring, "s001-binRight",(g, d) => {
		if (g.getSwitch("s001-onBin")) {
			g.playerElement.offsetY(215);
			g.clearSwitch("s001-onBin");
			g.disableSceneElement("s001-window01");
			g.enableSceneElement("s001-bin");
		}
	}, true),

	new Trigger(TriggerType.interact, "s001-dumpster",(g, d) => {
		if (!g.getSwitch("s001-hasStone") && g.getSwitch("s001-hasInteractedWithWindow")) {
			g.enqueueMessage("Perhaps...").enqueueMessage("I found a metal chair leg.").openMessageBox();
			g.setSwitch("s001-hasStone");
		} else {
			g.enqueueMessage("There's nothing in there I need").openMessageBox();
		}
	}, true),

	new Trigger(TriggerType.interact, "s001-window01",(g, d) => {
		if (!g.getSwitch("s001-hasStone")) {
			g.enqueueMessage("I can't break it with my bare hands").openMessageBox();
			g.setSwitch("s001-hasInteractedWithWindow");
		} else if(!g.getSwitch("s001-hasEnteredWindowOnce")) {
			g.setSwitch("s001-hasEnteredWindowOnce");
			g.enqueueMessage("Here goes...").openMessageBox((g)=> {
				g.pause();
				//TODO: Change Window GFX
				g.playSound("sfx_smashWindow.ogg", (g) => {
					g.setSwitch("s001-windowBroken");
					g.unpause();
				});
			});
		}

		if (g.getSwitch("s001-windowBroken")) {
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
				g.enqueueMessage("These pliers might be useful.").openMessageBox();
				g.setSwitch("global-hasPliers");
			} else {
				g.enqueueMessage("I already have the tools I need").openMessageBox();
			}
		} else {
			g.enqueueMessage("Tools. I can't think of anything I need in there").openMessageBox();
		}
	}, true),

	new Trigger(TriggerType.interact, "s002-valve",(g, d) => {
		g.enqueueMessage("I have no reason to turn this valve").openMessageBox();
	}, true),

	new Trigger(TriggerType.interact, "s002-shelf",(g, d) => {
		g.enqueueMessage("Just old supplies and paint buckets").openMessageBox();
	}, true),

	//SOO3

	new Trigger(TriggerType.sceneEnter, "s003",(g, d) => {
		if (!g.getSwitch("s003-firstEnter")) {
			console.log("Disabling some stuff on first enter");
			g.disableSceneElement("s003-alarmBlock");
			g.disableSceneElement("s003-alarmCaution");
			g.setSwitch("s003-firstEnter");
		}

		if (d.previousSceneId == "s002") {
			g.playerElement.point = new Point(350, 270);
		} else {
			g.playerElement.point = new Point(350, 270);
		}
	}, true),


	new Trigger(TriggerType.interact, "s003-door01",(g, d) => {
		g.loadScene("s002");
	}, true),


	new Trigger(TriggerType.enterLocation, "s003-hallwayEast",(g, d) => {
		g.enqueueMessage("Ok, this is it. Now to find the staircase to the lower floors.").openMessageBox();
	}),

	new Trigger(TriggerType.enterLocation, "s003-hallwayWest",(g, d) => {
		g.enqueueMessage("No, this is the wrong way. The client told the me access to the lower floors is the other way.").openMessageBox();
	}, true),

	new Trigger(TriggerType.enterLocation, "s003-alarmCaution",(g, d) => {
		if (g.getSwitch("s003-observedAlarmSensor")) {
			g.enqueueMessage("I should not move further. I will trigger the alarm").openMessageBox();
		}
	}, true),


	new Trigger(TriggerType.enterLocation, "s003-alarmTrigger",(g, d) => {
		if (!g.getSwitch("s003-observedAlarmSensor")) {
			//TODO Play Alarm, show red siren effect
			g.playSound("sfx_alarm.ogg");
			g.enqueueMessage("Oh no!").openMessageBox((g) => {
				g.setSwitch("s003-observedAlarmSensor");
				g.enableSceneElement("s003-alarmBlock");
				g.enableSceneElement("s003-alarmCaution");
				g.loadScene("s001");
				g.wait(500, (g) => {
					g.enqueueMessage("What...?").openMessageBox();
				})
			});
		} else {
			// should not be possible
		}
	}),

	new Trigger(TriggerType.interact, "s003-alarm",(g, d) => {

		if (g.setSwitch("s003-alarmDisabled")) {
			return;
		}

		if (g.getSwitch("s003-observedAlarmSensor")) {
			if (g.getSwitch("s003-inspectedAlarmBox")) {
				if (g.getSwitch("global-hasPliers")) {
					g.enqueueMessage("Cutting the cord.").openMessageBox();
					g.setSwitch("s003-alarmDisabled");
					g.disableSceneElement("s003-alarmBlock");
				} else {
					cg.enqueueMessage("I need a way to disable this alarm.").openMessageBox();
				}
			} else {
				g.enqueueMessage("This seems to be the box for the alarm. There doesn't seem to be any way to disable it.").openMessageBox();
				g.setSwitch("s003-inspectedAlarmBox")
			}
		} else {
			g.enqueueMessage("Not sure what this box is for...")
			g.enqueueMessage("I should follow the wire.")
			.openMessageBox();
		}
	}, true),
];