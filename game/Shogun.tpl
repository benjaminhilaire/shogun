{Template {
  $classpath: "game.Shogun",
  $css : ["game.ShogunStyle"],
  $hasScript:true
}}

  {macro main()}
   {call header()/}
   {call end()/}
    {call board()/}
    {call footer()/}
  {/macro}

  {macro board()}
  <div class='board content'>
  {for var y = 0; y < 8; y++}
       {for var x = 0; x < 8; x++}
              {var square = data.board["x"+x]["y"+y]/}
              {section {
                macro :{
                  name:"square",
                  args:[square,x,y],
                  scope:this,
                },
                bindRefreshTo : [{
                   inside : data.board["x"+x]["y"+y],
                    to : "highlight",
                },{
                   inside : data.board["x"+x]["y"+y],
                    to : "selected",
                },{
                   inside : data.board["x"+x]["y"+y],
                    to : "pawn",
                }]
             }/}
          {if x ==7}<div class='clear'></div>{/if}
      {/for}
    {/for}
  </div>
  {/macro}

    {macro square(square,x,y)}
    <div {if square.pawn}{on click {
    fn : this.highlight,
    scope : this,
    args : [square,x,y]}
    /}{/if}{if square.highlight}{on click {
    fn : this.move,
    scope : this,
    args : [x,y]}
    /}{/if} class='square-box{if square.odd} odd{/if}{if square.highlight} highlight{/if}{if square.selected} selected{/if}{if square.pawn} pawn{/if}'>{call tile(square.pawn)/}</div>
  {/macro}

  {macro tile(pawn)}
  {if pawn}
    <div class='square-content ${pawn.color}'><div><span>{if pawn}{call pawn(pawn)/}{/if}</span></div></div>
  {/if}
  {/macro}

  {macro pawn(pawn)}
   {if pawn.king}<span class='kingmove'>${pawn.number}</span>{/if}<img style='width:100%;' src='game/ressources/${pawn.color}{if pawn.king}king{else/}${pawn.number}{/if}.svg'
   alt='${pawn.number} ${pawn.color} {if pawn.king}Shogun{/if}' title='${pawn.number} ${pawn.color} {if pawn.king}Shogun{/if}' />
  {/macro}

  {macro turn()}
      <h2>Turn to ${data.turn}</h2>
  {/macro}

  {macro header()}
      <div class='content'><h1 style='text-align:center;'>Shogun</h1></div>
  {/macro}

  {macro footer()}
    <div class='content'>
    {call colorSection("blue","right")/}
    {call colorSection("green","left")/}
    </div>
  {/macro}

  {macro end()}
    {@aria:Dialog {
      title: "Winner",
      contentMacro : "endContent",
      movable : true,
      visible : false,
      width : 300,
      height : 200,
       bind : {
          "visible" : {
        inside : data,
        to : "end",
      }
     }
    }/}
  {/macro}

  {macro endContent()}
       The winner is...${data.winner}. Congratulation !
  {/macro}

  {macro colorSection(color,float)}
      {section {
                macro :{
                  name:"score",
                  scope:this,
                  args:[color]
                },
                cssClass:float+" score",
                bindRefreshTo : [{
                   inside : data.score,
                    to : color
                },{
                   inside : data,
                    to : "turn"
                }]
    }/}
  {/macro}

  {macro score(color)}
      {if data.turn===color}<strong>{/if}${color}{if data.turn===color}</strong>{/if} : ${data.score[color]}
  {/macro}

{/Template}