class Banderas extends Opcion {
    activo = false;
    valor = "";
    
    setPais(pais){
        this.activo = true;
        this.valor = pais.nombre;
        this.imagen = pais.img;
    }
    
    dibujar(ctx){
        !this.cursorPasando ? 
        ctx.drawImage(this.imagen, this.posX, this.posY)
        : ctx.drawImage(this.imagen, this.posX-5, this.posY-3, this.sizePasandoX, this.sizePasandoY);       
    }
}