$(document).ready(function() {

    $(window).resize(()=> {
        this.juego.adaptarMensajes();        
    });

    this.finalizarJuego = function(){        
        let data = this.juego.terminar();
        data.canvas = mensajes.canvas;
        puntajeTotal += data.puntaje;
        data.puntajeTotal = puntajeTotal;
        this.juego = null;
        //console.log(data);
        this.resultados = new Resultados(this, data);
        
    }

    this.continuar = function(){
        this.resultados = null;
        this.juego = this.seleccionarJuego(indexJuego);
        this.juego.iniciar(); 
        indexJuego++;
    }

    this.seleccionarJuego = (ind) => {
        if (ind == 0) return new JuegoBanderas(this, mensajes);
        else if(ind == 1) return new JuegoPaises(this, mensajes);
        else if(ind == 2) return new JuegoCiudades(this, mensajes);
        else if(ind == 3) return new JuegoLugares(this, mensajes);
        //else if(ind = 3) return new JuegoCiudades(this, mensajes);
    }


    let mensajes = {
        canvas: $('#canvas'),
        correcto: $('#correcto'),
        incorrecto: $('#incorrecto'),
        num1: $('#num1'),
        num2: $('#num2'),
        num3: $('#num3'),
        go: $('#go'),
        tiempoMuerto: $('#tiempoMuerto'),        
        bonusTiempo: $('#bonusTiempo'),
        bonusPuntaje: $('#bonusPuntaje'),
        textoBonus: $("#textoBonus"),
        pointerClick: $("#pointerClick"),
        pointerCorrecto: $("#pointerCorrecto")
    }

    //INICIO del juego

    var puntajeTotal = 0;
    var indexJuego = 0;

    this.juego = this.seleccionarJuego(indexJuego);
    this.juego.iniciar();
    indexJuego++;
    

    
});

function crearImagen(src){
    image = new Image();
    image.src = src;
    return image;
}
