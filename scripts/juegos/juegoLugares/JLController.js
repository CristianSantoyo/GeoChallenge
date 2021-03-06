class JLController {
    juego;
    constructor(juego){
        this.juego = juego;
    }

    mouseMove = (event) => {
        
        const x = event.offsetX;
        const y = event.offsetY;
        
        for (var i = 0; i < this.juego.opcPosibles; i++){
            if (x >= this.juego.btnOpciones[i].posX 
                && x <= this.juego.btnOpciones[i].posX + 280
                && y >= this.juego.btnOpciones[i].posY
                && y <= this.juego.btnOpciones[i].posY + 43){
                    this.juego.btnOpciones[i].cursorPasando = true;
                    document.body.style.cursor = 'pointer';
                    break;
                } else {
                    this.juego.btnOpciones[i].cursorPasando = false;
                    document.body.style.cursor = 'auto';
                }
        }
    }

    mouseDown = (event) => {
        const x = event.offsetX;
        const y = event.offsetY;        
        for (var i = 0; i < this.juego.opcPosibles; i++){
            if (x >= this.juego.btnOpciones[i].posX 
                && x <= this.juego.btnOpciones[i].posX + 280
                && y >= this.juego.btnOpciones[i].posY
                && y <= this.juego.btnOpciones[i].posY + 43){                    
                    this.juego.seleccionarOpcion(this.juego.btnOpciones[i]);
                    break;
                }
                
        }
    }
}