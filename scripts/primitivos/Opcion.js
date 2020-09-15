class Opcion extends ObjetoDibujable {
    cursorPasando = false;    
    sizePasandoX;
    sizePasandoY;

    constructor(sx, sy){
        super();
        this.sizePasandoX = sx;
        this.sizePasandoY = sy;
    }

    isCursorPasando(){
        return this.cursorPasando;
    }
    setCursorPasando(b){
        this.cursorPasando = b;
    }
    /*dibujar(ctx){       
        
        if(this.cursorPasando){
            ctx.drawImage(this.imagen, this.posX-5, this.posY-5, this.sizePasandoX, this.sizePasandoY);
        } else {
            ctx.drawImage(this.img, this.posX, this.posY);
        }
    }*/
}