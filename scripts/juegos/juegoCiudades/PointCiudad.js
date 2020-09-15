class PointCiudad extends ObjetoDibujable {
    
    constructor(tipo, pX, pY){
        super();
        this.imagen = new Image();
        this.posX = pX;
        this.posY = pY;
        this.imagen.src = `images/juegos/punto${tipo}.png`;
    }
    dibujar(ctx){
        ctx.drawImage(this.imagen, this.posX, this.posY);        
    }
}