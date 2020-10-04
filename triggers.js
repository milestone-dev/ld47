import {Point, Rect, Size} from "./hgl/geometry.js"
import {Trigger} from "./TriggerController.js"
import {TriggerType, Duration, PlayerState} from "./Constants.js"

export const Triggers = [

	//SOO1

	new Trigger(TriggerType.sceneEnter, "s001",(g, d) => {
		if (g.getSwitch("global-timeWarp1")) {
			g.setStateForSceneElement("s001-window01", "");
			g.playerElement.point = new Point(80, 250);
			g.wait(1000, (g) => {
				g.clearCameraEffects();
				g.enqueueMessage("What happened...?").openMessageBox();
			});
			return;
		} else if(g.getSwitch("global-timeWarp2")) {
			g.setStateForPlayer(PlayerState.idleRight);
			g.setStateForSceneElement("s001-window01", "");
			g.playerElement.point = new Point(80, 250);
			g.wait(1000, (g) => {
				g.clearCameraEffects();
				g.enqueueMessage("Aaah!!")
				g.enqueueMessage("I'm... ok?")
				.openMessageBox();
			});
			return;
		}
		if (d.previousSceneId == "s002") {
			g.playerElement.point = new Point(850, 40);
			g.setSwitch("s001-onBin");
			g.enableSceneElement("s001-window01");
			g.disableSceneElement("s001-bin");
		} else {
			g.playerElement.point = new Point(80, 250);
			if (!g.getSwitch("s001-firstTime")) {
				g.enqueueMessage("The orders are clear. I will have to find a way into this research facility, locate the underground research lab, and document or if possible - steal - the industry secrets they keep here.")
				g.enqueueMessage("They client couldn't tell me to looking for. Only that it's something that helped this mining company increase their yields tenfold in the last year.")
				g.enqueueMessage("If this is anything like the heist last year, I'm probably looking for some computer algorithm. I will have to keep my eyes open.")
				.openMessageBox();
				g.setSwitch("s001-firstTime");
			}
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
			g.enqueueMessage("Perhaps...")
			.enqueueMessage("Yes - I found a broken off chair of a metal chair. That should work.")
			.openMessageBox();
			g.setSwitch("s001-hasStone");
		} else {
			g.enqueueMessage("There's nothing in there I need").openMessageBox();
		}
	}, true),

	new Trigger(TriggerType.interact, "s001-pipe",(g, d) => {
		g.enqueueMessage("It leads all the five stories up to the roof of this building, but I'm going underground.")
		.openMessageBox();
	}, true),

	new Trigger(TriggerType.interact, "s001-window01",(g, d) => {
		if (!g.getSwitch("s001-onBin")) {
			g.enqueueMessage("I can't reach it.").openMessageBox();
		} else if (!g.getSwitch("s001-hasStone")) {
			g.enqueueMessage("I can't break it with my bare hands").openMessageBox();
			g.setSwitch("s001-hasInteractedWithWindow");
		} else if(!g.getSwitch("s001-hasEnteredWindowOnce")) {
			g.setSwitch("s001-hasEnteredWindowOnce");
			g.enqueueMessage("Here goes...").openMessageBox((g)=> {
				g.pause();
				g.setStateForSceneElement("s001-window01", "broken");
				g.applyCameraEffect("shake");
				g.playSound("sfx_smashWindow.ogg", (g) => {
					g.clearCameraEffects();
					g.setSwitch("s001-windowBroken");
					g.fadeToScene("s002");
					g.unpause();
				});
			});
		}

		if (g.getSwitch("s001-windowBroken")) {
			g.fadeToScene("s002");
		}
	}, true),

	//SOO2

	new Trigger(TriggerType.sceneEnter, "s002",(g, d) => {
		if (d.previousSceneId == "s003") {
			g.playerElement.point = new Point(750, 250);
		} else {
			g.playerElement.point = new Point(350, 250);
		}
	}, true),

	new Trigger(TriggerType.interact, "s002-window01",(g, d) => {
		g.fadeToScene("s001");
	}, true),

	new Trigger(TriggerType.interact, "s002-door01",(g, d) => {
		g.fadeToScene("s003");
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
		g.setStateForSceneElement("s003-alarm", "cut");
		if (!g.getSwitch("s003-firstEnter")) {
			g.disableSceneElement("s003-alarmBlock");
			g.disableSceneElement("s003-alarmCaution");
			g.setSwitch("s003-firstEnter");
		}

		if (d.previousSceneId == "s002") {
			g.playerElement.point = new Point(350, 250);
		} else if(d.previousSceneId == "s004") {
			g.playerElement.point = new Point(2200, 250);
		} else {
			g.playerElement.point = new Point(350, 250);
		}
	}, true),


	new Trigger(TriggerType.interact, "s003-door01",(g, d) => {
		g.fadeToScene("s002");
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
			g.pause();
			g.playSound("sfx_alarm.ogg");
			g.applyCameraEffect("alarmOverlay");
			g.enqueueMessage("Oh no!").enqueueMessage("I must have tripped the alarm! I have to get out!").openMessageBox((g) => {
				g.wait(500, (g) => {
					g.clearCameraEffects();
					g.enableSceneElement("s003-alarmBlock");
					g.enableSceneElement("s003-alarmCaution");
					g.setSwitch("s003-observedAlarmSensor");
					g.setSwitch("global-timeWarp1");
					g.timeWarp((g) => {
						g.fadeToScene("s001");
					})
				});
			});
		} else {
			// should not be possible
		}
	}),

	new Trigger(TriggerType.interact, "s003-alarm",(g, d) => {

		if (g.getSwitch("s003-alarmDisabled")) {
			return;
		}

		if (g.getSwitch("s003-observedAlarmSensor")) {
			if (g.getSwitch("s003-inspectedAlarmBox")) {
				if (g.getSwitch("global-hasPliers")) {
					g.enqueueMessage("Cutting the cord.").openMessageBox((g) => {
						g.setStateForSceneElement("s003-alarm", "cut");
					});
					g.setSwitch("s003-alarmDisabled");
					g.disableSceneElement("s003-alarmBlock");
					g.disableSceneElement("s003-alarmCaution");
				} else {
					g.enqueueMessage("I need a way to disable this alarm.").openMessageBox();
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

	new Trigger(TriggerType.interact, "s003-cabinet01",(g, d) => {
		g.enqueueMessage("Locked.").openMessageBox();
	}, true),

	new Trigger(TriggerType.interact, "s003-cabinet02",(g, d) => {
		g.enqueueMessage("Can't open it.").openMessageBox();
	}, true),

	new Trigger(TriggerType.interact, "s003-cabinet03",(g, d) => {
		g.enqueueMessage("It's stuck.").openMessageBox();
	}, true),

	new Trigger(TriggerType.interact, "s003-door02",(g, d) => {
		g.fadeToScene("s004");
	}, true),

	new Trigger(TriggerType.interact, "s003-staircase",(g, d) => {
		g.fadeToScene("s005");
	}, true),

	//S004

	new Trigger(TriggerType.sceneEnter, "s004",(g, d) => {
		g.playerElement.point = new Point(80, 250);		
	}, true),

	new Trigger(TriggerType.interact, "s004-door01",(g, d) => {
		g.fadeToScene("s003");
	}, true),

	new Trigger(TriggerType.interact, "s004-computer",(g, d) => {
		g.enqueueMessage("It's not password protected. Let's see what's on here.").openMessageBox();
	}, true),

	new Trigger(TriggerType.interact, "s004-cabinet01",(g, d) => {
		g.enqueueMessage("Won't open.").openMessageBox();
	}, true),

	new Trigger(TriggerType.interact, "s004-plant",(g, d) => {
		g.enqueueMessage("Plastic.").openMessageBox();
	}, true),

	//S005

	new Trigger(TriggerType.sceneEnter, "s005",(g, d) => {
		g.playerElement.point = new Point(80, 250);
		if (!g.getSwitch("s005-knowsSecret")) {
			g.pause();
			g.enqueueMessage("Who are you!? You are not supposed to be here.")
			.enqueueMessage("I-")
			.openMessageBox((g)=>{
				g.applyCameraEffect("shot");
				g.setStateForPlayer(PlayerState.hurt);
				g.wait(2000,(g)=> {
					g.setSwitch("global-timeWarp2");
					g.timeWarp((g) => {
						g.fadeToScene("s001");
					})
				})
			});
		}
	}, true),

	new Trigger(TriggerType.interact, "s005-staircase",(g, d) => {
		g.fadeToScene("s003");
	}, true),

	new Trigger(TriggerType.interact, "s005-scientist",(g, d) => {
		g.enqueueMessage("Hm.").openMessageBox();
	}, true),

	new Trigger(TriggerType.interact, "s005-artifact",(g, d) => {
		g.enqueueMessage("Ok.").openMessageBox();
	}, true),
];