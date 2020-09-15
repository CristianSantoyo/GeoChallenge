class Enunciado extends ObjetoDibujable {
    texto;
    txtPosX;
    txtPosY;
    valor;

    constructor(x,y, txt, tx, ty){
        super();
        this.posX = x;
        this.posY = y;        
        this.texto = txt;
        this.txtPosX = tx;
        this.txtPosY = ty;
    }

    setEnunciado(texto, val, img){
        this.texto = texto;
        this.valor = val;
        this.imagen = img;
    }

    dibujar(ctx){
			
        ctx.textAlign = "center";        
        if (this.imagen) ctx.drawImage(this.imagen, this.posX, this.posY);
        ctx.fillText(this.texto, this.txtPosX, this.txtPosY);
        
        //console.log(ctx);
    }
}