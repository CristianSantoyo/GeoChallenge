class JuegoPaises extends Juego {
    btnOpciones = [];

    constructor(orquestador,domMensajes){
        super(orquestador, domMensajes);
        for (var i=0, j=0, k=0; i < 4; i++, j++){
            if (j == 2){
                j=0;
                k++;
            }
            this.btnOpciones.push(new BtnOpcion());
            this.btnOpciones[i].setCoordenadas(60 + (320*j), 445+(100*k));            
        }
        this.controlador = new JPController(this);
        this.enunciado = new Enunciado(170, 95);
    }
    
    iniciar() {
        this.canvas.show("fade", 900);

        this.cargarSonidos();
        this.cargarImagenes("images/juegos/fondoPaises.png");
        this.nivel = 1;
        this.tiempo = 60;
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
            this.canvas[0].addEventListener("mousemove", this.controlador.mouseMove, false);
            this.canvas[0].addEventListener("mousedown", this.controlador.mouseDown, false);
        }, 5000);
    }

    formularPregunta(){
        this.cambiarDificultad();
        var n;
        var aux = [];
        for (var i = 0; i < 4; i++){
            n = Math.floor((Math.random() * this.rango))            
            while(aux.includes(n)) n = Math.floor((Math.random() * this.rango))            
            let pais = this.paises[n];            
            this.btnOpciones[i].setPais(pais);            
            aux.push(n)        
        }

        this.pregunta = !this.hardcore ? 
        this.paises[aux[Math.floor((Math.random() * 4))]]
        : this.paises[aux[aux.indexOf(Math.max(...aux))]]        
        
        this.enunciado.setEnunciado(this.pregunta.nombre, this.pregunta.nombre, this.pregunta.img);
        this.tiempoPregunta = 450;
    }
    
    seleccionarOpcion(opcion){        
        if (opcion.texto == this.enunciado.texto){
            this.correcto();
            this.presicion.push(0);
        } else {
            this.incorrecto();
            this.presicion.push(1);
        }
        this.formularPregunta();
    }

    correcto(){
        this.sonidoCorrecto.currentTime = 0;
        this.menCorrecto.show("scale", 500);
        this.menCorrecto.hide("scale", 100);
        this.sonidoCorrecto.play();
        this.nivel++;
        this.ganarTiempo();
        this.puntaje += 500;
        const bonus = parseInt(this.tiempoPregunta/2);
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
            case 12:                
                this.rango = 100;
                break;
            case 15:                
                this.rango = 130;
                break;
            case 20:                
                this.rango = 160;
                break;
            case 25:                
                this.rango = this.paises.length;
                break;            
            case 30:
                this.hardcore = true;
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
            contextoBuffer.drawImage(this.imgTiempoBarra, 128, 333, this.tiempoPregunta, 20);
            contextoBuffer.drawImage(this.imgMarcoTiempo, 120, 325);
            for (var i = 0; i < 4; i++){
                this.btnOpciones[i].dibujar(contextoBuffer);
            }
            this.enunciado.dibujar(contextoBuffer);            
        }
        contextoBuffer.fillStyle = "White";

        contextoBuffer.font = "bold 30px superCell";
        contextoBuffer.fillText(this.puntaje, 250, 690);

        contextoBuffer.textAlign = "left";
        contextoBuffer.fillText(this.tiempo, 625, 40);
        // Modificar Buffer
        contexto.clearRect(0,0,this.canvas[0].width, this.canvas[0].height);
	    contexto.drawImage(buffer,0,0);	
    }

    paises = [
        {
            nombre: "Colombia",
            img: crearImagen("images/juegos/Paises/colombia.png")
        },
        {
            nombre: "Estados Unidos",
            img: crearImagen("images/juegos/Paises/usa.png")
        },
        {
            nombre: "Canadá",
            img: crearImagen("images/juegos/Paises/canada.png")
        },
        {
            nombre: "Japón",
            img: crearImagen("images/juegos/Paises/japon.png")
        },
        {
            nombre: "Australia",
            img: crearImagen("images/juegos/Paises/australia.png")
        },
        {
            nombre: "Italia",
            img: crearImagen("images/juegos/Paises/italia.png")
        },
        {
            nombre: "Francia",
            img: crearImagen("images/juegos/Paises/francia.png")
        },
        {
            nombre: "Portugal",
            img: crearImagen("images/juegos/Paises/portugal.png")
        },
        {
            nombre: "Brasil",
            img: crearImagen("images/juegos/Paises/brasil.png")
        },
        {
            nombre: "Austria",
            img: crearImagen("images/juegos/Paises/austria.png")
        },
        {
            nombre: "Egipto",
            img: crearImagen("images/juegos/Paises/egipto.png")
        },
        {
            nombre: "Israel",
            img: crearImagen("images/juegos/Paises/israel.png")
        },
        {
            nombre: "Suecia",
            img: crearImagen("images/juegos/Paises/suecia.png")
        },
        {
            nombre: "Panamá",
            img: crearImagen("images/juegos/Paises/panama.png")
        },
        {
            nombre: "Irlanda",
            img: crearImagen("images/juegos/Paises/irlanda.png")
        },
        {
            nombre: "Paraguay",
            img: crearImagen("images/juegos/Paises/paraguay.png")
        },
        {
            nombre: "Ucrania",
            img: crearImagen("images/juegos/Paises/ucrania.png")
        },
        {
            nombre: "Suiza",
            img: crearImagen("images/juegos/Paises/suiza.png")
        },
        {
            nombre: "Países Bajos",
            img: crearImagen("images/juegos/Paises/PaisesBajos.png")
        },
        {
            nombre: "Guatemala",
            img: crearImagen("images/juegos/Paises/guatemala.png")
        },
        {
            nombre: "Finlandia",
            img: crearImagen("images/juegos/Paises/finlandia.png")
        },
        {
            nombre: "Corea del Norte",
            img: crearImagen("images/juegos/Paises/coreaNorte.png")
        },
        {
            nombre: "México",
            img: crearImagen("images/juegos/Paises/mexico.png")
        },
        {
            nombre: "Rusia",
            img: crearImagen("images/juegos/Paises/rusia.png")
        },
        {
            nombre: "Venezuela",
            img: crearImagen("images/juegos/Paises/venezuela.png")
        },
        {
            nombre: "Perú",
            img: crearImagen("images/juegos/Paises/peru.png")
        },
        {
            nombre: "Arabia Saudita",
            img: crearImagen("images/juegos/Paises/arabiaSaudita.png")
        },
        {
            nombre: "Polonia",
            img: crearImagen("images/juegos/Paises/polonia.png")
        },
        {
            nombre: "Costa Rica",
            img: crearImagen("images/juegos/Paises/costaRica.png")
        },
        {
            nombre: "Nicaragua",
            img: crearImagen("images/juegos/Paises/nicaragua.png")
        },
        {
            nombre: "Surinam",
            img: crearImagen("images/juegos/Paises/surinam.png")
        },
        {
            nombre: "Uruguay",
            img: crearImagen("images/juegos/Paises/uruguay.png")
        },
        {
            nombre: "El Salvador",
            img: crearImagen("images/juegos/Paises/elSalvador.png")
        },
        {
            nombre: "Honduras",
            img: crearImagen("images/juegos/Paises/honduras.png")
        },
        {
            nombre: "Bolivia",
            img: crearImagen("images/juegos/Paises/bolivia.png")
        },
        {
            nombre: "Guayana",
            img: crearImagen("images/juegos/Paises/guyana.png")
        },
        {
            nombre: "Ecuador",
            img: crearImagen("images/juegos/Paises/ecuador.png")
        },
        {
            nombre: "Hungría",
            img: crearImagen("images/juegos/Paises/hungria.png")
        },
        {
            nombre: "Bélgica",
            img: crearImagen("images/juegos/Paises/belgica.png")
        },
        {
            nombre: "Reino Unido",
            img: crearImagen("images/juegos/Paises/reinoUnido.png")
        },
        {
            nombre: "Noruega",
            img: crearImagen("images/juegos/Paises/noruega.png")
        },
        {
            nombre: "China",
            img: crearImagen("images/juegos/Paises/china.png")
        },
        {
            nombre: "Chile",
            img: crearImagen("images/juegos/Paises/chile.png")
        },
        {
            nombre: "Indonesia",
            img: crearImagen("images/juegos/Paises/indonesia.png")
        },
        {
            nombre: "Grecia",
            img: crearImagen("images/juegos/Paises/grecia.png")
        },
        {
            nombre: "India",
            img: crearImagen("images/juegos/Paises/india.png")
        },
        {
            nombre: "Islandia",
            img: crearImagen("images/juegos/Paises/islandia.png")
        },
        {
            nombre: "Filipinas",
            img: crearImagen("images/juegos/Paises/filipinas.png")
        },
        {
            nombre: "Cuba",
            img: crearImagen("images/juegos/Paises/cuba.png")
        },
        {
            nombre: "Nueva Zelanda",
            img: crearImagen("images/juegos/Paises/nuevaZelanda.png")
        },
        {
            nombre: "Vietnam",
            img: crearImagen("images/juegos/Paises/vietnam.png")
        },
        {
            nombre: "Tailandia",
            img: crearImagen("images/juegos/Paises/tailandia.png")
        },
        {
            nombre: "Alemania",
            img: crearImagen("images/juegos/Paises/alemania.png")
        },
        {
            nombre: "España",
            img: crearImagen("images/juegos/Paises/españa.png")
        },
        {
            nombre: "Turquía",
            img: crearImagen("images/juegos/Paises/turquia.png")
        },
        {
            nombre: "Croacia",
            img: crearImagen("images/juegos/Paises/croacia.png")
        },
        {
            nombre: "Dinamarca",
            img: crearImagen("images/juegos/Paises/dinamarca.png")
        },
        {
            nombre: "Argentina",
            img: crearImagen("images/juegos/Paises/argentina.png")
        },
        {
            nombre: "Chipre",
            img: crearImagen("images/juegos/Paises/chipre.png")
        },
        {
            nombre: "Sudáfrica",
            img: crearImagen("images/juegos/Paises/sudafrica.png")
        },
        {
            nombre: "Somalia",
            img: crearImagen("images/juegos/Paises/somalia.png")
        },
        {
            nombre: "Myanmar",
            img: crearImagen("images/juegos/Paises/myanmar.png")
        },
        {
            nombre: "Marruecos",
            img: crearImagen("images/juegos/Paises/marruecos.png")
        },
        {
            nombre: "Laos",
            img: crearImagen("images/juegos/Paises/laos.png")
        },
        {
            nombre: "Papúa Nueva Guinea",
            img: crearImagen("images/juegos/Paises/papuaNuevaGuinea.png")
        },
        {
            nombre: "Malasia",
            img: crearImagen("images/juegos/Paises/malasia.png")
        },
        {
            nombre: "Madagascar",
            img: crearImagen("images/juegos/Paises/madagascar.png")
        },
        {
            nombre: "Senegal",
            img: crearImagen("images/juegos/Paises/senegal.png")
        },
        {
            nombre: "Bangladés",
            img: crearImagen("images/juegos/Paises/banglades.png")
        },
        {
            nombre: "Malí",
            img: crearImagen("images/juegos/Paises/mali.png")
        },
        {
            nombre: "Kazajistán",
            img: crearImagen("images/juegos/Paises/kazajistan.png")
        },
        {
            nombre: "Pakistán",
            img: crearImagen("images/juegos/Paises/pakistan.png")
        },
        {
            nombre: "Gambia",
            img: crearImagen("images/juegos/Paises/gambia.png")
        },
        {
            nombre: "Sri Lanka",
            img: crearImagen("images/juegos/Paises/sriLanka.png")
        },
        {
            nombre: "Namibia",
            img: crearImagen("images/juegos/Paises/namibia.png")
        },
        {
            nombre: "Haití",
            img: crearImagen("images/juegos/Paises/haiti.png")
        },
        {
            nombre: "Iran",
            img: crearImagen("images/juegos/Paises/iran.png")
        },
        {
            nombre: "Benin",
            img: crearImagen("images/juegos/Paises/benin.png")
        },
        {
            nombre: "Mozambique",
            img: crearImagen("images/juegos/Paises/mozambique.png")
        },
        {
            nombre: "Nepal",
            img: crearImagen("images/juegos/Paises/nepal.png")
        },
        {
            nombre: "Rep. Dem. del Congo",
            img: crearImagen("images/juegos/Paises/repCongo.png")
        },
        {
            nombre: "Libia",
            img: crearImagen("images/juegos/Paises/libia.png")
        },
        {
            nombre: "Maldivas",
            img: crearImagen("images/juegos/Paises/maldivas.png")
        },
        {
            nombre: "Taiwán",
            img: crearImagen("images/juegos/Paises/taiwan.png")
        },
        {
            nombre: "Afganistán",
            img: crearImagen("images/juegos/Paises/afganistan.png")
        },
        {
            nombre: "Irak",
            img: crearImagen("images/juegos/Paises/irak.png")
        },
        {
            nombre: "Uzbekistán",
            img: crearImagen("images/juegos/Paises/uzbekistan.png")
        },
        {
            nombre: "Mongolia",
            img: crearImagen("images/juegos/Paises/mongolia.png")
        },
        {
            nombre: "Corea del Sur",
            img: crearImagen("images/juegos/Paises/coreaSur.png")
        },
        {
            nombre: "Estonia",
            img: crearImagen("images/juegos/Paises/estonia.png")
        },
        {
            nombre: "Angola",
            img: crearImagen("images/juegos/Paises/angola.png")
        },
        {
            nombre: "Argelia",
            img: crearImagen("images/juegos/Paises/argelia.png")
        },
        {
            nombre: "Mauritania",
            img: crearImagen("images/juegos/Paises/mauritania.png")
        },
        {
            nombre: "Jordania",
            img: crearImagen("images/juegos/Paises/jordania.png")
        },
        {
            nombre: "Eritrea",
            img: crearImagen("images/juegos/Paises/eritrea.png")
        },
        {
            nombre: "Emiratos Árabes Unidos",
            img: crearImagen("images/juegos/Paises/emiratosArabesUnidos.png")
        },
        {
            nombre: "Zambia",
            img: crearImagen("images/juegos/Paises/zambia.png")
        },
        {
            nombre: "Chad",
            img: crearImagen("images/juegos/Paises/chad.png")
        },
        {
            nombre: "Camerún",
            img: crearImagen("images/juegos/Paises/camerun.png")
        },
        {
            nombre: "República Dominicana",
            img: crearImagen("images/juegos/Paises/republicaDominicana.png")
        },
        {
            nombre: "República Checa",
            img: crearImagen("images/juegos/Paises/republicaCheca.png")
        },
        {
            nombre: "Jamaica",
            img: crearImagen("images/juegos/Paises/jamaica.png")
        },
        {
            nombre: "Bahamas",
            img: crearImagen("images/juegos/Paises/bahamas.png")
        },
        {
            nombre: "Bosnia y Herzegovina",
            img: crearImagen("images/juegos/Paises/bozniaHerzegovina.png")
        },
        {
            nombre: "Etiopía",
            img: crearImagen("images/juegos/Paises/etiopia.png")
        },
        {
            nombre: "Kosovo",
            img: crearImagen("images/juegos/Paises/kosovo.png")
        },
        {
            nombre: "Omán",
            img: crearImagen("images/juegos/Paises/oman.png")
        },
        {
            nombre: "Sudán",
            img: crearImagen("images/juegos/Paises/sudan.png")
        },
        {
            nombre: "Serbia",
            img: crearImagen("images/juegos/Paises/serbia.png")
        },
        {
            nombre: "Siria",
            img: crearImagen("images/juegos/Paises/siria.png")
        },
        {
            nombre: "Yemen",
            img: crearImagen("images/juegos/Paises/yemen.png")
        },
        {
            nombre: "Moldavia",
            img: crearImagen("images/juegos/Paises/moldavia.png")
        },
        {
            nombre: "Túnez",
            img: crearImagen("images/juegos/Paises/tunez.png")
        },
        {
            nombre: "Rumania",
            img: crearImagen("images/juegos/Paises/rumania.png")
        },
        {
            nombre: "Azerbaiyán",
            img: crearImagen("images/juegos/Paises/azerbaiyan.png")
        },
        {
            nombre: "Malawi",
            img: crearImagen("images/juegos/Paises/malawi.png")
        },
        {
            nombre: "Turkmenistán",
            img: crearImagen("images/juegos/Paises/turkmenistan.png")
        },
        {
            nombre: "Eslovaquia",
            img: crearImagen("images/juegos/Paises/eslovaquia.png")
        },
        {
            nombre: "Trinidad y Tobago",
            img: crearImagen("images/juegos/Paises/trinidadTobago.png")
        },
        {
            nombre: "Malta",
            img: crearImagen("images/juegos/Paises/malta.png")
        },
        {
            nombre: "Togo",
            img: crearImagen("images/juegos/Paises/togo.png")
        },
        {
            nombre: "Letonia",
            img: crearImagen("images/juegos/Paises/letonia.png")
        },
        {
            nombre: "Tayikistán",
            img: crearImagen("images/juegos/Paises/tayikistan.png")
        },
        {
            nombre: "Bulgaria",
            img: crearImagen("images/juegos/Paises/bulgaria.png")
        },
        {
            nombre: "Albania",
            img: crearImagen("images/juegos/Paises/albania.png")
        },
        {
            nombre: "Níger",
            img: crearImagen("images/juegos/Paises/niger.png")
        },
        {
            nombre: "Mónaco",
            img: crearImagen("images/juegos/Paises/monaco.png")
        },
        {
            nombre: "Kirguistán",
            img: crearImagen("images/juegos/Paises/kirguistan.png")
        },
        {
            nombre: "Bielorrusia",
            img: crearImagen("images/juegos/Paises/bielorrusia.png")
        },
        {
            nombre: "Guinea Ecuatorial",
            img: crearImagen("images/juegos/Paises/guineaEcuatorial.png")
        },
        {
            nombre: "Ciudad del Vaticano",
            img: crearImagen("images/juegos/Paises/ciudadVaticano.png")
        },
        {
            nombre: "República del Congo",
            img: crearImagen("images/juegos/Paises/congo.png")
        },
        {
            nombre: "Gabón",
            img: crearImagen("images/juegos/Paises/gabon.png")
        },
        {
            nombre: "Costa de Marfil",
            img: crearImagen("images/juegos/Paises/costaMarfil.png")
        },
        {
            nombre: "Kuwait",
            img: crearImagen("images/juegos/Paises/kuwait.png")
        },
        {
            nombre: "Georgia",
            img: crearImagen("images/juegos/Paises/georgia.png")
        },
        {
            nombre: "Cabo Verde",
            img: crearImagen("images/juegos/Paises/caboVerde.png")
        },
        {
            nombre: "República Centroafricana",
            img: crearImagen("images/juegos/Paises/republicaCentroafricana.png")
        },
        {
            nombre: "Tanzania",
            img: crearImagen("images/juegos/Paises/tanzania.png")
        },
        {
            nombre: "Ghana",
            img: crearImagen("images/juegos/Paises/ghana.png")
        },
        {
            nombre: "Kenia",
            img: crearImagen("images/juegos/Paises/kenia.png")
        },
        {
            nombre: "Nigeria",
            img: crearImagen("images/juegos/Paises/nigeria.png")
        },
        {
            nombre: "Timor Oriental",
            img: crearImagen("images/juegos/Paises/timorOriental.png")
        },
        {
            nombre: "Guinea",
            img: crearImagen("images/juegos/Paises/guinea.png")
        },
        {
            nombre: "Singapur",
            img: crearImagen("images/juegos/Paises/singapur.png")
        },
        {
            nombre: "Luxemburgo",
            img: crearImagen("images/juegos/Paises/luxemburgo.png")
        },
        {
            nombre: "Burkina Faso",
            img: crearImagen("images/juegos/Paises/burkinaFaso.png")
        },
        {
            nombre: "Sudán del Sur",
            img: crearImagen("images/juegos/Paises/sudanSur.png")
        },
        {
            nombre: "Montenegro",
            img: crearImagen("images/juegos/Paises/montenegro.png")
        },
        {
            nombre: "San Cristóbal y Nieves",
            img: crearImagen("images/juegos/Paises/sanCristobalNieves.png")
        },
        {
            nombre: "Liberia",
            img: crearImagen("images/juegos/Paises/liberia.png")
        },
        {
            nombre: "Lituania",
            img: crearImagen("images/juegos/Paises/lituania.png")
        },
        {
            nombre: "Zimbabue",
            img: crearImagen("images/juegos/Paises/zimbabue.png")
        },
        {
            nombre: "Macedonia",
            img: crearImagen("images/juegos/Paises/macedonia.png")
        },
        {
            nombre: "Armenia",
            img: crearImagen("images/juegos/Paises/armenia.png")
        },
        {
            nombre: "Brunei",
            img: crearImagen("images/juegos/Paises/brunei.png")
        },
        {
            nombre: "Eslovenia",
            img: crearImagen("images/juegos/Paises/eslovenia.png")
        },
        {
            nombre: "Belice",
            img: crearImagen("images/juegos/Paises/belice.png")
        },
        {
            nombre: "Guinea-Bissau",
            img: crearImagen("images/juegos/Paises/guineaBissau.png")
        },
        {
            nombre: "Nauru",
            img: crearImagen("images/juegos/Paises/nauru.png")
        },
        {
            nombre: "Fiyi",
            img: crearImagen("images/juegos/Paises/fiyi.png")
        },
        {
            nombre: "Liechtenstein",
            img: crearImagen("images/juegos/Paises/liechtenstein.png")
        },
        {
            nombre: "Islas Salomón",
            img: crearImagen("images/juegos/Paises/islasSalomon.png")
        },
        {
            nombre: "Micronesia",
            img: crearImagen("images/juegos/Paises/micronesia.png")
        },
        {
            nombre: "Antigua y Barbuda",
            img: crearImagen("images/juegos/Paises/antiguaBarbuda.png")
        },
        {
            nombre: "Santo Tomé y Príncipe",
            img: crearImagen("images/juegos/Paises/santoTomePrincipe.png")
        },
        {
            nombre: "Catar",
            img: crearImagen("images/juegos/Paises/catar.png")
        },
        {
            nombre: "Botsuana",
            img: crearImagen("images/juegos/Paises/botsuana.png")
        },
        {
            nombre: "Kiribati",
            img: crearImagen("images/juegos/Paises/kiribati.png")
        },
        {
            nombre: "Camboya",
            img: crearImagen("images/juegos/Paises/camboya.png")
        },
        {
            nombre: "Líbano",
            img: crearImagen("images/juegos/Paises/libano.png")
        },
        {
            nombre: "Vanuatu",
            img: crearImagen("images/juegos/Paises/vanuatu.png")
        },
        {
            nombre: "Islas Marshall",
            img: crearImagen("images/juegos/Paises/islasMarshall.png")
        },
        {
            nombre: "Seychelles",
            img: crearImagen("images/juegos/Paises/seychelles.png")
        },
        {
            nombre: "Yibutí",
            img: crearImagen("images/juegos/Paises/yibuti.png")
        },
        {
            nombre: "Comoras",
            img: crearImagen("images/juegos/Paises/comoras.png")
        },
        {
            nombre: "Baréin",
            img: crearImagen("images/juegos/Paises/barein.png")
        },
        {
            nombre: "Uganda",
            img: crearImagen("images/juegos/Paises/uganda.png")
        },
        {
            nombre: "Tuvalu",
            img: crearImagen("images/juegos/Paises/tuvalu.png")
        },
        {
            nombre: "Burundi",
            img: crearImagen("images/juegos/Paises/burundi.png")
        },
        {
            nombre: "San Marino",
            img: crearImagen("images/juegos/Paises/sanMarino.png")
        },
        {
            nombre: "Santa Lucía",
            img: crearImagen("images/juegos/Paises/santaLucia.png")
        },
        {
            nombre: "Palaos",
            img: crearImagen("images/juegos/Paises/palaos.png")
        },
        {
            nombre: "Tonga",
            img: crearImagen("images/juegos/Paises/tonga.png")
        },
        {
            nombre: "Dominica",
            img: crearImagen("images/juegos/Paises/dominica.png")
        },
        {
            nombre: "Granada",
            img: crearImagen("images/juegos/Paises/granada.png")
        },
        {
            nombre: "Samoa",
            img: crearImagen("images/juegos/Paises/samoa.png")
        },
        {
            nombre: "Sierra Leona",
            img: crearImagen("images/juegos/Paises/sierraLeona.png")
        },
        {
            nombre: "Suazilandia",
            img: crearImagen("images/juegos/Paises/suazilandia.png")
        },
        {
            nombre: "Andorra",
            img: crearImagen("images/juegos/Paises/andorra.png")
        },
        {
            nombre: "Ruanda",
            img: crearImagen("images/juegos/Paises/ruanda.png")
        },
        {
            nombre: "Lesoto",
            img: crearImagen("images/juegos/Paises/lesoto.png")
        },
        {
            nombre: "Bután",
            img: crearImagen("images/juegos/Paises/butan.png")
        },
        {
            nombre: "Barbados",
            img: crearImagen("images/juegos/Paises/barbados.png")
        },
        {
            nombre: "San Vicente y las Granadinas",
            img: crearImagen("images/juegos/Paises/sanVicenteGranadinas.png")
        }
    ]
}