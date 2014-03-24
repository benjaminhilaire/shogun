Aria.classDefinition({
    $classpath : "game.ctrl.ShogunCtrl",
    $extends : "aria.templates.ModuleCtrl",
    $implements : ["game.ctrl.ShogunCtrlInterface"],
    $dependencies : ["aria.utils.Json"],
    $prototype : {
        $publicInterfaceName : "game.ctrl.ShogunCtrlInterface",
        init : function (args, cb) {
        	this._data={turn:"green",board:{},selected:false,score:{blue:0,green:0},size:60};
        	var green=false;
        	var blue=false;
        	for (var x=0;x<8;x++){
        		if (x===0){
        			green=true;
        		} else if (x===7){
        			blue=true;
        		} else {
        			green=false;
        			blue=false;
        		}
        		this._data.board["x"+x]={};
        		for (var y=0;y<8;y++){
        			var pawn = null;
        			if (blue || green){
        				var color="blue";
        				var king = false;
        				if (green){
        					color="green";
        				}
        				if (y>=4){
        					number=y-3;
        				} else {
        					number=4-y;
        				}
        				if (blue && y === 4){
        					king = true;
        				} else if (green && y === 3){
        					king = true;
        				}
        				pawn = {color:color,number:number,king:king,moves:[]};
        			}
        			var odd=false;
        			if ((x+y)%2 === 1){
        				odd=true;
        			}
        			this._data.board["x"+x]["y"+y]={pawn:pawn,highlight:false,selected:false,odd:odd};
            	}
        	}
        	console.log(this._data);
        	this.$callback(cb);
        }
	}
});