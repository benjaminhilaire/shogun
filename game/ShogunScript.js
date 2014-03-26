Aria.tplScriptDefinition({
			$classpath : 'game.ShogunScript',
			$dependencies : ['aria.utils.Json'],
			$constructor : function() {

			},
			$prototype : {
				highlight:function(evt,args){
					var x=args[1];
					var y=args[2];
					var square=args[0];
					var data = this.__getCurrentData();
					var oldSelected=data.selected;
					if (oldSelected){
						var oldSquare = data.board["x"+oldSelected.x]["y"+oldSelected.y];
						this.unselect(oldSelected.x,oldSelected.y,oldSquare.pawn);
					}
					if (oldSelected.x === x && oldSelected.y === y){
						return;
					}
					data.selected={x:x,y:y,pawn:square.pawn};
					if (square.pawn && square.pawn.color===data.turn){
						this.$json.setValue(data.board["x"+x]["y"+y],
								"selected", true);
						this.displayMove(square.pawn,x,y,square.pawn.number,true,true);
						this.displayMove(square.pawn,x,y,square.pawn.number,true,false);
						this.displayMove(square.pawn,x,y,square.pawn.number,false,true);
						this.displayMove(square.pawn,x,y,square.pawn.number,false,false);
					}
				},
				move:function(evt,args){
					var data = this.__getCurrentData();
					if (data.isNew){
						this.$json.setValue(data,
								"isNew", false);
					}
					var targetX=args[0];
					var targetY=args[1];
					var oldX = data.selected.x;
					var oldY = data.selected.y;
					var pawn = data.selected.pawn;
					this.unselect(oldX,oldY,data.selected.pawn);

					var opponent = data.board["x"+targetX]["y"+targetY];
					if (opponent.pawn){
						var turn = data.turn;
						var score = data.score[data.turn];
						score++;
						this.$json.setValue(data.score,turn,score);
						console.log(score);
						if (opponent.pawn.king){
							this.$json.setValue(data,
									"winner",data.turn);
							this.$json.setValue(data,
									"end",true);
						}
					}
					this.$json.setValue(data.board["x"+oldX]["y"+oldY],
							"pawn",false);
					if (pawn.king){
						pawn.number=(pawn.number%2)+1;
					} else {
						pawn.number=(pawn.number%4)+1;
					}
					this.$json.setValue(data.board["x"+targetX]["y"+targetY],
							"pawn",pawn);
					if (data.turn==="blue"){
						this.$json.setValue(data,
								"turn","green");
					} else {
						this.$json.setValue(data,
								"turn","blue");
					}
					data.selected=false;
				},
				unselectEvt:function(evt,args){
					this.unselect(args[1],args[2],args[0]);
				},
				unselect:function(x,y,pawn){
					var data = this.__getCurrentData();
					if (data.selected){
						this.$json.setValue(data.board["x"+x]["y"+y],
								"selected",false);
						if (pawn && pawn.moves){
							for (var i=0;i<pawn.moves.length;i++){
								var move = pawn.moves[i];
								this.$json.setValue(data.board["x"+move.x]["y"+move.y],
										"highlight",false);
							}
							pawn.moves=[];
						}
						data.selected=false;
					}
				},
				displayMove:function(pawn,currentX,currentY,distance,forward,vertical){
					var data = this.__getCurrentData();
					var result = this.isMoveAllowed(pawn,currentX,currentY,distance,forward,vertical,data.turn);
					if (result){
						this.$json.setValue(data.board["x"+result.x]["y"+result.y],
								"highlight", true);
						pawn.moves.push(result);
					}
				},
				isMoveAllowed:function(pawn,currentX,currentY,distance,forward,vertical,color){
					var data = this.__getCurrentData();
					distance=distance-1;
					var realDistance=distance+1;
					var finalX=currentX;
					var finalY=currentY;
					if (!vertical){
						// Horizontal
						if (forward){
							for (var i=currentX+1;i<=currentX+distance;i++){
								if (this.__isOccupied(i,currentY)){
									return false;
								}
							}
							finalX=currentX+realDistance;
						} else {
							for (var i=currentX-1;i>=currentX-distance;i--){
								if (this.__isOccupied(i,currentY)){
									return false;
								}
							}
							finalX=currentX-realDistance;
						}
					}
					else {
						// Vertical
						if (forward){
							for (var i=currentY+1;i<=currentY+distance;i++){
								if (this.__isOccupied(currentX,i)){
									return false;
								}
							}
							finalY=currentY+realDistance;
						} else {
							for (var i=currentY-1;i>=currentY-distance;i--){
								if (this.__isOccupied(currentX,i)){
									return false;
								}
							}
							finalY=currentY-realDistance;
						}
					}
					if (this.__isOutOfBond(finalX, finalY)){
						return false;
					}
					var square = data.board["x"+finalX]["y"+finalY];
					var shogun=false;
					var foe=false;
					if (square.pawn){
						if (square.pawn.color===color){
							return false;
						} else {
							foe=true;
							if (square.pawn.king){
								shogun=true;
							}
						}
					}
					return {x:finalX,y:finalY,foe:foe,shogun:shogun};
				},
				__isOutOfBond:function(x,y){
					if (x>7){
						return true;
					}
					if (x<0){
						return true;
					}
					if (y>7){
						return true;
					}
					if (y<0){
						return true;
					}
					return false;
				},
				__isOccupied:function(x,y){
					if (this.__isOutOfBond(x,y)){
						return true;
					}
					var square = this.__getCurrentData().board["x"+x]["y"+y];
					if (square.pawn){
						return true;
					}
					return false;
				},
				updateStep:function(evt,args){
					var data = this.__getCurrentData();
					var oldStep = data.tutorial.step;
					this.$json.setValue(data.tutorial,
							"step", oldStep+args[0]);
				},
				rotate:function(evt,args){
					this.data.display.horizontalBoard=!this.data.display.horizontalBoard;
					this.$refresh();
				},
				changeDisposition:function(evt,args){
					if (this.__getCurrentData().isNew){
						this.moduleCtrl.initialize({verticalGame:!this.data.display.verticalGame,horizontalBoard:this.data.display.horizontalBoard});
						this.$refresh();
					}
				},
				__getCurrentData:function(){
					return this.data[this.data.mode];
				}
			}
});