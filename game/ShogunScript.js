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
					var oldSelected=this.data.selected;
					if (oldSelected){
						var oldSquare = this.data.board["x"+oldSelected.x]["y"+oldSelected.y];
						this.unselect(oldSelected.x,oldSelected.y,oldSquare.pawn);
					}
					if (oldSelected.x === x && oldSelected.y === y){
						return;
					}
					this.data.selected={x:x,y:y,pawn:square.pawn};
					if (square.pawn && square.pawn.color===this.data.turn){
						this.$json.setValue(this.data.board["x"+x]["y"+y],
								"selected", true);
						this.displayMove(square.pawn,x,y,square.pawn.number,true,true);
						this.displayMove(square.pawn,x,y,square.pawn.number,true,false);
						this.displayMove(square.pawn,x,y,square.pawn.number,false,true);
						this.displayMove(square.pawn,x,y,square.pawn.number,false,false);
					}
				},
				move:function(evt,args){
					var targetX=args[0];
					var targetY=args[1];
					var oldX = this.data.selected.x;
					var oldY = this.data.selected.y;
					var pawn = this.data.selected.pawn;
					this.unselect(oldX,oldY,this.data.selected.pawn);

					var opponent = this.data.board["x"+targetX]["y"+targetY];
					if (opponent.pawn){
						var turn = this.data.turn;
						var score = this.data.score[this.data.turn];
						score++;
						this.$json.setValue(this.data.score,turn,score);
						console.log(score);
						if (opponent.pawn.king){
							this.$json.setValue(this.data,
									"winner",this.data.turn);
						}
					}
					this.$json.setValue(this.data.board["x"+oldX]["y"+oldY],
							"pawn",false);
					pawn.number=(pawn.number%4)+1;
					this.$json.setValue(this.data.board["x"+targetX]["y"+targetY],
							"pawn",pawn);
					if (this.data.turn==="red"){
						this.$json.setValue(this.data,
								"turn","blue");
					} else {
						this.$json.setValue(this.data,
								"turn","red");
					}
					this.data.selected=false;
				},
				unselectEvt:function(evt,args){
					this.unselect(args[1],args[2],args[0]);
				},
				unselect:function(x,y,pawn){
					if (this.data.selected){
						this.$json.setValue(this.data.board["x"+x]["y"+y],
								"selected",false);
						if (pawn && pawn.moves){
							for (var i=0;i<pawn.moves.length;i++){
								var move = pawn.moves[i];
								this.$json.setValue(this.data.board["x"+move.x]["y"+move.y],
										"highlight",false);
							}
							pawn.moves=[];
						}
						this.data.selected=false;
					}
				},
				displayMove:function(pawn,currentX,currentY,distance,forward,vertical){
					var result = this.isMoveAllowed(pawn,currentX,currentY,distance,forward,vertical,this.data.turn);
					if (result){
						this.$json.setValue(this.data.board["x"+result.x]["y"+result.y],
								"highlight", true);
						pawn.moves.push(result);
					}
				},
				isMoveAllowed:function(pawn,currentX,currentY,distance,forward,vertical,color){
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
					var squareDest = this.data.board["x"+finalX]["y"+finalY];
					var shogun=false;
					var foe=false;
					if (squareDest.pawn){
						if (squareDest.pawn.color===color){
							return false;
						} else {
							foe=true;
							if (squareDest.pawn.king){
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
						//console.log("Out:"+x+","+y);
						return true;
					}
					var square = this.data.board["x"+x]["y"+y];
					if (square.pawn){
						//console.log("Taken:"+x+","+y);
						return true;
					}
					return false;
				}
			}
});