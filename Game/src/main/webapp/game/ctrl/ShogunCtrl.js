Aria.classDefinition({
    $classpath : "game.ctrl.ShogunCtrl",
    $extends : "aria.templates.ModuleCtrl",
    $implements : ["game.ctrl.ShogunCtrlInterface"],
    $dependencies : ["aria.utils.Json"],
    $prototype : {
        $publicInterfaceName : "game.ctrl.ShogunCtrlInterface",
        init : function (args, cb) {
        	this._data={turn:"blue",board:{},selected:false};
        	var blue=false;
        	var red=false;
        	for (var x=0;x<8;x++){
        		if (x===0){
        			blue=true;
        		} else if (x===7){
        			red=true;
        		} else {
        			blue=false;
        			red=false;
        		}
        		this._data.board["x"+x]={};
        		for (var y=0;y<8;y++){
        			var pawn = null;
        			if (red || blue){
        				var color="red";
        				var king = false;
        				if (blue){
        					color="blue";
        				}
        				if (y>=4){
        					number=(8-y);
        				} else {
        					number=y+1;
        				}
        				if (red && y === 4){
        					king = true;
        				} else if (blue && y === 3){
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