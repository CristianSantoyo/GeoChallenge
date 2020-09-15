class JuegoLugares extends Juego {
    btnOpciones = [];

    constructor(orquestador,domMensajes){
        super(orquestador, domMensajes);
        for (var i=0; i < 6; i++){            
            this.btnOpciones.push(new BtnOpcionLugares());
            this.btnOpciones[i].setCoordenadas(415, 270+(50*i));
        }
        this.controlador = new JLController(this);
        this.enunciado = new Enunciado(92, 200);
    }
    
    iniciar() {
        this.canvas.show("fade", 900);

        this.cargarSonidos();
        this.cargarImagenes("images/juegos/fondoLugares.png");
        this.nivel = 1;
        this.tiempo = 60;
        this.opcPosibles = 3;
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
            this.hiloPregunta = setInterval(this.reducirTiempoPregunta, 15);
            this.inicio = true;
            this.canvas[0].addEventListener("mousemove", this.controlador.mouseMove, false);
            this.canvas[0].addEventListener("mousedown", this.controlador.mouseDown, false);
        }, 5000);
    }

    formularPregunta(){
        this.cambiarDificultad();
        var n;
        var aux = [];
        for (var i = 0; i < this.opcPosibles; i++){
            n = Math.floor((Math.random() * this.rango))            
            while(aux.includes(n)) n = Math.floor((Math.random() * this.rango))            
            let pais = this.lugares[n];            
            this.btnOpciones[i].setPais(pais);            
            aux.push(n);
        }

        this.pregunta = !this.hardcore ?         
        this.lugares[aux[Math.floor((Math.random() * this.opcPosibles))]]
        : this.lugares[aux[aux.indexOf(Math.max(...aux))]]        
        
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
        this.puntaje += 700;
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
            case 7:
                this.opcPosibles = 4;
                for (var i=0; i < this.opcPosibles; i++){                                
                    this.btnOpciones[i].setCoordenadas(415, 250+(50*i));
                }                          
                this.rango = 100;
                break;
            case 9:
                this.opcPosibles = 5;
                for (var i=0; i < this.opcPosibles; i++){                                
                    this.btnOpciones[i].setCoordenadas(415, 220+(50*i));
                } 
                this.rango = 130;
                break;
            case 13:                             
                this.rango = 160;
                break;
            case 20:
                this.opcPosibles = 6;
                for (var i=0; i < this.opcPosibles; i++){                                
                    this.btnOpciones[i].setCoordenadas(415, 200+(50*i));
                }                          
                this.rango = 160;
                break;
            case 25:                
                this.rango = this.lugares.length;
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
        
        contextoBuffer.font = "bold 14px superCell";
        contextoBuffer.textAlign = "center";
        
        if (this.inicio){
            contextoBuffer.drawImage(this.imgTiempoBarra, 128, 598, this.tiempoPregunta, 20);
            contextoBuffer.drawImage(this.imgMarcoTiempo, 120, 590);
            for (var i = 0; i < this.opcPosibles; i++){
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

    lugares = [
        {
            nombre: "La Gran Muralla",
            img: crearImagen("images/juegos/Lugares/granMuralla.png")
        },
        {
            nombre: "Pirámide de Guiza",
            img: crearImagen("images/juegos/Lugares/piramidedeGuiza.png")
        },
        {
            nombre: "Alhambra",
            img: crearImagen("images/juegos/Lugares/alhambra.png")
        },
        {
            nombre: "Torre Eiffel",
            img: crearImagen("images/juegos/Lugares/torreEiffel.png")
        },
        {
            nombre: "Hollywood Sign",
            img: crearImagen("images/juegos/Lugares/hollywoodSign.png")
        },
        {
            nombre: "Templo de la Sagrada Familia",
            img: crearImagen("images/juegos/Lugares/sagradaFamilia.png")
        },
        {
            nombre: "Casa Blanca",
            img: crearImagen("images/juegos/Lugares/casaBlanca.png")
        },
        {
            nombre: "Torre de Pisa",
            img: crearImagen("images/juegos/Lugares/torrePisa.png")
        },
        {
            nombre: "Gran Palacio de Bangkok",
            img: crearImagen("images/juegos/Lugares/palacionBangkok.png")
        },
        {
            nombre: "Monte Fuji",
            img: crearImagen("images/juegos/Lugares/monteFuji.png")
        },
        {
            nombre: "Castillo de Neuschwanstein",
            img: crearImagen("images/juegos/Lugares/castilloNeuschwanstein.png")
        },
        {
            nombre: "Burj Khalifa",
            img: crearImagen("images/juegos/Lugares/burjKhalifa.png")
        },
        {
            nombre: "Estatua de la Libertad",
            img: crearImagen("images/juegos/Lugares/estatuaLibertad.png")
        },
        {
            nombre: "Coliseo Romano",
            img: crearImagen("images/juegos/Lugares/coliseoRomano.png")
        },
        {
            nombre: "Chichén Itzá",
            img: crearImagen("images/juegos/Lugares/chichenItza.png")
        },
        {
            nombre: "Torre BMW",
            img: crearImagen("images/juegos/Lugares/torreBmw.png")
        },
        {
            nombre: "Santa Sofía",
            img: crearImagen("images/juegos/Lugares/santaSofia.png")
        },
        {
            nombre: "Ciudad Prohibida",
            img: crearImagen("images/juegos/Lugares/ciudadProhibida.png")
        },
        {
            nombre: "Palacio de Buckingham",
            img: crearImagen("images/juegos/Lugares/palacioBuckingham.png")
        },
        {
            nombre: "Gyeongbokgung",
            img: crearImagen("images/juegos/Lugares/gyeongbokgung.png")
        },
        {
            nombre: "Ópera de Sídney",
            img: crearImagen("images/juegos/Lugares/operaSidney.png")
        },
        {
            nombre: "Monte Everest",
            img: crearImagen("images/juegos/Lugares/monteEverest.png")
        },
        {
            nombre: "Petra",
            img: crearImagen("images/juegos/Lugares/petra.png")
        },
        {
            nombre: "Museo del Louvre",
            img: crearImagen("images/juegos/Lugares/museoLovre.png")
        },
        {
            nombre: "Guerreros de Terracota",
            img: crearImagen("images/juegos/Lugares/terracota.png")
        },
        {
            nombre: "Borobudur",
            img: crearImagen("images/juegos/Lugares/borobudur.png")
        },
        {
            nombre: "Monte Kilimanjaro",
            img: crearImagen("images/juegos/Lugares/monteKilimanjaro.png")
        },
        {
            nombre: "Plaza Roja",
            img: crearImagen("images/juegos/Lugares/plazaRoja.png")
        },
        {
            nombre: "Cristo Redentor",
            img: crearImagen("images/juegos/Lugares/cristoRedentor.png")
        },
        {
            nombre: "Taj Mahal",
            img: crearImagen("images/juegos/Lugares/tajMahal.png")
        },
        {
            nombre: "Santuario de Meiji",
            img: crearImagen("images/juegos/Lugares/santuarioMeiji.png")
        },
        {
            nombre: "Muro de Berlín",
            img: crearImagen("images/juegos/Lugares/muroBerlin.png")
        },       
        {
            nombre: "Cataratas del Niágara",
            img: crearImagen("images/juegos/Lugares/cataratasNiagara.png")
        },
        {
            nombre: "Zócalo",
            img: crearImagen("images/juegos/Lugares/zocalo.png")
        },
        {
            nombre: "Angkor Wat",
            img: crearImagen("images/juegos/Lugares/angkorWat.png")
        },
        {
            nombre: "Islas Galápagos",
            img: crearImagen("images/juegos/Lugares/islasGalapagos.png")
        },
        {
            nombre: "Machu Picchu",
            img: crearImagen("images/juegos/Lugares/machuPicchu.png")
        },
        {
            nombre: "Acrópolis",
            img: crearImagen("images/juegos/Lugares/acropolis.png")
        },
        {
            nombre: "Torre de Londres",
            img: crearImagen("images/juegos/Lugares/torreLondres.png")
        },
        {
            nombre: "Ciudad del Vaticano",
            img: crearImagen("images/juegos/Lugares/vaticano.png")
        },
        {
            nombre: "Parque Nacional de Yellowstone",
            img: crearImagen("images/juegos/Lugares/yellowstone.png")
        },
        {
            nombre: "Laguna Azul",
            img: crearImagen("images/juegos/Lugares/lagunaAzul.png")
        },
        {
            nombre: "Stonehenge",
            img: crearImagen("images/juegos/Lugares/stonehenge.png")
        },
        {
            nombre: "Mezquita-Catedral de Córdoba",
            img: crearImagen("images/juegos/Lugares/mezquitaCatedral.png")
        },
        {
            nombre: "Catedral de Santa María del Fiore",
            img: crearImagen("images/juegos/Lugares/catedralFiore.png")
        },
        {
            nombre: "Aconcagua",
            img: crearImagen("images/juegos/Lugares/aconcagua.png")
        },
        {
            nombre: "Monte Vesubio",
            img: crearImagen("images/juegos/Lugares/monteVesubio.png")
        },
        {
            nombre: "Popocatépetl",
            img: crearImagen("images/juegos/Lugares/popocatepetl.png")
        },
        {
            nombre: "Ruinas de Yaxchilán",
            img: crearImagen("images/juegos/Lugares/ruinasYaxchilan.png")
        },
        {
            nombre: "Caño Cristales",
            img: crearImagen("images/juegos/Lugares/cañoCristales.png")
        },        
        {
            nombre: "Abu Simbel",
            img: crearImagen("images/juegos/Lugares/abuSimbel.png")
        },
        {
            nombre: "Santorini",
            img: crearImagen("images/juegos/Lugares/santorini.png")
        },
        {
            nombre: "Cataratas de Iguazú",
            img: crearImagen("images/juegos/Lugares/cataratasIguazu.png")
        },
        {
            nombre: "Cañón del Antílope",
            img: crearImagen("images/juegos/Lugares/cañonAntilope.png")
        },
        {
            nombre: "Zhangye Danxia",
            img: crearImagen("images/juegos/Lugares/zhangyeDanxia.png")
        },
        {
            nombre: "Montañas Tián Shan",
            img: crearImagen("images/juegos/Lugares/montañasTian.png")
        },
        {
            nombre: "“Puertas del infierno”",
            img: crearImagen("images/juegos/Lugares/infierno.png")
        },
        {
            nombre: "Gran Cañón",
            img: crearImagen("images/juegos/Lugares/granCañon.png")
        },
        {
            nombre: "Cataratas Victoria",
            img: crearImagen("images/juegos/Lugares/cataratasVictoria.png")
        },
        {
            nombre: "El Peñol",
            img: crearImagen("images/juegos/Lugares/peñol.png")
        },
        {
            nombre: "Salar de Uyuni",
            img: crearImagen("images/juegos/Lugares/salarUyuni.png")
        },
        {
            nombre: "Fiordo de Geirangerfjord",
            img: crearImagen("images/juegos/Lugares/geirangerfjord.png")
        },
        {
            nombre: "Templos de Bagan",
            img: crearImagen("images/juegos/Lugares/templosBagan.png")
        },
        {
            nombre: "Templo Daigo-ji",
            img: crearImagen("images/juegos/Lugares/temploDaigo.png")
        },
        {
            nombre: "Bora Bora",
            img: crearImagen("images/juegos/Lugares/borabora.png")
        },
        {
            nombre: "Tikal",
            img: crearImagen("images/juegos/Lugares/tikal.png")
        },
        {
            nombre: "Borobudur",
            img: crearImagen("images/juegos/Lugares/borobudur.png")
        },        
        {
            nombre: "Arashiyama",
            img: crearImagen("images/juegos/Lugares/arashiyama.png")
        },
        {
            nombre: "Sukhothai",
            img: crearImagen("images/juegos/Lugares/sukhothai.png")
        },
        {
            nombre: "Sigiriya",
            img: crearImagen("images/juegos/Lugares/sigiriya.png")
        },
        {
            nombre: "Isla de Pascua",
            img: crearImagen("images/juegos/Lugares/islaPascua.png")
        },
        {
            nombre: "Waitomo",
            img: crearImagen("images/juegos/Lugares/waitomo.png")
        },
        {
            nombre: "Pamukkale",
            img: crearImagen("images/juegos/Lugares/pamukkale.png")
        },
        {
            nombre: "Lago Moraine",
            img: crearImagen("images/juegos/Lugares/lagoMoraine.png")
        },
        {
            nombre: "Gran Buda",
            img: crearImagen("images/juegos/Lugares/granBuda.png")
        },
        {
            nombre: "Torres Petronas",
            img: crearImagen("images/juegos/Lugares/torresPetronas.png")
        },
        {
            nombre: "Shanghai World Financial Center",
            img: crearImagen("images/juegos/Lugares/shanghai.png")
        },
        {
            nombre: "Taipei 101",
            img: crearImagen("images/juegos/Lugares/taipei101.png")
        },
        {
            nombre: "Guangzhou CTF Finance Centre",
            img: crearImagen("images/juegos/Lugares/guangzhou.png")
        },
        {
            nombre: "Burj Al Arab",
            img: crearImagen("images/juegos/Lugares/Burj Al Arab.png")
        },
        {
            nombre: "Emirates Towers",
            img: crearImagen("images/juegos/Lugares/emiratesTower.png")
        },
        {
            nombre: "Parque Tayrona",
            img: crearImagen("images/juegos/Lugares/tayrona.png")
        },
        {
            nombre: "Ciudad Perdida",
            img: crearImagen("images/juegos/Lugares/ciudadPerdida.png")
        },
        {
            nombre: "Salto del angel",
            img: crearImagen("images/juegos/Lugares/saltoAngel.png")
        },
        {
            nombre: "Glaciar Perito Moreno",
            img: crearImagen("images/juegos/Lugares/glaciarPerito.png")
        },
        {
            nombre: "Desierto de Atacama",
            img: crearImagen("images/juegos/Lugares/desiertoAtacama.png")
        },
        {
            nombre: "Islas Galápagos",
            img: crearImagen("images/juegos/Lugares/islasGalapagos.png")
        },        
        {
            nombre: "Lago Atitlán",
            img: crearImagen("images/juegos/Lugares/lagoAtitlan.png")
        },
        {
            nombre: "Santuario de Las Lajas",
            img: crearImagen("images/juegos/Lugares/santuarioLajas.png")
        },
        {
            nombre: "Empire State",
            img: crearImagen("images/juegos/Lugares/empireState.png")
        },
        {
            nombre: "Golden Gate",
            img: crearImagen("images/juegos/Lugares/goldenGate.png")
        },
        {
            nombre: "Puerta de Brandenburgo",
            img: crearImagen("images/juegos/Lugares/puertaBrandenburgo.png")
        },
        {
            nombre: "Canal de Panamá",
            img: crearImagen("images/juegos/Lugares/canalPanama.png")
        },
        {
            nombre: "Catedral de Notre Dam",
            img: crearImagen("images/juegos/Lugares/catefralNotreDam.png")
        },
        {
            nombre: "Palacio de Nottingham",
            img: crearImagen("images/juegos/Lugares/palacioNottingham.png")
        },
        {
            nombre: "National Gallery",
            img: crearImagen("images/juegos/Lugares/nationalGallery.png")
        },        
        {
            nombre: "Catedral de Colonia",
            img: crearImagen("images/juegos/Lugares/catedralColonia.png")
        },
        {
            nombre: "Palacio de Versalles",
            img: crearImagen("images/juegos/Lugares/palacioVersalles.png")
        },
        {
            nombre: "Big Ben",
            img: crearImagen("images/juegos/Lugares/bigBen.png")
        },
        {
            nombre: "Basílica de San Basilio",
            img: crearImagen("images/juegos/Lugares/basilicaSanBasilio.png")
        },
        {
            nombre: "El Palacio de Nymphenburg",
            img: crearImagen("images/juegos/Lugares/palacioNymphenburg.png")
        },
        {
            nombre: "Potsdamer Platz",
            img: crearImagen("images/juegos/Lugares/potsmaderPlatz.png")
        },        
        {
            nombre: "Castillo de Egeskov",
            img: crearImagen("images/juegos/Lugares/castilloEgeskov.png")
        },
        {
            nombre: "Lago Bohinj",
            img: crearImagen("images/juegos/Lugares/lagoBohinj.png")
        },
        {
            nombre: "Caldera de Taburiente",
            img: crearImagen("images/juegos/Lugares/calderaTaburiente.png")
        },
        {
            nombre: "Ibón de Estanés",
            img: crearImagen("images/juegos/Lugares/ibonEstanes.png")
        },
        {
            nombre: "Torre Agbar",
            img: crearImagen("images/juegos/Lugares/torreAgbar.png")
        },
        {
            nombre: "Castillo de San Felipe",
            img: crearImagen("images/juegos/Lugares/castilloSanFelipe.png")
        },
        {
            nombre: "Arco de Triunfo",
            img: crearImagen("images/juegos/Lugares/arcoTriunfo.png")
        },
        {
            nombre: "Castillo de Chambord",
            img: crearImagen("images/juegos/Lugares/castilloChambord.png")
        },
        {
            nombre: "Puente del Gard",
            img: crearImagen("images/juegos/Lugares/puenteGard.png")
        },
        {
            nombre: "Iglesia de la Madeleine",
            img: crearImagen("images/juegos/Lugares/iglesiaMadeleine.png")
        },
        {
            nombre: "Olimpeion",
            img: crearImagen("images/juegos/Lugares/olimpeion.png")
        },
        {
            nombre: "Fontana de Trevi",
            img: crearImagen("images/juegos/Lugares/fontanaTrevi.png")
        },      
        {
            nombre: "Jaipur",
            img: crearImagen("images/juegos/Lugares/jaipur.png")
        },
        {
            nombre: "Cuevas de Ajanta",
            img: crearImagen("images/juegos/Lugares/cuevasAjanta.png")
        },
        {
            nombre: "Islas de Raja Ampat",
            img: crearImagen("images/juegos/Lugares/islasRajaAmpat.png")
        },        
        {
            nombre: "Tanah Lot",
            img: crearImagen("images/juegos/Lugares/tanahLot.png")
        },
        {
            nombre: "Masada",
            img: crearImagen("images/juegos/Lugares/masada.png")
        },
        {
            nombre: "Castillo Sant'Angelo",
            img: crearImagen("images/juegos/Lugares/castilloSantAngelo.png")
        },        
        {
            nombre: "Isfahan",
            img: crearImagen("images/juegos/Lugares/isfahan.png")
        },
        {
            nombre: "Fushimi Inari-Taisha",
            img: crearImagen("images/juegos/Lugares/fushimiInari.png")
        },
        {
            nombre: "Castillo Himeji",
            img: crearImagen("images/juegos/Lugares/castilloHimeji.png")
        },
        {
            nombre: "Palacio de Donggung",
            img: crearImagen("images/juegos/Lugares/palacioDonggung.png")
        },
        {
            nombre: "Villa Bukchon Hanok",
            img: crearImagen("images/juegos/Lugares/villaBukchon.png")
        },
        {
            nombre: "Luang Prabang",
            img: crearImagen("images/juegos/Lugares/luangPrabang.png")
        },
        {
            nombre: "Montañas Baekdu",
            img: crearImagen("images/juegos/Lugares/montañasBaekdu.png")
        },
        {
            nombre: "Langkawi",
            img: crearImagen("images/juegos/Lugares/langkawi.png")
        },        
        {
            nombre: "Monasterio Paro Taktsang",
            img: crearImagen("images/juegos/Lugares/monasterioParo.png")
        },
        {
            nombre: "Mezquita Sheikh Zayed ",
            img: crearImagen("images/juegos/Lugares/sheikhZayed.png")
        },
        {
            nombre: "Lhasa",
            img: crearImagen("images/juegos/Lugares/lhasa.png")
        },
        {
            nombre: "Sa Pa",
            img: crearImagen("images/juegos/Lugares/sapa.png")
        },        
        {
            nombre: "Bahía Ha Long",
            img: crearImagen("images/juegos/Lugares/bahiaHalong.png")
        },
        {
            nombre: "Taroko",
            img: crearImagen("images/juegos/Lugares/taroko.png")
        },
        {
            nombre: "Desierto Gobi",
            img: crearImagen("images/juegos/Lugares/desiertoGobi.png")
        },        
        {
            nombre: "Socotra",
            img: crearImagen("images/juegos/Lugares/socotra.png")
        },
        {
            nombre: "Jiufen",
            img: crearImagen("images/juegos/Lugares/jiufen.png")
        },
        {
            nombre: "Cueva de las Flautas de Caña",
            img: crearImagen("images/juegos/Lugares/cuevaFlautas.png")
        },
        {
            nombre: "Lago Hillier",
            img: crearImagen("images/juegos/Lugares/lagoHillier.png")
        },
        {
            nombre: "K2",
            img: crearImagen("images/juegos/Lugares/k2.png")
        },
        {
            nombre: "Kanchenjunga",
            img: crearImagen("images/juegos/Lugares/kanchenjunga.png")
        },
        {
            nombre: "Lhotse",
            img: crearImagen("images/juegos/Lugares/lhotse.png")
        },
        {
            nombre: "Makalu",
            img: crearImagen("images/juegos/Lugares/makalu.png")
        },
        {
            nombre: "Cho Oyu",
            img: crearImagen("images/juegos/Lugares/choOyu.png")
        },
        {
            nombre: "Dhaulagirí",
            img: crearImagen("images/juegos/Lugares/dhaulagiri.png")
        },
        {
            nombre: "Manaslu",
            img: crearImagen("images/juegos/Lugares/manaslu.png")
        },
        {
            nombre: "Nanga Parbat",
            img: crearImagen("images/juegos/Lugares/nangaParbat.png")
        },
        {
            nombre: "Annapurna",
            img: crearImagen("images/juegos/Lugares/annapurna.png")
        },
        {
            nombre: "Gasherbrum",
            img: crearImagen("images/juegos/Lugares/gasherbrum.png")
        },
        {
            nombre: "Broad Peak",
            img: crearImagen("images/juegos/Lugares/broadPeak.png")
        },
        {
            nombre: "Shisha Pangma",
            img: crearImagen("images/juegos/Lugares/shishaPangma.png")
        },
        {
            nombre: "Novarupta",
            img: crearImagen("images/juegos/Lugares/novarupta.png")
        },
        {
            nombre: "Monte Santa Helena",
            img: crearImagen("images/juegos/Lugares/monteSantaHelena.png")
        },
        {
            nombre: "Monte Rainier",
            img: crearImagen("images/juegos/Lugares/monteRainier.png")
        },
        {
            nombre: "Etna",
            img: crearImagen("images/juegos/Lugares/etna.png")
        },
        {
            nombre: "Monte Merapi",
            img: crearImagen("images/juegos/Lugares/monteMerapi.png")
        },
        {
            nombre: "Monte Agung",
            img: crearImagen("images/juegos/Lugares/monteAgung.png")
        },
        {
            nombre: "Monte Nyiragongo",
            img: crearImagen("images/juegos/Lugares/monteNyiragongo.png")
        },
        {
            nombre: "Lago Louise",
            img: crearImagen("images/juegos/Lugares/lagoLouise.png")
        },
        {
            nombre: "Montaña de la Mesa",
            img: crearImagen("images/juegos/Lugares/montañaMesa.png")
        },
        {
            nombre: "Isla de Jeju",
            img: crearImagen("images/juegos/Lugares/islaJeju.png")
        },
        {
            nombre: "Cañón del Chicamocha",
            img: crearImagen("images/juegos/Lugares/cañonChicamocha.png")
        },
        {
            nombre: "Desierto de Namibia",
            img: crearImagen("images/juegos/Lugares/desiertoNamibia.png")
        },
        {
            nombre: "Lalibela",
            img: crearImagen("images/juegos/Lugares/lalibela.png")
        },
        {
            nombre: "Cráter del Ngorongoro",
            img: crearImagen("images/juegos/Lugares/craterNgorongoro.png")
        },
        {
            nombre: "Lago Nakuru",
            img: crearImagen("images/juegos/Lugares/lagoNakuru.png")
        },
        {
            nombre: "Chott el Jerid",
            img: crearImagen("images/juegos/Lugares/chottJerid.png")
        },
        {
            nombre: "Sidi Bou Said",
            img: crearImagen("images/juegos/Lugares/sidiBou.png")
        },
        {
            nombre: "Djenne",
            img: crearImagen("images/juegos/Lugares/djenne.png")
        },
        {
            nombre: "Lago Malawi",
            img: crearImagen("images/juegos/Lugares/lagoMalawi.png")
        },        
        {
            nombre: "La Avenida de los Baobabs",
            img: crearImagen("images/juegos/Lugares/avenidaBaobabs.png")
        }
        

    ]
}