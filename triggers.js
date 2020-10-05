import {Point, Rect, Size} from "./hgl/geometry.js"
import {Trigger} from "./TriggerController.js"
import {TriggerType, Duration, PlayerState} from "./Constants.js"

export const Triggers = [

	//SOO1

	new Trigger(TriggerType.sceneEnter, "s001",(g, d) => {

		if(g.getSwitch("global-timeWarp2")) {
			g.setStateForPlayer(PlayerState.idleRight);
			g.setStateForPlayer(PlayerState.idleRight);
			g.setStateForSceneElement("s001-window01", "");
			g.clearSwitch("s001-onBin");
			g.disableSceneElement("s001-window01");
			g.enableSceneElement("s001-bin");
			g.playerElement.point = new Point(80, 250);
			g.wait(1000, (g) => {
				g.clearCameraEffects();
				g.enqueueMessage("Aaah!!")
				g.enqueueMessage("I'm... ok?")
				.openMessageBox();
			});
			return;
		}

		if (g.getSwitch("global-timeWarp1")) {
			g.setStateForSceneElement("s001-window01", "");
			g.clearSwitch("s001-onBin");
			g.disableSceneElement("s001-window01");
			g.enableSceneElement("s001-bin");
			g.playerElement.point = new Point(80, 250);
			g.wait(1000, (g) => {
				g.clearCameraEffects();
				g.enqueueMessage("What happened...?")
				g.enqueueMessage("I'm back outside!")
				g.enqueueMessage("...and the window is back to being unbroken!")
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
				g.enqueueMessage("OK - The orders are clear enough. I am supposed to find a way into this research facility, locate the underground research lab, and document or if possible - steal - the industry secrets they keep there.")
				g.enqueueMessage("The client couldn't tell me what to look for. Only that it's something that helped this mining company increase their yields tenfold in the last year.")
				g.enqueueMessage("If this is anything like the heist last year, I'm probably looking for some computer algorithm. I will have to keep my eyes open.")
				g.enqueueMessage("Navigate with the A and D keyboard keys, and interact with your environment with [Enter]", "info")
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
		if (g.getSwitch("global-timeWarp1") || g.getSwitch("global-timeWarp2")) {
			g.enqueueMessage("No metal chair leg here... I have it on me!").openMessageBox();
			return;
		};

		if (!g.getSwitch("s001-hasStone") && g.getSwitch("s001-hasInteractedWithWindow")) {
			g.enqueueMessage("Perhaps...")
			.enqueueMessage("Yes - I found a broken off leg of a metal chair. That should work.")
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
		if (g.getSwitch("global-timeWarp1") && g.getSwitch("s001-onBin")) {
			g.pause();
			g.enqueueMessage("I still have this metal bar...").openMessageBox((g)=> {
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
			return;
		};

		if (g.getSwitch("global-timeWarp2") && g.getSwitch("s001-onBin")) {
			g.enqueueMessage("This is getting old").openMessageBox((g)=> {
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
			return;
		};

		if (!g.getSwitch("s001-onBin")) {
			g.enqueueMessage("I can't reach it.").openMessageBox();
			return;
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
					g.clearSwitch("s001-onBin");
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
		if (g.getSwitch("global-timeWarp1") || g.getSwitch("global-timeWarp2")) {
			g.enqueueMessage("No reason to go back.").openMessageBox();
			return;
		}
		g.fadeToScene("s001");
	}, true),

	new Trigger(TriggerType.interact, "s002-door01",(g, d) => {
		g.fadeToScene("s003");
	}, true),

	new Trigger(TriggerType.interact, "s002-cupboard",(g, d) => {
		if (g.getSwitch("global-timeWarp2")) {
			g.enqueueMessage("I already have the pliers on me!").openMessageBox();
			return;
		};

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
		if (g.getSwitch("global-timeWarp1") || g.getSwitch("global-timeWarp2")) {
			g.enqueueMessage("I still have no reason to turn this valve...").openMessageBox();
			return;
		};

		g.enqueueMessage("I have no reason to turn this valve").openMessageBox();
	}, true),

	new Trigger(TriggerType.interact, "s002-shelf",(g, d) => {
		g.enqueueMessage("Just old supplies and paint buckets").openMessageBox();
	}, true),

	//SOO3

	new Trigger(TriggerType.sceneEnter, "s003",(g, d) => {
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
			g.enqueueMessage("I should not move further, that will set off the alarm.").openMessageBox();
		}
	}, true),


	new Trigger(TriggerType.enterLocation, "s003-alarmTrigger",(g, d) => {
		if (!g.getSwitch("s003-observedAlarmSensor")) {
			//TODO Play Alarm, show red siren effect
			g.pause();
			g.playSound("sfx_alarm.ogg");
			g.applyCameraEffect("alarmOverlay");
			g.enqueueMessage("Oh no!").enqueueMessage("I must have tripped the alarm! I have to get out!").openMessageBox((g) => {
				g.wait(1000, (g) => {
					g.pause();
					g.clearCameraEffects();
					g.enableSceneElement("s003-alarmBlock");
					g.enableSceneElement("s003-alarmCaution");
					g.setSwitch("s003-observedAlarmSensor");
					g.setSwitch("global-timeWarp1");
					g.enqueueMessage("What's happening?!").openMessageBox((g) => {
						g.timeWarp((g) => {
							g.fadeToScene("s001");
						});
					});
				});
			});
		} else {
			// should not be possible
		}
	}),

	new Trigger(TriggerType.interact, "s003-alarm",(g, d) => {

		if (g.getSwitch("s003-alarmDisabled") || g.getSwitch("global-timeWarp2")) {
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
				g.enqueueMessage("This seems to be the box for the alarm. There doesn't seem to be any buttons on this box that allows me to disable it.").openMessageBox();
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
	 	if (g.getSwitch("global-timeWarp2") && !g.getSwitch("s005-knowsSecret")) {
			g.enqueueMessage("No way am I going down there again without some form of protection.")
			.openMessageBox();
	 		return;
	 	}
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
		if (g.getSwitch("global-timeWarp2")) {
			g.enqueueMessage("Let's see if I can find something about that scientist.")
			.enqueueMessage("Here's a recent employee update entry.")
			.enqueueMessage("Employee ID #0023. Nicholas Andelberth -- Placed on leave of absence due to recent unacceptable behavioral incidents. The official conclusion is that this lapse in judgement and control was triggered by the recent unexplained dissappearance of his wife, Klara Andelberth. Another likely cause is prolonged exposure to [REDACTED].", "computer")
			.enqueueMessage("Did his wife experience something similar to what I am?")
			.openMessageBox((g)=>{
				g.setSwitch("s005-knowsSecret")
			});
		} else {
			g.enqueueMessage("It's not password protected. Let's see what's on here.")
			.enqueueMessage("It's just personell files. I wouldn't even know what to look for.")
			.openMessageBox();
		}
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
			g.wait(500, (g)=> {
				g.setSwitch("s005-metScientist");
				g.pause();
				g.enqueueMessage("Who are you!? You are not supposed to be here!","scientist")
				.enqueueMessage("I- I work here.")
				.enqueueMessage("Lies!","scientist")
				.openMessageBox((g)=>{
					g.wait(500,(g)=> {
						g.pause();
						g.playSound("sfx_gunshot.ogg");
						g.applyCameraEffect("shotOverlay");
						g.setStateForPlayer(PlayerState.hurt);
						g.enableSceneElement("s003-alarmBlock");
						g.enableSceneElement("s003-alarmCaution");
						g.setStateForSceneElement("s003-alarm", "");
						g.clearSwitch("s003-alarmDisabled");

						g.wait(2000,(g)=> {
							g.clearCameraEffects();
							g.setSwitch("global-timeWarp2");
							g.timeWarp((g) => {
								g.fadeToScene("s001");
							})
						})
					});
				});
			})
		} else {
			g.wait(500, (g)=> {
				g.pause();
				g.enqueueMessage("Who are you!? You are not supposed to be here!","scientist")
				.enqueueMessage("Professor Andelberth - I know about your wife! I know about Klara!")
				.enqueueMessage("You... know.","scientist")
				.openMessageBox((g) => {
					g.setStateForSceneElement("s005-scientist", "relaxed");
				});
			});
		}
	}, true),

	new Trigger(TriggerType.interact, "s005-staircase",(g, d) => {
		if (g.getSwitch("s005-knowsSecret")) {
			g.enqueueMessage("No point in leaving now.","scientist").openMessageBox();
		}
	}, true),

	new Trigger(TriggerType.interact, "s005-scientist",(g, d) => {
		if (!g.getSwitch("s005-talkedToScientist")) {
			g.setSwitch("s005-talkedToScientist");
			g.enqueueMessage("It was never supposed to turn out this way. We only wanted to use it for mining.","scientist")
			.enqueueMessage("We found this... stone deep in the Raunisvaara mountain. With it, we have been able to mine the same vein of ore several times over. Corporate kept pushing for more results. We knew it was unstable. ","scientist")
			.enqueueMessage("My wife Klara was the first victim, but I fear it is to blame for the recent dissappearances across town.","scientist")
			.enqueueMessage("If you want to take it away. I will not hinder you. Do what you will.","scientist")
			.openMessageBox();
		} else {
			g.enqueueMessage("Do what you will.","scientist").openMessageBox();
		}
	}, true),

	new Trigger(TriggerType.interact, "s005-artifact",(g, d) => {
		g.timeWarp((g) => {
			g.fadeToScene("end");
		})
	}, true),

	//END
	new Trigger(TriggerType.sceneEnter, "end",(g, d) => {
		g.enqueueMessage('To be continued...<br><br>Thanks for playing! This game was produced during 48 hours for <a href="http://ldjam.com/" target="_blank">Ludum Dare</a> for the theme of <em>Stuck in a loop</em>.<br><br>Please cosider <a href="https://ldjam.com/events/ludum-dare/47/the-trade-secret" target="_blank">rating the game and leaving a comment</a>.<br><br>Milestone Games',"game")
		.openMessageBox()

	}),
];