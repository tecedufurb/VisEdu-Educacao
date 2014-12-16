function RestoreSelfColorComponent(){}

RestoreSelfColorComponent.prototype = new Component(); 

JSUtils.addMethod(RestoreSelfColorComponent.prototype, "initialize", 
  function(color, timeWithoutPerception){
    this.initialize();
    this.color = color;
    this.timeWithoutPerception = timeWithoutPerception;
    return this;
  }
);

RestoreSelfColorComponent.prototype.onUpdate = function(delta) {
	if ( this.owner.lastPerceived && (Date.now()-this.owner.lastPerceived > this.timeWithoutPerception) ) {
		if ( this.owner instanceof BoxObject ) {
			var render = ComponentUtils.getComponent(this.owner, "BOX_RENDER_COMPONENT");	
		} else if ( this.owner instanceof CircleObject ) {
			var render = ComponentUtils.getComponent(this.owner, "CIRCLE_RENDER_COMPONENT");		
		} else if ( this.owner instanceof PolygonObject ) {
			var render = ComponentUtils.getComponent(this.owner, "POLYGON_RENDER_COMPONENT");		
		}	
		if (render)  {
			render.fillStyle = this.color;
		}
	}
}

RestoreSelfColorComponent.prototype.getSystems = function(){
    var systems = new Array();
    systems = ArrayUtils.addElement(systems, LogicSystem.getTag());
    return systems;
}

RestoreSelfColorComponent.prototype.getTag = function(){
 	   return "RESTORE_SELF_COLOR_COMPONENT";
}