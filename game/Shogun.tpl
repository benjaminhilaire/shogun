{Template {
  $classpath: "game.Shogun",
  $css : ["game.ShogunStyle"],
  $hasScript:true,
}}

  {macro main()}
   {call header()/}
   {section {
                macro :{
                  name:"turn",
                  scope:this,
                },
                bindRefreshTo : [{
                   inside : data,
                    to : "turn",
                }]
    }/}
    {call board()/}
    {call footer()/}
  {/macro}

  {macro board()}
  <div class='board'>
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
    <div class='square-content ${pawn.color}'><div><span>{if pawn}${pawn.number}{if pawn.king}K{/if}{/if}</span></div></div>
  {/if}
  {/macro}

  {macro turn()}
      <h2>Turn to ${data.turn}</h2>
  {/macro}

  {macro header()}
      <h1>Shogun</h1>
  {/macro}

  {macro footer()}
    <div class='footer'>
    {call colorSection("red","right")/}
    {call colorSection("blue")/}
    </div>
  {/macro}

  {macro colorSection(color,float)}
      {section {
                macro :{
                  name:"score",
                  scope:this,
                  args:[color]
                },
                cssClass:float,
                bindRefreshTo : [{
                   inside : data.score,
                    to : color
                }]
    }/}
  {/macro}

  {macro score(color)}
      ${color} : ${data.score[color]}
  {/macro}

{/Template}