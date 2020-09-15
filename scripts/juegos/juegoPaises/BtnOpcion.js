class BtnOpcion extends Opcion {
    
    texto = "";

    constructor(spX, spY){
        super(spX, spY);
        this.imagen = new Image();
        this.imagen.src = "images/juegos/btnOpcion.png";
    }

    setPais(pais){
        this.texto = pais.nombre;        
    }
    
    dibujar(ctx){

        if (this.cursorPasando){
            ctx.fillStyle = "rgb(187, 161, 40)"
            this.imagen.src = "images/juegos/btnOpcionOscuro.png"
        } else {
            ctx.fillStyle = "rgb(90, 79, 19)"
            this.imagen.src = "images/juegos/btnOpcion.png";
        }
        ctx.drawImage(this.imagen, this.posX, this.posY);
        ctx.fillText(this.texto, this.posX+131, this.posY+50);
    }
}