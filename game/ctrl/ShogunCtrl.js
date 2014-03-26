Aria.classDefinition({
    $classpath : "game.ctrl.ShogunCtrl",
    $extends : "aria.templates.ModuleCtrl",
    $implements : ["game.ctrl.ShogunCtrlInterface"],
    $dependencies : ["aria.utils.Json"],
    $prototype : {
        $publicInterfaceName : "game.ctrl.ShogunCtrlInterface",
        init : function (args, cb) {
        	this.initialize({verticalGame:true,horizontalBoard:false,mode:"twoplayers"});
        	this.$callback(cb);
        },
        initialize:function(arg){
        	var verticalGame=arg.verticalGame;
        	var horizontalBoard=arg.horizontalBoard;
        	var mode = null;
        	if (arg.mode){
        		mode = arg.mode;
        	} else {
        		mode = this._data.mode;
        	}
        	var tutorial = window.tutorial;
        	if (tutorial){
        		tutorial={step:1,nbstep:5};
        	}
        	var data={isNew:true,turn:"green",board:{},selected:false,score:{blue:0,green:0},size:60};
        	var green=false;
        	var blue=false;
        	for (var x=0;x<8;x++){
        		data.board["x"+x]={};
        	}
        	for (var x=0;x<8;x++){
        		if (x===0){
        			green=true;
        		} else if (x===7){
        			blue=true;
        		} else {
        			green=false;
        			blue=false;
        		}
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
        			if (verticalGame){
            			data.board["x"+x]["y"+y]={pawn:pawn,highlight:false,selected:false,odd:odd};
        			} else {
            			data.board["x"+y]["y"+x]={pawn:pawn,highlight:false,selected:false,odd:odd};
        			}
            	}
        	}
        	aria.utils.Json.setValue(this.getData(),mode,data);
        	aria.utils.Json.setValue(this.getData(),"display",{verticalGame:verticalGame,horizontalBoard:horizontalBoard});
        	aria.utils.Json.setValue(this.getData(),"tutorial",tutorial);
            aria.utils.Json.setValue(this.getData(),"mode",mode);
        	console.log(this._data);
        }
	}
});