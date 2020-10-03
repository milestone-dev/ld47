import {Trigger} from "./TriggerController.js"
import {TriggerType} from "./Constants.js"

export const Triggers = [

	//SOO1

	new Trigger(TriggerType.interact, "s001-bin",(g)=>{
		if (!g.getSwitch("s001-onBin")) {
			let r = g.playerElement.rect;
			r.point = r.point.pointOffsetBy(0, -215);
			g.setSwitch("s001-onBin");
			g.playerElement.rect = r;
			g.enableSceneObject("s001-window01");
			g.disableSceneObject("s001-bin");
		}
	}, true),

	new Trigger(TriggerType.bring, "s001-binLeft",(g)=>{
		if (g.getSwitch("s001-onBin")) {
			let r = g.playerElement.rect;
			r.point = r.point.pointOffsetBy(0, 215);
			g.clearSwitch("s001-onBin");
			g.disableSceneObject("s001-window01");
			g.enableSceneObject("s001-bin");
		}
	}, true),

	new Trigger(TriggerType.bring, "s001-binRight",(g)=>{
		if (g.getSwitch("s001-onBin")) {
			let r = g.playerElement.rect;
			r.point = r.point.pointOffsetBy(0, 215);
			g.clearSwitch("s001-onBin");
			g.disableSceneObject("s001-window01");
			g.enableSceneObject("s001-bin");
		}
	}, true),

];