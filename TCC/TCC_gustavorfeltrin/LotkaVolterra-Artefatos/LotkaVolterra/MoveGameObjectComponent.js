function MoveGameObjectComponent(){}

MoveGameObjectComponent.prototype = new Component();

MoveGameObjectComponent.prototype.onKeyDown = function(keyCode){
  
}

MoveGameObjectComponent.prototype.onKeyUp = function(keyCode){
  if(keyCode == 37){
     this.owner.addMove(-60, 0); 
  }else if(keyCode == 38){
     this.owner.addMove(0, -60); 
  }else if(keyCode == 39){
     this.owner.addMove(60, 0); 
  }else if(keyCode == 40){
     this.owner.addMove(0, 60); 
  }
}

MoveGameObjectComponent.prototype.getSystems = function(){
  var systems = new Array();
  systems = ArrayUtils.addElement(systems, KeySystem.getTag());
  return systems;
}

MoveGameObjectComponent.prototype.getTag = function(){
  return "MOVE_PREDATOR_COMPONENT";
}