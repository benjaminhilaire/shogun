{Template {
  $classpath: "game.Shogun",
  $css : ["game.ShogunStyle"],
  $hasScript:true,
}}

  {macro main()}
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
    /}{/if} class='square{if square.odd} odd{/if}{if square.highlight} highlight{/if}{if square.selected} selected{/if}{if square.pawn && square.pawn.color==data.turn} pawn{/if}'>{call tile(square.pawn)/}</div>
  {/macro}

  {macro tile(pawn)}
  {if pawn}
    <div class='tile ${pawn.color}'>{if pawn}${pawn.number}{if pawn.king}K{/if}{/if}</div>
  {/if}
  {/macro}

  {macro turn()}
      <h1>${data.turn} to play</h1>
  {/macro}

{/Template}