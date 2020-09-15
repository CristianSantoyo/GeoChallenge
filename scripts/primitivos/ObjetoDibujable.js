class ObjetoDibujable {
    imagen;
    posX;
    posY;

    //constructor(){}

    getImagen(){
        return this.imagen;
    }
    setImagen(img){
        this.imagen = img;
    }
    getCoordenadas(){
        return {
            x: this.posX,
            y: this.posY
        }
    }
    setCoordenadas(x, y){
        this.posX = x;
        this.posY = y;
    }
    getPosX(){
        return this.posX;
    }
    getPosY(){
        return this.posY;
    }
    setPosX(x){
        this.posX = x;
    }
    setPosY(y){
        this.posY = y;
    }

    dibujar(ctx){}
}