class JCController {
    juego;
    constructor(juego){
        this.juego = juego;
    }
    mouseDown = (event) => {
        const x = event.offsetX;
        const y = event.offsetY;
        
        this.juego.marcarPunto(x,y);       
    }
}