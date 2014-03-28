{Template {
  $classpath: "game.Shogun",
  $css : ["game.css.ShogunStyle","game.css.PawnStyle","game.css.MediaStyle"],
  $hasScript:true,
  $res: {"res":"game.res.LocaleResources"},
}}

  {macro main()}
   {call header()/}
   {call end()/}
    {call board(data[data.mode])/}
        {if data.tutorial}
      {section {
                macro :{
                  name:"tutorial",
                  scope:this,
                  args:[data.tutorial]
                },
                cssClass:"tutorial content",
                bindRefreshTo : [{
                   inside : data.tutorial,
                    to : "step",
                }]
      }/}
    {/if}
    {call footer(data[data.mode])/}
  {/macro}

  {macro board(game)}
  <div class='board content{if data.display.horizontalBoard} rotated{/if}'>
  {for var y = 0; y < 8; y++}
       {for var x = 0; x < 8; x++}
              {var square = game.board["x"+x]["y"+y]/}
              {section {
                macro :{
                  name:"square",
                  args:[square,x,y],
                  scope:this,
                },
                bindRefreshTo : [{
                   inside : square,
                    to : "highlight",
                },{
                   inside : square,
                    to : "selected",
                },{
                   inside : game.board["x"+x]["y"+y],
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
    /}{/if} class='square-box{if data.display.horizontalBoard} rotated{/if}{if square.odd} odd{/if}{if square.highlight} highlight{/if}{if square.selected} selected{/if}{if square.pawn} pawn-tile{/if}'>{call tile(square.pawn)/}</div>
  {/macro}

  {macro tile(pawn)}
  {if pawn}
    <div class='square-content ${pawn.color}'><div class='pawn pawn-${pawn.color}{if pawn.king}-king{else/}-${pawn.number}{/if}{if data.display.horizontalBoard} rotated{/if}'><span>{if pawn}{call pawn(pawn)/}{/if}</span></div></div>
  {/if}
  {/macro}

  {macro pawn(pawn)}
   {if pawn.king}<span class='kingmove'>${pawn.number}</span>{/if}
  {/macro}

  {macro header()}
      <div class='content{if data.display.horizontalBoard} rotated{/if}'><img class='logo{if data.display.horizontalBoard} rotated{/if}' src='game/ressources/shogun.png' alt='Shogun' title='Shogun'></div>
  {/macro}

  {macro footer(game)}
    <div class='content{if data.display.horizontalBoard} rotated{/if}'>
    {call colorSection(game,"blue","right")/}<i alt='{if data.display.horizontalBoard}${res.displayAction.boardhorizontal}{else /}${res.displayAction.boardvertical}{/if}' title='{if data.display.horizontalBoard}${res.displayAction.boardhorizontal}{else /}${res.displayAction.boardvertical}{/if}' style='cursor:pointer' class="fa fa-{if data.display.horizontalBoard}undo{else /}repeat{/if}" {on click rotate/}></i>
    {call colorSection(game,"green","left")/} {section {
                macro : {
                  name:"switchDisposition",
                  args:[game],
                  scope:this,
                },
                bindRefreshTo : [{
                   inside : game,
                    to : "isNew"
                }]
    }/}
    </div>
  {/macro}

  {macro end()}
    {@aria:Dialog {
      title: res.winner.title+" !",
      macro : "endContent",
      movable : true,
      visible : false,
      width : 300,
      height : 200,
       bind : {
          "visible" : {
        inside : data[data.mode],
        to : "end",
      }
     }
    }/}
  {/macro}

  {macro endContent()}
      ${res.winner.winnerIs}...${res.color[data[data.mode].winner]}. ${res.winner.congrats} !
  {/macro}

  {macro colorSection(game,color,float)}
      {section {
                macro :{
                  name:"score",
                  scope:this,
                  args:[game,color]
                },
                cssClass:float+" score",
                bindRefreshTo : [{
                   inside : game,
                    to : color
                },{
                   inside : game,
                    to : "turn"
                }]
    }/}
  {/macro}

  {macro score(game,color)}
      {if game.turn===color}<strong>{/if}${res.color[color]}{if game.turn===color}</strong>{/if} : ${game.score[color]}
  {/macro}

  {macro tutorial(tutorial)}
      <div class='step'>{if tutorial.step > 1}<i class="fa fa-chevron-circle-left" {on click {fn : this.updateStep,scope : this,args : [-1]}/}></i>{/if}<span>${res.tutorial.step} ${tutorial.step}</span>{if tutorial.step < tutorial.nbstep}<i {on click {fn : this.updateStep,scope : this,args : [1]}/} class="fa fa-chevron-circle-right"></i>{/if}</div>
      ${res.tutorial["step"+tutorial.step]}
  {/macro}

  {macro switchDisposition(game)}
      {if game.isNew}<i alt='{if data.display.verticalGame}${res.displayAction.tilehorizontal}{else /}${res.displayAction.tilevertical}{/if}' title='{if data.display.verticalGame}${res.displayAction.tilehorizontal}{else /}${res.displayAction.tilevertical}{/if}' style='cursor:pointer' class="fa fa-retweet" {on click changeDisposition/}></i>{/if}
  {/macro}

{/Template}