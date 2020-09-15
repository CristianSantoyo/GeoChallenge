class JuegoCiudades extends Juego {
    

    constructor(orquestador,domMensajes){
        super(orquestador, domMensajes);
        this.pointerClick = domMensajes.pointerClick;
        this.pointerCorrecto = domMensajes.pointerCorrecto;
        this.pointClick = new PointCiudad("Amarillo");
        this.pointCorrecto = new PointCiudad("Verde");
        this.pointsCorrectos = [];        
        this.controlador = new JCController(this);
        this.enunciado = new Enunciado(199,0, "Bogotá", 350, 102);
    }
    
    iniciar() {
        this.canvas.show("fade", 900);

        this.cargarSonidos();
        this.cargarImagenes("images/juegos/fondoCiudades.png");
        this.nivel = 1;
        this.tiempo = 60;
        this.puntosCorrectos = [];
        //this.opcPosibles = 4;
        this.rango = 40;
        this.puntaje = 0;
        this.npcbt = 0; // Numero de preguntas correctas para bonus de tiempo        
        this.cr = 3; // Cuenta regresiva

        this.hiloDibujar = setInterval(this.dibujarEntorno, 10);        
        this.hiloCuentaRegresiva = setInterval(this.cuentaRegresiva, 1000);        

        setTimeout(()=>{
            this.formularPregunta();
            this.sonidoFondo.play();
            this.hiloTiempo = setInterval(this.reducirTiempo, 1000);
            this.hiloPregunta = setInterval(this.reducirTiempoPregunta, 10);
            this.inicio = true;
            //this.canvas[0].addEventListener("mousemove", this.controlador.mouseMove, false);
            this.canvas[0].addEventListener("mousedown", this.controlador.mouseDown, false);
        }, 5000);
    }

    formularPregunta(){
        this.cambiarDificultad();        
        this.n = Math.floor((Math.random() * this.rango));
        while(this.puntosCorrectos.includes(this.n)) this.n = Math.floor((Math.random() * this.rango));
        var pregunta = this.ciudades[this.n];
        this.enunciado.setEnunciado(pregunta.nombre, pregunta.coordenadas, null);        
        this.tiempoPregunta = 450;

        this.pointClick.setCoordenadas(0,0);
        this.pointCorrecto.setCoordenadas(0,0);
    }
    
    marcarPunto(x, y){
        let canvasLeft = this.canvas.offset().left;
        let canvasTop = this.canvas.offset().top;       
        this.pointerClick[0].style.cssText = `top: ${canvasTop+y-26}px; left: ${canvasLeft+x-3}px;`;
        this.pointerClick.show("puff", 500);
        this.pointClick.setCoordenadas(x-3,y-3);

        let cCX = this.enunciado.valor.x//Coordenadas correctas en X
        let cCY = this.enunciado.valor.y//Coordenadas correctas en Y
        this.pointerCorrecto[0].style.cssText = `top: ${canvasTop+cCY-26}px; left: ${canvasLeft+cCX-17}px;`;
        this.pointerCorrecto.show("bounce", 700);
        this.pointCorrecto.setCoordenadas(cCX-3,cCY-3);

        
        setTimeout(()=>{
            this.pointerClick.hide("explode", 200);
            this.pointerCorrecto.hide("explode", 200);

            
            if (Math.abs(cCX - x) <= 9 && Math.abs(cCY - y) <= 9){
                this.correcto();
                this.presicion.push(0);
                this.puntosCorrectos.push(this.n);
                this.pointsCorrectos.push(new PointCiudad("Azul", cCX - 2, cCY - 2));
            } else {
                this.incorrecto();
                this.presicion.push(1);
            }
            this.formularPregunta();
        }, 500);
    }

    correcto(){
        this.sonidoCorrecto.currentTime = 0;
        this.menCorrecto.show("scale", 500);
        this.menCorrecto.hide("scale", 100);
        this.sonidoCorrecto.play();
        this.nivel++;
        this.ganarTiempo();
        this.puntaje += 1000;
        const bonus = parseInt(this.tiempoPregunta);
        this.puntaje += bonus;

        this.textoBonus.text("+" + bonus);
        this.bonusPuntaje.show("puff", 1000);
        this.bonusPuntaje.hide("scale", 100);
    }

    incorrecto(){
        this.sonidoIncorrecto.currentTime = 0;
        this.menIncorrecto.show("scale", 500);
        this.menIncorrecto.hide("scale", 100);
        this.sonidoIncorrecto.play();
    }

    cambiarDificultad(){
        switch(this.nivel){
            case 3:                
                this.rango = 70;
                break;           
            case 6:                
                this.rango = 100;
                break;
            case 10:                
                this.rango = 130;
                break;
            case 15:                
                this.rango = 160;
                break;
            case 17:                
                this.rango = this.ciudades.length;
                break;
        }
    }

    dibujarEntorno = ()=> {
        var contexto = this.canvas[0].getContext("2d");
        var buffer = document.createElement("canvas");
        buffer.width = this.canvas[0].width;
        buffer.height = this.canvas[0].height;
        //Configurar buffer
        var contextoBuffer = buffer.getContext("2d");	
        contextoBuffer.clearRect(0,0,buffer.width,buffer.height);
        contextoBuffer.fillStyle = "White";
        contextoBuffer.font = "bold 19px superCell";
        //Dibujo
        contextoBuffer.drawImage(this.imagenFondo, 0, 0);
        contextoBuffer.drawImage(this.imagenRelog, 580, 10);
        contextoBuffer.drawImage(this.imgMarcoPuntaje, 100, 650);
        
        contextoBuffer.font = "bold 18px superCell";
        contextoBuffer.textAlign = "center";
        
        if (this.inicio){
            contextoBuffer.drawImage(this.imgTiempoBarra, 128, 618, this.tiempoPregunta, 20);
            contextoBuffer.drawImage(this.imgMarcoTiempo, 120, 610);
            
            this.enunciado.dibujar(contextoBuffer);
            this.pointClick.dibujar(contextoBuffer);
            this.pointCorrecto.dibujar(contextoBuffer);
            
            this.pointsCorrectos.forEach(element => {
                element.dibujar(contextoBuffer);
            })
        }
        

        contextoBuffer.font = "bold 30px superCell";
        contextoBuffer.fillText(this.puntaje, 250, 690);

        contextoBuffer.textAlign = "left";
        contextoBuffer.fillText(this.tiempo, 625, 40);
        // Modificar Buffer
        contexto.clearRect(0,0,this.canvas[0].width, this.canvas[0].height);
	    contexto.drawImage(buffer,0,0);	
    }

    ciudades = [
        {
            nombre: "Tokio",
            coordenadas: { x: 595, y: 337}
        },
        {
            nombre: "Nueva York",
            coordenadas: { x: 187, y: 325}
        },
        {
            nombre: "Los Ángeles",
            coordenadas: { x: 106, y: 341}
        },
        {
            nombre: "Bogotá",
            coordenadas: { x: 188, y: 402}
        },
        {
            nombre: "Medellín",
            coordenadas: { x: 185, y: 400}
        },
        {
            nombre: "Cali",
            coordenadas: { x: 183, y: 404}
        },
        {
            nombre: "Buenos Aires",
            coordenadas: { x: 216, y: 481}
        },
        {
            nombre: "Montevideo",
            coordenadas: { x: 222, y: 477}
        },
        {
            nombre: "Río de Janeiro",
            coordenadas: { x: 245, y: 454}
        },
        {
            nombre: "Asunción",
            coordenadas: { x: 218, y: 459}
        },
        {
            nombre: "La Paz",
            coordenadas: { x: 200, y: 441}
        },
        {
            nombre: "Quito",
            coordenadas: { x: 179, y: 411}
        },
        {
            nombre: "Ciudad de México",
            coordenadas: { x: 136, y: 370}
        },
        {
            nombre: "Ciudad de Panamá",
            coordenadas: { x: 178, y: 392}
        },
        {
            nombre: "Caracas",
            coordenadas: { x: 198, y: 389}
        },
        {
            nombre: "Brasilia",
            coordenadas: { x: 239, y: 442}
        },
        {
            nombre: "Lisboa",
            coordenadas: { x: 312, y: 331}
        },
        {
            nombre: "Seúl",
            coordenadas: { x: 570, y: 336}
        },
        {
            nombre: "Londres",
            coordenadas: { x: 327, y: 298}
        },
        {
            nombre: "París",
            coordenadas: { x: 335, y: 308}
        },
        {
            nombre: "Osaka",
            coordenadas: { x: 586, y: 339}
        },
        {
            nombre: "Santiago de Chile",
            coordenadas: { x: 192, y: 477}
        },
        {
            nombre: "Shanghái",
            coordenadas: { x: 557, y: 347}
        },
        {
            nombre: "Chicago",
            coordenadas: { x: 159, y: 324}
        },
        {
            nombre: "Copenhague",
            coordenadas: { x: 352, y: 288}
        },
        {
            nombre: "Moscú",
            coordenadas: { x: 405, y: 286}
        },
        {
            nombre: "Pekín",
            coordenadas: { x: 546, y: 330}
        },
        {
            nombre: "Lima",
            coordenadas: { x: 183, y: 435}
        },
        {
            nombre: "El Cairo",
            coordenadas: { x: 387, y: 352}
        },
        {
            nombre: "Houston",
            coordenadas: { x: 148, y: 345}
        },
        {
            nombre: "Washington",
            coordenadas: { x: 180, y: 331}
        },
        {
            nombre: "Oslo",
            coordenadas: { x: 349, y: 277}
        },
        {
            nombre: "São Paulo",
            coordenadas: { x: 236, y: 454}
        },
        {
            nombre: "Hong Kong",
            coordenadas: { x: 544, y: 363}
        },
        {
            nombre: "Fortaleza",
            coordenadas: { x: 253, y: 417}
        },
        {
            nombre: "Dallas",
            coordenadas: { x: 144, y: 342}
        },
        {
            nombre: "Florencia",
            coordenadas: { x: 350, y: 318}
        },
        {
            nombre: "Cantón",
            coordenadas: { x: 542, y: 361}
        },
        {
            nombre: "Tianjin",
            coordenadas: { x: 549, y: 331}
        },
        {
            nombre: "Singapur",
            coordenadas: { x: 524, y: 406}
        },
        {
            nombre: "Berlín",
            coordenadas: { x: 351, y: 298}
        },
        {
            nombre: "Nagoya",
            coordenadas: { x: 587, y: 340}
        },
        {
            nombre: "Sevilla",
            coordenadas: { x: 317, y: 332}
        },
        {
            nombre: "Boston",
            coordenadas: { x: 190, y: 322}
        },
        {
            nombre: "Estambul",
            coordenadas: { x: 380, y: 326}
        },
        {
            nombre: "Valparaíso - Viña del Mar",
            coordenadas: { x: 190, y: 476}
        },
        {
            nombre: "Suzhou",
            coordenadas: { x: 548, y: 342}
        },
        {
            nombre: "San Francisco",
            coordenadas: { x: 98, y: 335}
        },
        {
            nombre: "Taipéi",
            coordenadas: { x: 558, y: 360}
        },
        {
            nombre: "Yakarta",
            coordenadas: { x: 529, y: 421}
        },
        {
            nombre: "Ámsterdam",
            coordenadas: { x: 341, y: 297}
        },
        {
            nombre: "Sofía",
            coordenadas: { x: 374, y: 322}
        },
        {
            nombre: "Porto",
            coordenadas: { x: 313, y: 329}
        },
        {
            nombre: "San Juan",
            coordenadas: { x: 203, y: 373}
        },
        {
            nombre: "Valencia",
            coordenadas: { x: 327, y: 329}
        },
        {
            nombre: "Milán",
            coordenadas: { x: 347, y: 315}
        },
        {
            nombre: "Bangkok",
            coordenadas: { x: 518, y: 381}
        },
        {
            nombre: "Busan",
            coordenadas: { x: 574, y: 338}
        },
        {
            nombre: "Atlanta",
            coordenadas: { x: 167, y: 342}
        },
        {
            nombre: "Delhi",
            coordenadas: { x: 476, y: 353}
        },
        {
            nombre: "Toronto",
            coordenadas: { x: 176, y: 319}
        },
        {
            nombre: "Seattle",
            coordenadas: { x: 94, y: 312}
        },
        {
            nombre: "Miami",
            coordenadas: { x: 175, y: 359}
        },
        {
            nombre: "Madrid",
            coordenadas: { x: 322, y: 328}
        },
        {
            nombre: "Bruselas",
            coordenadas: { x: 338, y: 301}
        },
        {
            nombre: "Cartagena",
            coordenadas: { x: 185, y: 391}
        },
        {
            nombre: "Wuhan",
            coordenadas: { x: 544, y: 351}
        },
        {
            nombre: "Frankfurt",
            coordenadas: { x: 346, y: 303}
        },
        {
            nombre: "Sídney",
            coordenadas: { x: 613, y: 479}
        },
        {
            nombre: "Múnich",
            coordenadas: { x: 350, y: 306}
        },
        {
            nombre: "Hangzhou",
            coordenadas: { x: 553, y: 348}
        },
        {
            nombre: "Roma",
            coordenadas: { x: 353, y: 324}
        },
        {
            nombre: "Minneapolis",
            coordenadas: { x: 150, y: 315}
        },        
        {
            nombre: "Guayaquil",
            coordenadas: { x: 176, y: 414}
        },
        {
            nombre: "Phoenix",
            coordenadas: { x: 110, y: 339}
        },
        {
            nombre: "Arequipa",
            coordenadas: { x: 191, y: 440}
        },
        {
            nombre: "San Diego",
            coordenadas: { x: 105, y: 342}
        },
        {
            nombre: "Dalian",
            coordenadas: { x: 561, y: 327}
        },
        {
            nombre: "Fukuoka",
            coordenadas: { x: 576, y: 343}
        },
        {
            nombre: "León",
            coordenadas: { x: 133, y: 365}
        },        
        {
            nombre: "Ciudad Juárez",
            coordenadas: { x: 126, y: 349}
        },
        {
            nombre: "Viena",
            coordenadas: { x: 359, y: 309}
        },
        {
            nombre: "Manila",
            coordenadas: { x: 556, y: 380}
        },
        {
            nombre: "Tijuana",
            coordenadas: { x: 106, y: 344}
        },
        {
            nombre: "Melbourne",
            coordenadas: { x: 603, y: 485}
        },
        {
            nombre: "Abu Dhabi",
            coordenadas: { x: 430, y: 364}
        },        
        {
            nombre: "Kuala Lumpur",
            coordenadas: { x: 519, y: 402}
        },        
        {
            nombre: "Barcelona",
            coordenadas: { x: 330, y: 326}
        },
        {
            nombre: "Denver",
            coordenadas: { x: 127, y: 328}
        },
        {
            nombre: "Kuwait",
            coordenadas: { x: 420, y: 351}
        },
        {
            nombre: "Riad",
            coordenadas: { x: 418, y: 364}
        },       
        {
            nombre: "Hamburgo",
            coordenadas: { x: 348, y: 297}
        },
        {
            nombre: "Jeddah",
            coordenadas: { x: 405, y: 370}
        },
        {
            nombre: "San José",
            coordenadas: { x: 168, y: 391}
        },
        {
            nombre: "Portland",
            coordenadas: { x: 93, y: 315}
        },
        {
            nombre: "Stuttgart",
            coordenadas: { x: 343, y: 306}
        },
        {
            nombre: "Zhengzhou",
            coordenadas: { x: 545, y: 342}
        },
        {
            nombre: "Montreal",
            coordenadas: { x: 186, y: 315}
        },
        {
            nombre: "Tel Aviv",
            coordenadas: { x: 395, y: 345}
        },
        {
            nombre: "Mumbai",
            coordenadas: { x: 470, y: 373}
        },
        {
            nombre: "Managua",
            coordenadas: { x: 165, y: 387}
        },
        {
            nombre: "Estocolmo",
            coordenadas: { x: 361, y: 280}
        },
        {
            nombre: "Tegucigalpa",
            coordenadas: { x: 163, y: 382}
        },
        {
            nombre: "Varsovia",
            coordenadas: { x: 368, y: 297}
        },
        {
            nombre: "San Luis",
            coordenadas: { x: 334, y: 331}
        },
        {
            nombre: "Pittsburgh",
            coordenadas: { x: 173, y: 325}
        },        
        {
            nombre: "Perth",
            coordenadas: { x: 546, y: 472}
        },
        {
            nombre: "Lagos",
            coordenadas: { x: 338, y: 395}
        },
        {
            nombre: "Kinshasa",
            coordenadas: { x: 359, y: 418}
        },
        {
            nombre: "Atenas",
            coordenadas: { x: 374, y: 332}
        },
        {
            nombre: "Luanda",
            coordenadas: { x: 355, y: 426}
        },
        {
            nombre: "Nairobi",
            coordenadas: { x: 399, y: 412}
        },
        {
            nombre: "Mogadiscio",
            coordenadas: { x: 417, y: 402}
        },
        {
            nombre: "Copenhague",
            coordenadas: { x: 351, y: 289}
        },
        {
            nombre: "Abiyán",
            coordenadas: { x: 321, y: 397}
        },
        {
            nombre: "Addis Abeba",
            coordenadas: { x: 401, y: 392}
        },
        {
            nombre: "Monterrey",
            coordenadas: { x: 135, y: 359}
        },
        {
            nombre: "Cochabamba",
            coordenadas: { x: 203, y: 445}
        },
        {
            nombre: "Katowice",
            coordenadas: { x: 365, y: 303}
        },        
        {
            nombre: "San Petersburgo",
            coordenadas: { x: 388, y: 277}
        },
        {
            nombre: "Orlando",
            coordenadas: { x: 173, y: 353}
        },       
        
        {
            nombre: "Indianapolis",
            coordenadas: { x: 165, y: 327}
        },
        {
            nombre: "Vancouver",
            coordenadas: { x: 93, y: 307}
        },
        {
            nombre: "Zúrich",
            coordenadas: { x: 344, y: 311}
        },
        {
            nombre: "Austin",
            coordenadas: { x: 140, y: 348}
        },
        {
            nombre: "Kansas City",
            coordenadas: { x: 150, y: 330}
        },
        {
            nombre: "Ankara",
            coordenadas: { x: 391, y: 330}
        },        
        {
            nombre: "Leipzig",
            coordenadas: { x: 353, y: 302}
        },
        {
            nombre: "Lille",
            coordenadas: { x: 335, y: 305}
        },
        {
            nombre: "Kiev",
            coordenadas: { x: 387, y: 303}
        },
        {
            nombre: "Budapest",
            coordenadas: { x: 364, y: 310}
        },
        {
            nombre: "Calgary",
            coordenadas: { x: 112, y: 298}
        },
        {
            nombre: "Lyon",
            coordenadas: { x: 338, y: 315}
        },
        {
            nombre: "Brisbane",
            coordenadas: { x: 617, y: 464}
        },
        {
            nombre: "Dakar",
            coordenadas: { x: 297, y: 380}
        },
        {
            nombre: "Kampala",
            coordenadas: { x: 390, y: 408}
        },
        {
            nombre: "Las Vegas",
            coordenadas: { x: 111, y: 336}
        },
        {
            nombre: "Mánchester",
            coordenadas: { x: 324, y: 297}
        },
        {
            nombre: "Virginia Beach",
            coordenadas: { x: 181, y: 337}
        },
        {
            nombre: "Eindhoven",
            coordenadas: { x: 339, y: 300}
        },
        {
            nombre: "Dublín",
            coordenadas: { x: 316, y: 297}
        },
        {
            nombre: "Praga",
            coordenadas: { x: 357, y: 304}
        },
        {
            nombre: "Nápoles",
            coordenadas: { x: 356, y: 326}
        },
        {
            nombre: "Belo Horizonte",
            coordenadas: { x: 245, y: 449}
        },
        {
            nombre: "Edmonton",
            coordenadas: { x: 109, y: 292}
        },
        {
            nombre: "Johannesburgo",
            coordenadas: { x: 381, y: 461}
        },
        {
            nombre: "Dubái",
            coordenadas: { x: 434, y: 360}
        },
        {
            nombre: "Guadalajara",
            coordenadas: { x: 130, y: 368}
        },
        {
            nombre: "Sapporo",
            coordenadas: { x: 597, y: 321}
        },
        {
            nombre: "Bursa",
            coordenadas: { x: 384, y: 329}
        },        
        {
            nombre: "Turín",
            coordenadas: { x: 344, y: 318}
        },
        {
            nombre: "Helsinki",
            coordenadas: { x: 376, y: 275}
        },        
        {
            nombre: "Xiamen",
            coordenadas: { x: 549, y: 362}
        },
        {
            nombre: "Hiroshima",
            coordenadas: { x: 583, y: 339}
        },        
        {
            nombre: "Nueva Orleans",
            coordenadas: { x: 155, y: 350}
        },
        {
            nombre: "Bucarest",
            coordenadas: { x: 377, y: 316}
        },
        {
            nombre: "Ciudad Ho Chi Minh",
            coordenadas: { x: 531, y: 388}
        },
        {
            nombre: "Bagdad",
            coordenadas: { x: 413, y: 344}
        },
        {
            nombre: "Oklahoma City",
            coordenadas: { x: 144, y: 336}
        },        
        {
            nombre: "Memphis",
            coordenadas: { x: 155, y: 341}
        },
        {
            nombre: "Taiyuan",
            coordenadas: { x: 542, y: 334}
        },
        {
            nombre: "Luxemburgo",
            coordenadas: { x: 340, y: 306}
        },
        {
            nombre: "Porto Alegre",
            coordenadas: { x: 231, y: 467}
        },
        {
            nombre: "Calcuta",
            coordenadas: { x: 493, y: 365}
        },        
        {
            nombre: "Ciudad del Cabo",
            coordenadas: { x: 364, y: 473}
        },
        {
            nombre: "Ottawa",
            coordenadas: { x: 185, y: 315}
        },
        {
            nombre: "Venecia",
            coordenadas: { x: 352, y: 316}
        },        
        {
            nombre: "Daegu",
            coordenadas: { x: 371, y: 338}
        },
        {
            nombre: "Macau",
            coordenadas: { x: 542, y: 366}
        },
        {
            nombre: "Almaty",
            coordenadas: { x: 475, y: 320}
        },
        {
            nombre: "Pionyang",
            coordenadas: { x: 568, y: 329}
        },        
        {
            nombre: "Auckland",
            coordenadas: { x: 661, y: 485}
        },
        {
            nombre: "Durban",
            coordenadas: { x: 386, y: 468}
        },
        {
            nombre: "Toulouse",
            coordenadas: { x: 333, y: 318}
        },        
        {
            nombre: "Ginebra",
            coordenadas: { x: 343, y: 313}
        },
        {
            nombre: "Burdeos",
            coordenadas: { x: 329, y: 316}
        },
        {
            nombre: "Gotemburgo",
            coordenadas: { x: 353, y: 283}
        },
        {
            nombre: "Bilbao",
            coordenadas: { x: 324, y: 324}
        },
        {
            nombre: "Salvador de Bahía",
            coordenadas: { x: 255, y: 432}
        },
        {
            nombre: "Casablanca",
            coordenadas: { x: 314, y: 343}
        },        
        {
            nombre: "Durham",
            coordenadas: { x: 177, y: 338}
        },
        {
            nombre: "Cracovia",
            coordenadas: { x: 367, y: 303}
        },        
        {
            nombre: "Winnipeg",
            coordenadas: { x: 144, y: 303}
        },
        {
            nombre: "Alejandría",
            coordenadas: { x: 386, y: 349}
        }
    ]
    
}

