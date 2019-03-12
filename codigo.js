$(document).ready(function(){
  //dialogo inicial
  $("#titulo").hide();
	$("#dialog-inicial").dialog({
    resizable: false,
    maxHeight:500,
    modal: true,
    buttons: {
      START : function() {
        $(this).dialog("close");
        START();}
      },
    show: {
      effect: "blind",
      duration: 1000
    },
    hide: {
      effect: "explode",
      duration: 1000
    }
	}).prev(".ui-dialog-titlebar").css("background","#80e170");

  //evento del boton start again
  $("#opener").on("click", function() {
    finJuego(0);
    $("#dialog-inicial").dialog("open");
  });
});

function START(){
	//iniciar pagina y variables
  $(document).unbind();
  $("#opener").show();
  intervaloTiempo=null;
  intervaloEnemigos=null;
  direccion="u";
	iVidas=3;
  $(".vida").addClass("llena");
  $(".vida").removeClass("gastada");
  puntos=0;
	iTiempo=100;
	nivel=1;

  //imagen fija cuando se para
  $(document).keyup(function(){
    $('#eve').css({'background-image': 'url(images/eve_e.png)', 'height': '59px'});
  });
	//movimientos y funciones con las teclas
  $(document).keydown(function(tecla){
    switch (tecla.keyCode) {
      case 40: 
        // tecla abajo
        $('#eve').animate({top: "+=5px"},10);
        $('#eve').css({'background-image': 'url(images/eve_a.gif)', 'height': '79px'});
        direccion="d";
        if(collision($('#eve'),$('#paredAbb')) > 0){
          $("#eve").stop(false,false);   
          direccion="u";
        }
        break;
      case 38:
        // tecla arriba
        $('#eve').animate({top: "-=5px"},10);
        $('#eve').css({'background-image': 'url(images/eve_a.gif)', 'height': '79px'});
        direccion="u";  
        if( collision($('#eve'),$('#paredArr')) > 0){
          $("#eve").stop(false,false);
          direccion="d";
        }
        break;
      case 37:
        // tecla izquierda
        $('#eve').animate({left: "+=-5px"},10);
        $('#eve').css({'background-image': 'url(images/eve_g_i.gif)', 'height': '79px'});
        direccion="l";
        if( collision($('#eve'),$('#paredIz')) > 0){
          $("#eve").stop(false,false);   
          $('#eve').css({'background-image': 'url(images/eve_g_d.gif)', 'height': '79px'});
          direccion="r";
        }
        break;
      case 39:
        // tecla derecha
        $('#eve').animate({left: "+=5px"},10);
        $('#eve').css({'background-image': 'url(images/eve_g_d.gif)', 'height': '79px'});
        direccion="r";
        if( collision($('#eve'),$('#paredDer')) > 0){
          $("#eve").stop(false,false);   
          $('#eve').css({'background-image': 'url(images/eve_g_i.gif)', 'height': '79px'});
          direccion="l";
        }
        break;
      case 32:
        // tecla espacio
        disparo();
        break;
      default:
        $('#eve').css({'background-image': 'url(images/eve_e.png)', 'height': '59px'});
        break;
    }
  });
	//inicar progresbar de tiempo
	$("#progressbar").progressbar({value: 100});
  $("#progressbar").css({'background': '#fcf3ea'});
  $("#progressbar").css({'border-color': '#51285b'});
	$("#progressbar > div").css({'background': '#80e170'});

  //SI SE QUIERE GANAR DIRECTAMENTE Y PASAR A LA FASE FINAL DESCOMENTAR:
  //nivel=4;
  
  cambiarnivel();
  cambiarPuntuacion();
  
}

function disparo(){
  var origenx=$("#eve").css("left");
  var origeny=$("#eve").css("top");
  var disparo=$("<div class='disparo'>");
  disparo.css({"top":origeny, "left":origenx});
  disparo.css({"top":"+=9px", "left":"+=14px"});
  $("#pantalla").append(disparo);
  //calcula animacion y velocidad dependiendo de la direccion del personaje principal
  switch (direccion) {
    case "u":
      var x = Math.abs(disparo.offset().top);
      var speed = Math.ceil(x/0.5);
      disparo.animate({top : "0px"},speed,function(){$(this).remove();});
      break;
    case "d":
      var x = Math.abs($("#paredAbb").offset().top - disparo.offset().top);
      var speed = Math.ceil(x/0.5);
      disparo.animate({top : "522px"},speed,function(){$(this).remove();});
      break;
    case "l":
      var y = Math.abs(disparo.offset().left);
      var speed = Math.ceil(y/0.5);
      disparo.animate({left : "0px"},speed,function(){$(this).remove();});
      break;
    case "r":
      var y = Math.abs(disparo.offset().left - $("#paredDer").offset().left);
      var speed = Math.ceil(y/0.5);
      disparo.animate({left : "938px"},speed,function(){$(this).remove();});
    break;
  }
}

function cambiarnivel(){
  clearInterval(intervaloTiempo);
  clearInterval(intervaloEnemigos);
  //si se pasa el nivel 3 se gana el juego y pasa a la fase de encontrar a walle
  if(nivel>3){
    $('.enemigo').remove();
    var mensaje=$("<p></p>").text("REUNETE CON WALL-E");
    $("#mensaje").append(mensaje);
    mensaje.animate({fontSize: '4em'},"slow");
    mensaje.queue(function () {
      mensaje.css("color","#80e170");
      mensaje.dequeue();
    });
    mensaje.animate({opacity: '0'},3000,function(){$(this).remove()});
    finJuego(2);
  }else{
    //aparece una notificacion de nuevo nivel
    var mensaje=$("<p></p>").text("LEVEL "+nivel);
    $("#mensaje").append(mensaje);
    mensaje.animate({fontSize: '4em'},"slow");
    mensaje.queue(function () {
      mensaje.css("color","#80e170");
      mensaje.dequeue();
    });
    mensaje.animate({opacity: '0'},"slow",function(){$(this).remove()});
    //actualiza el panel de nivel
    $('#level h1').text("LEVEL "+nivel);
    //se reinician el tiempo y los intervalos
    iTiempo=100;
    intervaloTiempo=setInterval(cuentaAtras,500*nivel);
    intervaloEnemigos=setInterval(crearEnemigos,Math.ceil(10000/nivel));
  }
}

function cuentaAtras(){
  //actualiza la progressbar
  iTiempo--;
  if(iTiempo<0){
    nivel++;
    cambiarnivel();
  }
  $("#progressbar").progressbar({value: iTiempo});
}

function cambiarPuntuacion(){
  //actualiza el panel de puntos
  $('#puntuacion>h2').text("SCORE:");
  $('#puntuacion h2+h2').text(puntos);
}

function quitarVidas(){
  iVidas--;
  if (iVidas<0) {
    //se acaba el juego si teniendo 0 vidas, el personaje es golpeado de nuevo
    finJuego(1);
  }else {
    //aparece una notificacion de menos vidas
    var mensaje=$("<p></p>").text("-1 vida");
    $("#mensaje").append(mensaje);
    mensaje.animate({fontSize: '2.2em'},"slow");
    mensaje.queue(function () {
      mensaje.css("color","#80e170");
      mensaje.dequeue();
    });
    mensaje.animate({opacity: '0'},"slow",function(){$(this).remove()});
    //se actualiza el pane de vidas
    $("div.vida:nth-child("+(iVidas+1)+")").removeClass("llena");
    $("div.vida:nth-child("+(iVidas+1)+")").addClass("gastada");
  }
}

function crearEnemigos(){
  //se crea una capa enemigo
	var enemigo=$("<div class='enemigo'></div>");
  //se inicia en una posicion aleatoria
  var posIni = makeNewPosition();
  enemigo.css({"top":posIni[0],"left":posIni[1]});
	$("#pantalla").append(enemigo);
  setInterval(function(){
    //se mueve aleatoriamente a una velocidad calculada segun posiciones
    var newq = makeNewPosition();
    var oldq = enemigo.offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);
    enemigo.animate({ top: newq[0], left: newq[1] }, speed);
    //detectar colision con los disparos
    $(".disparo").each(function(){
      if(collision($(this),enemigo) > 0){
        var x=enemigo.css("left");
        var y=enemigo.css("top");
        var explosion=$("<img src='images/disparo_enemigo.gif'>");
        explosion.css({
          "width": '50px',
          "position":"absolute",
          "top": y,
          "left": x
        });
        $("#pantalla").append(explosion);
        setTimeout(function(){explosion.remove()},1000);
        $(this).remove();
        enemigo.remove();
        puntos+=50;
        cambiarPuntuacion();
      }
    });
    //detectar colision con personaje principal
    if(collision($('#eve'),enemigo) > 0){
      $("#eve").stop(false,false);
      var x=$("#eve").css("left");
      var y=$("#eve").css("top");
      var explosion=$("<img src='images/eve_enemigo.gif'>");
      explosion.css({
        "width": '50px',
        "position":"absolute",
        "top": y,
        "left": x
      });
      $("#pantalla").append(explosion);
      setTimeout(function(){explosion.remove()},600);
      quitarVidas();
      enemigo.remove();
    }
  },10);
}

function makeNewPosition(){
    // Get viewport dimensions (remove the dimension of the div)
    var h = $( "#pantalla" ).height() - 40;
    var w = $( "#pantalla" ).width() - 40;
    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);
    return [nh,nw];    
}

function calcSpeed(prev, next) {
  //calcula la velocidad en funcion de la posicion anterior, la nueva y el nivel
  var x = Math.abs(prev[1] - next[1]);
  var y = Math.abs(prev[0] - next[0]);
  var greatest = x > y ? x : y;
  var speedModifier = 0.05*nivel;
  var speed = Math.ceil(greatest/speedModifier);
  return speed;
}

function collision(jqDiv1, jqDiv2) {
      var x1 = jqDiv1.offset().left;
      var y1 = jqDiv1.offset().top;
      var h1 = jqDiv1.outerHeight(true);
      var w1 = jqDiv1.outerWidth(true);
      var b1 = y1 + h1;
      var r1 = x1 + w1;
      var x2 = jqDiv2.offset().left;
      var y2 = jqDiv2.offset().top;
      var h2 = jqDiv2.outerHeight(true);
      var w2 = jqDiv2.outerWidth(true);
      var b2 = y2 + h2;
      var r2 = x2 + w2;
        
      if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
      return true;
}

function finJuego(origen){
  $('#eve').css({"top": "45%", "left": "45%"});
  clearInterval(intervaloTiempo);
  clearInterval(intervaloEnemigos);
  $(document).unbind();
  $('.enemigo').remove();
  $("#opener").hide();
  //si se ha superado el nivel 3 pasa la fase donde encuentra a walle
  if(origen==2){
    nivel=1;
    encuentraWalle();
  }else{
    //si no viene desde START AGAIN saldra un mensaje y un evento teclado para reiniciar
    if(origen!=0){
      $(document).keydown(function(tecla){
        if(tecla.keyCode==13){
          $("#dialog-inicial").dialog("open");
          $( "#titulo" ).hide( "drop", 1000 );
        }
      });
      //si se han perdido todas las vidas
      if(origen==1)
        $("#titulo h1").text("HAS PERDIDO");
      else{
        //si se ha encontrado a walle
        $("#titulo h1").text("¡HAS GANADO!");
        clearInterval(intervaloWalle);
        $('#walle').remove();
      }
      $("#titulo").show( "fold", 1000);
    }
  }
}

function encuentraWalle(){
  //inicia la fase de encontrar a walle
  $('#eve').css({"top": "45%", "left": "20%"});
  var walle=$('<div id="walle"></div>');
  //eve no puede moverse por teclado, ahora es dragable
  $("#eve").draggable({cursor: "pointer"});
  //walle entra y se anima
  $("#pantalla").prepend(walle);
  intervaloWalle=setInterval(function(){
    var newq = makeNewPosition();
    var oldq = walle.offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);
    walle.animate({ top: newq[0], left: newq[1] }, speed);
  },500);
  //walle es droppable y solo acepta a eve
  //cambia de clases
  $("#walle").droppable({
      accept: "#eve",
      classes: {
        "ui-droppable": "walle",
        "ui-droppable-active": "dropwalle"
      },
      drop: function() {
          finJuego(3);
      }
    });
}