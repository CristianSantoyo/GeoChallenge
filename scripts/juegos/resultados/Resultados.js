function Resultados(orquestador, data){
    this.orquestador = orquestador;
    //Se obtiene la data e información de lo que se va amostrar
    this.puntaje = data.puntaje;
    this.puntajeTotal = data.puntajeTotal;
    this.presicion = data.presicion;
    this.canvas = data.canvas;
    
    //Se organiza la información concerniente a la presición
    this.correctas = [];
    this.incorrectas = [];
    this.tiempoMuerto = [];
    
    this.presicion.forEach(element => {
        if(element == 0){
            this.correctas.push(element);
        } else if(element == 1){
            this.incorrectas.push(element);
        } else {
            this.tiempoMuerto.push(element);
        }
    });
    // Variables de ayuda
    var num = 0;
    var numA = 0;
    var numB = 0;
    var numC = 0;    
    var mensaje = "";
    if(this.puntaje < 5000){
        mensaje = "Hay que salir a ver el mundo. Te servirá ( ͡ಠ ʖ̯ ͡ಠ)"
    } else if(this.puntaje < 10000){
        mensaje = "Podrias mejorar ( ͡° ʖ̯ ͡°)"
    } else if(this.puntaje < 15500){
        mensaje = "No esta mal ヽ(ヅ)ノ";
    } else if(this.puntaje < 23000){
        mensaje = "Buen trabajo ( ͡^ ͜ʖ ͡^)";
    } else if(this.puntaje < 30000){
        mensaje = "Muy buen trabajo ᕙ(⇀‸↼‶)ᕗ";
    } else {
        mensaje = "¡¡Impresionante!! ༼⁰o⁰；༽";
    }

    
    const tamCorrectas = this.correctas.length;
    const tamIncorrectas = this.incorrectas.length;
    const tamTiempoMuerto = this.tiempoMuerto.length;
    const limite = Math.max(tamCorrectas, tamIncorrectas, tamTiempoMuerto);
    // Para controlar el "paso" o el espacio entre iconitos cuando se dibujen
    (tamCorrectas*40) > 400 ? this.pasoA = 400/tamCorrectas : this.pasoA = 40;
    (tamIncorrectas*40) > 400 ? this.pasoB = 400/tamIncorrectas : this.pasoB = 40;
    (tamTiempoMuerto*40) > 400 ? this.pasoC = 400/tamTiempoMuerto : this.pasoC = 40;
    //Se generan las imagenes
    var imgFondo = crearImagen("images/resultados/fondo.png");
    var imgBton = crearImagen("images/resultados/btnContinuar.png");
    var imgCorrecta = crearImagen("images/resultados/correcto.png");
    var imgIncorrecta = crearImagen("images/resultados/incorrecto.png");
    var imgTiempoMuerto = crearImagen("images/resultados/tiempoMuerto.png");
    //Generar los sonidos
    var sonidoFondo = new Audio("sounds/resultados/cutWindowsXpInstallation.mp3");
    let sonidoBtn = new Audio("sounds/resultados/informationBar.mp3");
    var sonidoIconos = new Audio("sounds/resultados/balloon.mp3");

    //Se espera un tiempo para iniciar la multimedia
    setTimeout(() => {
        //Efecto para ver el canvas
        this.canvas.show("fade", 900);
        sonidoFondo.play();
        //Hilos y eventos
        this.hiloNum = setInterval(() => {
            
            sonidoIconos.currentTime = 0;
            sonidoIconos.play();
            if (num <= tamCorrectas) numA = num;
            if (num <= tamIncorrectas) numB = num;
            if (num <= tamTiempoMuerto) numC = num;
            if (num == limite) clearInterval(this.hiloNum);
            num++
        }, 500);

        this.hiloDibujar = setInterval(() => {
            this.dibujar();
        }, 25);

    }, 2000);
       

    this.mouseMove = (event)=>{
        const x = event.offsetX;
        const y = event.offsetY;
        if (x >= 500
            && x <= 600
            && y >= 520
            && y <= 590){                
                imgBton.src = "images/resultados/btnContinuarOscuro.png";
                document.body.style.cursor = 'pointer';    
                sonidoBtn.currentTime = 0;
                sonidoBtn.play();          
            } else {                
                imgBton.src = "images/resultados/btnContinuar.png";
                document.body.style.cursor = 'auto';
            }
    }

    this.mouseDown = (event)=>{
        const x = event.offsetX;
        const y = event.offsetY;
        if (x >= 500
            && x <= 600
            && y >= 520
            && y <= 590){
                sonidoFondo.pause();
                sonidoBtn.pause();
                sonidoIconos.pause();

                clearInterval(this.hiloNum);
                clearInterval(this.hiloDibujar);
                this.canvas[0].removeEventListener("mousemove",this.mouseMove, false);
                this.canvas[0].removeEventListener("mousedown",this.mouseDown, false);                
                this.canvas.hide("fade", 900);
                document.body.style.cursor = 'auto';
                setTimeout(()=> {
                    this.orquestador.continuar();
                }, 1000);
                
            }
    }
    this.canvas[0].addEventListener('mousemove', this.mouseMove, false);
    this.canvas[0].addEventListener('mousedown', this.mouseDown, false);


    this.dibujar = function(){
        var contexto = this.canvas[0].getContext("2d");
        var buffer = document.createElement("canvas");
        buffer.width = this.canvas[0].width;
        buffer.height = this.canvas[0].height;
        //Configurar buffer
        var contextoBuffer = buffer.getContext("2d");	
        contextoBuffer.clearRect(0,0,buffer.width,buffer.height);
        contextoBuffer.fillStyle = "White";
        contextoBuffer.font = "bold 28px superCell";
        //Dibujar        
        contextoBuffer.drawImage(imgFondo, 0, 0);
        contextoBuffer.drawImage(imgBton, 500, 520);

        contextoBuffer.fillText(`Puntaje del juego: ${this.puntaje} `, 70, 550);
        contextoBuffer.fillText(`Puntaje Total: ${this.puntajeTotal} `, 70, 600);

        //Escribir los número de los valores relacionados a la precision (aciertos, errores y tiempo muerto)
        contextoBuffer.fillText(numA, 560, 183);
        contextoBuffer.fillText(numB, 560, 260);
        contextoBuffer.fillText(numC, 560, 337);

        contextoBuffer.textAlign = "center";        
        contextoBuffer.fillStyle = "rgb(248, 212, 6)";
        contextoBuffer.font = "bold 20px superCell";
        contextoBuffer.fillText(mensaje, 350, 90);        

        for (var i = 0; i < num; i++){
            if (i < tamCorrectas) contextoBuffer.drawImage(imgCorrecta, 100+(i*this.pasoA), 155); // Condicionales para que no dibuje más de lo necesario
            if (i < tamIncorrectas) contextoBuffer.drawImage(imgIncorrecta, 100+(i*this.pasoB), 230);
            if (i < tamTiempoMuerto) contextoBuffer.drawImage(imgTiempoMuerto, 100+(i*this.pasoC), 305);
        }
        // Modificar Buffer
        contexto.clearRect(0,0,this.canvas[0].width, this.canvas[0].height);
	    contexto.drawImage(buffer,0,0);	
    }
    
}
