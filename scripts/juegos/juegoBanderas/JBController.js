class JBController {
    juego;
    constructor(juego){
        this.juego = juego;
    }

    mouseMove = (event) => {
        const x = event.offsetX;
        const y = event.offsetY;
        for (var i = 0; i < this.juego.opcPosibles; i++){
            if (x >= this.juego.banderas[i].posX 
                && x <= this.juego.banderas[i].posX + 120
                && y >= this.juego.banderas[i].posY
                && y <= this.juego.banderas[i].posY + 80){
                    this.juego.banderas[i].cursorPasando = true;
                    document.body.style.cursor = 'pointer';
                    break;
                } else {
                    this.juego.banderas[i].cursorPasando = false;
                    document.body.style.cursor = 'auto';
                }
        }
    }

    mouseDown = (event) => {
        const x = event.offsetX;
        const y = event.offsetY;        
        for (var i = 0; i < this.juego.opcPosibles; i++){
            if (x >= this.juego.banderas[i].posX 
                && x <= this.juego.banderas[i].posX + 120
                && y >= this.juego.banderas[i].posY
                && y <= this.juego.banderas[i].posY + 80){                    
                    this.juego.seleccionarOpcion(this.juego.banderas[i]);
                    break;
                }
                
        }
    }
}