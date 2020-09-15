class Juego {
    presicion = [];
    hardcore = false;
    inicio = false;
    constructor(orquestador, domMensajes){
        this.orquestador = orquestador;

        this.canvas = domMensajes.canvas;
        this.menCorrecto = domMensajes.correcto;
        this.menIncorrecto = domMensajes.incorrecto;
        this.num1 = domMensajes.num1;
        this.num2 = domMensajes.num2;
        this.num3 = domMensajes.num3;
        this.go = domMensajes.go;
        this.tiempoMuerto = domMensajes.tiempoMuerto;
        this.bonusTiempo = domMensajes.bonusTiempo;
        this.bonusPuntaje = domMensajes.bonusPuntaje;
        this.textoBonus = domMensajes.textoBonus;
    }

    iniciar(){}
    formularPregunta(){}
    
    cargarSonidos(){
        this.sonidoAnuncio = new Audio("sounds/juego/ding.mp3");

        //this.sonidoIncorrecto = new Audio("sounds/juego/erro.mp3");

        this.sonidoFondo = new Audio("sounds/juego/xpRemix.mp3");
        this.sonidoCorrecto = new Audio("sounds/juego/chimes.mp3");
        this.sonidoIncorrecto = new Audio("sounds/juego/erro.mp3");
    }

    cargarImagenes(srcImgF){
        this.imagenFondo = crearImagen(srcImgF);
        this.imagenRelog = crearImagen("images/juegos/relog00.png");
        this.imgMarcoTiempo = crearImagen("images/juegos/marcoTiempo.png");
        this.imgTiempoBarra = crearImagen("images/juegos/tiempoBarra.png");
        this.imgMarcoPuntaje = crearImagen("images/juegos/marcoPuntaje.png");        

        this.adaptarMensajes();        
    }

    cuentaRegresiva = () => {       
        //console.log(this.num3);
        this.sonidoAnuncio.currentTime = 0;        
        if(this.cr == 3){
            this.num3.show("scale", 700);
            this.num3.hide("scale", 300);
        } else if(this.cr == 2){
            this.num2.show("scale", 700);
            this.num2.hide("clip", 300);
        } else if(this.cr == 1){
            this.num1.show("clip", 700);
            this.num1.hide("puff", 300);
        } else {
            this.go.show("puff", 700);
            this.go.hide("explode", 300);
            this.sonidoAnuncio.src = "sounds/juego/dingAmpliado.mp3";
            clearInterval(this.hiloCuentaRegresiva);
        }
        this.sonidoAnuncio.play();
        this.cr--;
    }

    reducirTiempo = () => {
        this.tiempo--;
        if(this.tiempo == -1){
            this.terminarJuego();
        }
    }
    reducirTiempoPregunta = ()=>{
        this.tiempoPregunta--;        
        if (this.tiempoPregunta == 0){
            this.incorrecto();
            this.presicion.push(2);
            this.formularPregunta();
        }
    }

    correcto(){}
    incorrecto(){}
    dibujarEntorno = () =>{}

    

    adaptarMensajes(){
        
        let canvasLeft = this.canvas.offset().left;
        let canvasTop = this.canvas.offset().top;      
        
        this.menCorrecto[0].style.cssText = `top: ${canvasTop+225}px; left: ${canvasLeft+225}px;`;
        this.menIncorrecto[0].style.cssText = `top: ${canvasTop+225}px; left: ${canvasLeft+225}px;`;
        this.num1[0].style.cssText = `top: ${canvasTop+225}px; left: ${canvasLeft+225}px;`;
        this.num2[0].style.cssText = `top: ${canvasTop+225}px; left: ${canvasLeft+225}px;`;
        this.num3[0].style.cssText = `top: ${canvasTop+225}px; left: ${canvasLeft+225}px;`;
        this.go[0].style.cssText = `top: ${canvasTop+225}px; left: ${canvasLeft+225}px;`;
        this.tiempoMuerto[0].style.cssText = `top: ${canvasTop+225}px; left: ${canvasLeft+225}px;`;
        this.bonusTiempo[0].style.cssText = `top: ${canvasTop+60}px; left: ${canvasLeft+530}px;`;
        this.bonusPuntaje[0].style.cssText = `top: ${canvasTop+620}px; left: ${canvasLeft+108}px;`;        
    }

    ganarTiempo(){
        this.npcbt++;
        switch(this.npcbt){
            case 1:
                this.imagenRelog.src = "images/juegos/relog01.png"
                break;
            case 2:
                this.imagenRelog.src = "images/juegos/relog02.png"
                break;
            case 3:
                this.imagenRelog.src = "images/juegos/relog03.png"
                break;
            case 4:
                this.imagenRelog.src = "images/juegos/relog04.png"
                break;
            case 5:
                this.imagenRelog.src = "images/juegos/relog05.png"
                break;
            case 6:
                this.imagenRelog.src = "images/juegos/relog06.png"
                break;
            case 7:
                this.imagenRelog.src = "images/juegos/relog07.png"
                break;
            case 8:
                this.imagenRelog.src = "images/juegos/relog08.png"
                break;
            case 9:
                this.imagenRelog.src = "images/juegos/relog09.png"
                break;
            case 10:
                this.npcbt = 0;
                this.imagenRelog.src = "images/juegos/relog00.png"
                this.tiempo += 5;
                this.bonusTiempo.show("drop", 800);
                this.bonusTiempo.hide("scale", 200);
                break;
        }
    }

    terminarJuego(){
        this.sonidoFondo.pause();
        this.sonidoCorrecto.pause();
        this.sonidoIncorrecto.pause();        
        this.sonidoAnuncio.src = "sounds/juego/batteryCritical.mp3";        
        
        clearInterval(this.hiloDibujar);
        clearInterval(this.hiloTiempo);
        clearInterval(this.hiloPregunta);
        this.canvas[0].removeEventListener("mousemove", this.controlador.mouseMove, false);
        this.canvas[0].removeEventListener("mousedown", this.controlador.mouseDown, false);
        
        document.body.style.cursor = 'auto';
        this.tiempoMuerto.show("explode", 1000);
        this.sonidoAnuncio.play()
        setTimeout(()=> {            
            this.tiempoMuerto.hide("scale", 300);
            this.canvas.hide("fade", 900);
        }, 2000);
        setTimeout(()=>{                        
            this.orquestador.finalizarJuego();
        }, 3000);        
    }

    terminar(){  
        return {
            puntaje: this.puntaje,
            presicion: this.presicion
        };
    }
}