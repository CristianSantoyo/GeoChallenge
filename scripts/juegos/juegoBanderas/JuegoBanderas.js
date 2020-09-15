class JuegoBanderas extends Juego {
    banderas = [];    
    
    constructor(orquestador,domMensajes){
        super(orquestador, domMensajes);
        for (var i=0, j=0; i < 9; i++, j++){
            this.banderas.push(new Banderas(130, 87));
            this.banderas[i].setCoordenadas(119 + (170*j), 300);
            if (j == 2) j=0;
        }
        this.controlador = new JBController(this);
        this.enunciado = new Enunciado(199,0, "", 350, 102);
        //console.log(this.banderas)
    }

    iniciar() {
        this.canvas.show("fade", 900);

        this.cargarSonidos();
        this.cargarImagenes("images/juegos/fondoBanderas.png");
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
        for (var i = 0; i < this.opcPosibles; i++){
            n = Math.floor((Math.random() * this.rango))
            
            while(aux.includes(n)) n = Math.floor((Math.random() * this.rango))            
            
            let pais = this.paises[n];            
            this.banderas[i].setPais(pais);            
            aux.push(n)
        }

        this.pregunta = !this.hardcore ? 
        this.banderas[Math.floor((Math.random() * this.opcPosibles))].valor
        : this.banderas[aux.indexOf(Math.max(...aux))].valor
        
        this.enunciado.setEnunciado(this.pregunta, this.pregunta,null);
        this.tiempoPregunta = 450;
    }

    seleccionarOpcion(bandera){        
        if (bandera.valor == this.enunciado.texto){
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
                this.opcPosibles = 4;
                this.banderas[0].setCoordenadas(165, 270);
                this.banderas[1].setCoordenadas(405,270);
                this.banderas[2].setCoordenadas(165,400);
                this.banderas[3].setCoordenadas(405,400);
                this.rango = 70;
                break;
            case 7:
                for (var i=0, j=0; i < 3; i++, j++){
                    this.banderas[i].setCoordenadas(119 + (170*j), 270);
                }
                for (var i=3, j=0; i < 6; i++, j++){
                    this.banderas[i].setCoordenadas(119 + (170*j), 400);
                }
                this.opcPosibles = 6;
                this.rango = 100;
                break;
            case 9:                
                this.rango = 150;
                break;
            case 12:                
                this.rango = 200;
                break;
            case 16:                
                this.rango = this.paises.length;
                break;
            case 22:
                for (var i=0, j=0; i < 3; i++, j++){
                    this.banderas[i].setCoordenadas(119 + (170*j), 265);
                }
                for (var i=3, j=0; i < 6; i++, j++){
                    this.banderas[i].setCoordenadas(119 + (170*j), 390);
                }
                for (var i=6, j=0; i < 9; i++, j++){
                    this.banderas[i].setCoordenadas(119 + (170*j), 515);
                }
                this.opcPosibles = 9;
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

        if (this.inicio){
            contextoBuffer.drawImage(this.imgTiempoBarra, 128, 218, this.tiempoPregunta, 20);
            contextoBuffer.drawImage(this.imgMarcoTiempo, 120, 210);
            this.enunciado.dibujar(contextoBuffer);
            for (var i = 0; i < this.opcPosibles; i++){
                this.banderas[i].dibujar(contextoBuffer);            
            }
        }        
        
        contextoBuffer.textAlign = "left";
        contextoBuffer.font = "bold 30px superCell";
        contextoBuffer.fillText(this.tiempo, 625, 40);

        contextoBuffer.textAlign = "center";
        contextoBuffer.fillText(this.puntaje, 250, 690);
        // Modificar Buffer
        contexto.clearRect(0,0,this.canvas[0].width, this.canvas[0].height);
	    contexto.drawImage(buffer,0,0);	
    }

    
    
    paises = [
        {
            nombre: "Francia",
            img: crearImagen("images/juegos/Banderas/fr.png")
        },
        {
            nombre: "Estados Unidos",
            img: crearImagen("images/juegos/Banderas/us.png")
        },
        {
            nombre: "Canadá",
            img: crearImagen("images/juegos/Banderas/ca.png")
        },
        {
            nombre: "Argentina",
            img: crearImagen("images/juegos/Banderas/ar.png")
        },
        {
            nombre: "Alemania",
            img: crearImagen("images/juegos/Banderas/de.png")
        },
        {
            nombre: "México",
            img: crearImagen("images/juegos/Banderas/mx.png")
        },
        {
            nombre: "Italia",
            img: crearImagen("images/juegos/Banderas/it.png")
        },
        {
            nombre: "España",
            img: crearImagen("images/juegos/Banderas/es.png")
        },
        {
            nombre: "China",
            img: crearImagen("images/juegos/Banderas/cn.png")
        },
        {
            nombre: "Portugal",
            img: crearImagen("images/juegos/Banderas/pt.png")
        },
        {
            nombre: "Rusia",
            img: crearImagen("images/juegos/Banderas/ru.png")
        },
        {
            nombre: "Chile",
            img: crearImagen("images/juegos/Banderas/cl.png")
        },
        {
            nombre: "Japón",
            img: crearImagen("images/juegos/Banderas/jp.png")
        },
        {
            nombre: "Australia",
            img: crearImagen("images/juegos/Banderas/au.png")
        },
        {
            nombre: "Brasil",
            img: crearImagen("images/juegos/Banderas/br.png")
        },
        {
            nombre: "Grecia",
            img: crearImagen("images/juegos/Banderas/gr.png")
        },
        {
            nombre: "Suecia",
            img: crearImagen("images/juegos/Banderas/se.png")
        },
        {
            nombre: "Reino Unido",
            img: crearImagen("images/juegos/Banderas/gb.png")
        },
        {
            nombre: "Marruecos",
            img: crearImagen("images/juegos/Banderas/ma.png")
        },
        {
            nombre: "Inglaterra",
            img: crearImagen("images/juegos/Banderas/gb-eng.png")
        },
        {
            nombre: "Escocia",
            img: crearImagen("images/juegos/Banderas/gb-sct.png")
        },
        {
            nombre: "Irlanda del Norte",
            img: crearImagen("images/juegos/Banderas/gb-nir.png")
        },
        {
            nombre: "Gales",
            img: crearImagen("images/juegos/Banderas/gb-wls.png")
        },
        {
            nombre: "Egipto",
            img: crearImagen("images/juegos/Banderas/eg.png")
        },
        {
            nombre: "India",
            img: crearImagen("images/juegos/Banderas/in.png")
        },
        {
            nombre: "Irlanda",
            img: crearImagen("images/juegos/Banderas/ie.png")
        },
        {
            nombre: "Cuba",
            img: crearImagen("images/juegos/Banderas/cu.png")
        },
        {
            nombre: "Jamaica",
            img: crearImagen("images/juegos/Banderas/jm.png")
        },
        {
            nombre: "Antártida",
            img: crearImagen("images/juegos/Banderas/aq.png")
        },
        {
            nombre: "Finlandia",
            img: crearImagen("images/juegos/Banderas/fi.png")
        },
        {
            nombre: "Perú",
            img: crearImagen("images/juegos/Banderas/pe.png")
        },
        {
            nombre: "Andorra",
            img: crearImagen("images/juegos/Banderas/ad.png")
        },
        {
            nombre: "Sudafrica",
            img: crearImagen("images/juegos/Banderas/za.png")
        },
        {
            nombre: "Noruega",
            img: crearImagen("images/juegos/Banderas/no.png")
        },
        {
            nombre: "Venezuela",
            img: crearImagen("images/juegos/Banderas/ve.png")
        },
        {
            nombre: "Colombia",
            img: crearImagen("images/juegos/Banderas/co.png")
        },
        {
            nombre: "Polonia",
            img: crearImagen("images/juegos/Banderas/pl.png")
        },
        {
            nombre: "Suiza",
            img: crearImagen("images/juegos/Banderas/ch.png")
        },
        {
            nombre: "Irak",
            img: crearImagen("images/juegos/Banderas/iq.png")
        },
        {
            nombre: "Irán",
            img: crearImagen("images/juegos/Banderas/ir.png")
        },
        {
            nombre: "Dinamarca",
            img: crearImagen("images/juegos/Banderas/dk.png")
        },
        {
            nombre: "Corea del Sur",
            img: crearImagen("images/juegos/Banderas/kr.png")
        },
        {
            nombre: "Uruguay",
            img: crearImagen("images/juegos/Banderas/uy.png")
        },
        {
            nombre: "Corea del Norte",
            img: crearImagen("images/juegos/Banderas/kp.png")
        },
        {
            nombre: "Turquía",
            img: crearImagen("images/juegos/Banderas/tr.png")
        },
        {
            nombre: "Hong Kong",
            img: crearImagen("images/juegos/Banderas/hk.png")
        },
        {
            nombre: "Paraguay",
            img: crearImagen("images/juegos/Banderas/py.png")
        },
        {
            nombre: "Nueva Zelanda",
            img: crearImagen("images/juegos/Banderas/nz.png")
        },
        {
            nombre: "Israel",
            img: crearImagen("images/juegos/Banderas/il.png")
        },
        {
            nombre: "Países Bajos",
            img: crearImagen("images/juegos/Banderas/nl.png")
        },
        {
            nombre: "Bélgica",
            img: crearImagen("images/juegos/Banderas/be.png")
        },
        {
            nombre: "Ecuador",
            img: crearImagen("images/juegos/Banderas/ec.png")
        },
        {
            nombre: "Lituania",
            img: crearImagen("images/juegos/Banderas/lt.png")
        },
        {
            nombre: "República Checa",
            img: crearImagen("images/juegos/Banderas/cz.png")
        },
        {
            nombre: "Austria",
            img: crearImagen("images/juegos/Banderas/at.png")
        },
        {
            nombre: "Groenlandia",
            img: crearImagen("images/juegos/Banderas/gl.png")
        },
        {
            nombre: "Estonia",
            img: crearImagen("images/juegos/Banderas/ee.png")
        },
        {
            nombre: "Pakistán",
            img: crearImagen("images/juegos/Banderas/pk.png")
        },
        {
            nombre: "Letonia",
            img: crearImagen("images/juegos/Banderas/lv.png")
        },
        {
            nombre: "Croacia",
            img: crearImagen("images/juegos/Banderas/hr.png")
        },
        {
            nombre: "Afganistán",
            img: crearImagen("images/juegos/Banderas/af.png")
        },
        {
            nombre: "Islandia",
            img: crearImagen("images/juegos/Banderas/is.png")
        },
        {
            nombre: "Bolivia",
            img: crearImagen("images/juegos/Banderas/bo.png")
        },
        {
            nombre: "Rumanía",
            img: crearImagen("images/juegos/Banderas/ro.png")
        },
        {
            nombre: "Panamá",
            img: crearImagen("images/juegos/Banderas/pa.png")
        },
        {
            nombre: "Ucrania",
            img: crearImagen("images/juegos/Banderas/ua.png")
        },
        {
            nombre: "Mongolia",
            img: crearImagen("images/juegos/Banderas/mn.png")
        },
        {
            nombre: "Argelia",
            img: crearImagen("images/juegos/Banderas/dz.png")
        },
        {
            nombre: "Luxemburgo",
            img: crearImagen("images/juegos/Banderas/lu.png")
        },
        {
            nombre: "Arabia Saudita",
            img: crearImagen("images/juegos/Banderas/sa.png")
        },
        {
            nombre: "Ciudad del Vaticano",
            img: crearImagen("images/juegos/Banderas/va.png")
        },
        {
            nombre: "Serbia",
            img: crearImagen("images/juegos/Banderas/rs.png")
        },
        {
            nombre: "Vietnam",
            img: crearImagen("images/juegos/Banderas/vn.png")
        },
        {
            nombre: "Chipre",
            img: crearImagen("images/juegos/Banderas/cy.png")
        },
        {
            nombre: "Eslovaquia",
            img: crearImagen("images/juegos/Banderas/sk.png")
        },
        {
            nombre: "Somalia",
            img: crearImagen("images/juegos/Banderas/so.png")
        },
        {
            nombre: "Madagascar",
            img: crearImagen("images/juegos/Banderas/mg.png")
        },
        {
            nombre: "Libia",
            img: crearImagen("images/juegos/Banderas/ly.png")
        },
        {
            nombre: "Túnez",
            img: crearImagen("images/juegos/Banderas/tn.png")
        },
        {
            nombre: "Armenia",
            img: crearImagen("images/juegos/Banderas/am.png")
        },
        {
            nombre: "Albania",
            img: crearImagen("images/juegos/Banderas/al.png")
        },
        {
            nombre: "Bulgaria",
            img: crearImagen("images/juegos/Banderas/bg.png")
        },
        {
            nombre: "Indonesia",
            img: crearImagen("images/juegos/Banderas/id.png")
        },
        {
            nombre: "Siria",
            img: crearImagen("images/juegos/Banderas/sy.png")
        },
        {
            nombre: "Costa Rica",
            img: crearImagen("images/juegos/Banderas/cr.png")
        },
        {
            nombre: "Honduras",
            img: crearImagen("images/juegos/Banderas/hn.png")
        },
        {
            nombre: "Haití",
            img: crearImagen("images/juegos/Banderas/ht.png")
        },
        {
            nombre: "Nicaragua",
            img: crearImagen("images/juegos/Banderas/ni.png")
        },
        {
            nombre: "Hungría",
            img: crearImagen("images/juegos/Banderas/hu.png")
        },
        {
            nombre: "Níger",
            img: crearImagen("images/juegos/Banderas/ne.png")
        },
        {
            nombre: "Mónaco",
            img: crearImagen("images/juegos/Banderas/mc.png")
        },
        {
            nombre: "Sudán",
            img: crearImagen("images/juegos/Banderas/sd.png")
        },
        {
            nombre: "República de Macedonia",
            img: crearImagen("images/juegos/Banderas/mk.png")
        },
        {
            nombre: "Guinea",
            img: crearImagen("images/juegos/Banderas/gn.png")
        },
        {
            nombre: "Tailandia",
            img: crearImagen("images/juegos/Banderas/th.png")
        },
        {
            nombre: "Eslovenia",
            img: crearImagen("images/juegos/Banderas/si.png")
        },
        {
            nombre: "Malta",
            img: crearImagen("images/juegos/Banderas/mt.png")
        },
        {
            nombre: "Montenegro",
            img: crearImagen("images/juegos/Banderas/me.png")
        },
        {
            nombre: "El Salvador",
            img: crearImagen("images/juegos/Banderas/sv.png")
        },
        {
            nombre: "República Dominicana",
            img: crearImagen("images/juegos/Banderas/do.png")
        },
        {
            nombre: "Guatemala",
            img: crearImagen("images/juegos/Banderas/gt.png")
        },
        {
            nombre: "Filipinas",
            img: crearImagen("images/juegos/Banderas/ph.png")
        },
        {
            nombre: "Etiopía",
            img: crearImagen("images/juegos/Banderas/et.png")
        },
        {
            nombre: "Bielorrusia",
            img: crearImagen("images/juegos/Banderas/by.png")
        },
        {
            nombre: "Georgia",
            img: crearImagen("images/juegos/Banderas/ge.png")
        },
        {
            nombre: "Puerto Rico",
            img: crearImagen("images/juegos/Banderas/pr.png")
        },
        {
            nombre: "Nigeria",
            img: crearImagen("images/juegos/Banderas/ng.png")
        },
        {
            nombre: "Taiwán",
            img: crearImagen("images/juegos/Banderas/tw.png")
        },
        {
            nombre: "Belice",
            img: crearImagen("images/juegos/Banderas/bz.png")
        },
        {
            nombre: "San Marino",
            img: crearImagen("images/juegos/Banderas/sm.png")
        },
        {
            nombre: "Palestina",
            img: crearImagen("images/juegos/Banderas/ps.png")
        },
        {
            nombre: "Angola",
            img: crearImagen("images/juegos/Banderas/ao.png")
        },
        {
            nombre: "Kenia",
            img: crearImagen("images/juegos/Banderas/ke.png")
        },
        {
            nombre: "Malí",
            img: crearImagen("images/juegos/Banderas/ml.png")
        },
        {
            nombre: "Moldavia",
            img: crearImagen("images/juegos/Banderas/md.png")
        },
        {
            nombre: "Nepal",
            img: crearImagen("images/juegos/Banderas/np.png")
        },
        {
            nombre: "Yemen",
            img: crearImagen("images/juegos/Banderas/ye.png")
        },        
        {
            nombre: "Laos",
            img: crearImagen("images/juegos/Banderas/la.png")
        },
        {
            nombre: "Emiratos Árabes Unidos",
            img: crearImagen("images/juegos/Banderas/ae.png")
        },
        {
            nombre: "Uzbekistán",
            img: crearImagen("images/juegos/Banderas/uz.png")
        },
        {
            nombre: "Catar",
            img: crearImagen("images/juegos/Banderas/qa.png")
        },
        {
            nombre: "Birmania",
            img: crearImagen("images/juegos/Banderas/mm.png")
        },
        {
            nombre: "Camerún",
            img: crearImagen("images/juegos/Banderas/cm.png")
        },
        {
            nombre: "Líbano",
            img: crearImagen("images/juegos/Banderas/lb.png")
        },
        {
            nombre: "Costa de Marfil",
            img: crearImagen("images/juegos/Banderas/ci.png")
        },
        {
            nombre: "Guyana",
            img: crearImagen("images/juegos/Banderas/gy.png")
        },
        {
            nombre: "Guyana Francesa",
            img: crearImagen("images/juegos/Banderas/gf.png")
        },
        {
            nombre: "Chad",
            img: crearImagen("images/juegos/Banderas/td.png")
        },
        {
            nombre: "Senegal",
            img: crearImagen("images/juegos/Banderas/sn.png")
        },
        {
            nombre: "Malasia",
            img: crearImagen("images/juegos/Banderas/my.png")
        },
        {
            nombre: "Kazajistán",
            img: crearImagen("images/juegos/Banderas/kz.png")
        },
        {
            nombre: "Uganda",
            img: crearImagen("images/juegos/Banderas/ug.png")
        },
        {
            nombre: "Bosnia y Herzegovina",
            img: crearImagen("images/juegos/Banderas/ba.png")
        },
        {
            nombre: "Guinea Ecuatorial",
            img: crearImagen("images/juegos/Banderas/gq.png")
        },
        {
            nombre: "Jordania",
            img: crearImagen("images/juegos/Banderas/jo.png")
        },
        {
            nombre: "Omán",
            img: crearImagen("images/juegos/Banderas/om.png")
        },
        {
            nombre: "Sri Lanka",
            img: crearImagen("images/juegos/Banderas/lk.png")
        },
        {
            nombre: "Tanzania",
            img: crearImagen("images/juegos/Banderas/tz.png")
        },
        {
            nombre: "República del Congo",
            img: crearImagen("images/juegos/Banderas/cg.png")
        },
        {
            nombre: "Surinam",
            img: crearImagen("images/juegos/Banderas/sr.png")
        },
        {
            nombre: "Camboya",
            img: crearImagen("images/juegos/Banderas/kh.png")
        },
        {
            nombre: "Mauritania",
            img: crearImagen("images/juegos/Banderas/mr.png")
        },
        {
            nombre: "Kuwait",
            img: crearImagen("images/juegos/Banderas/kw.png")
        },
        {
            nombre: "Mozambique",
            img: crearImagen("images/juegos/Banderas/mz.png")
        },
        {
            nombre: "Ruanda",
            img: crearImagen("images/juegos/Banderas/rw.png")
        },
        {
            nombre: "Zambia",
            img: crearImagen("images/juegos/Banderas/zm.png")
        },
        {
            nombre: "Namibia",
            img: crearImagen("images/juegos/Banderas/na.png")
        },
        {
            nombre: "Kosovo",
            img: crearImagen("images/juegos/Banderas/xk.png")
        },
        {
            nombre: "República Democrática del Congo",
            img: crearImagen("images/juegos/Banderas/cd.png")
        },
        {
            nombre: "Azerbaiyán",
            img: crearImagen("images/juegos/Banderas/az.png")
        },
        {
            nombre: "Trinidad y Tobago",
            img: crearImagen("images/juegos/Banderas/tt.png")
        },
        {
            nombre: "Togo",
            img: crearImagen("images/juegos/Banderas/tg.png")
        },
        {
            nombre: "Ghana",
            img: crearImagen("images/juegos/Banderas/gh.png")
        },
        {
            nombre: "Liberia",
            img: crearImagen("images/juegos/Banderas/lr.png")
        },
        {
            nombre: "Bután",
            img: crearImagen("images/juegos/Banderas/bt.png")
        },
        {
            nombre: "Turkmenistán",
            img: crearImagen("images/juegos/Banderas/tm.png")
        },
        {
            nombre: "Bagladés",
            img: crearImagen("images/juegos/Banderas/bd.png")
        },
        {
            nombre: "Zimbabue",
            img: crearImagen("images/juegos/Banderas/zw.png")
        },
        {
            nombre: "Antigua y Barbuda",
            img: crearImagen("images/juegos/Banderas/ag.png")
        },
        {
            nombre: "Liechtenstein",
            img: crearImagen("images/juegos/Banderas/li.png")
        },
        {
            nombre: "Eritrea",
            img: crearImagen("images/juegos/Banderas/er.png")
        },
        {
            nombre: "Singapur",
            img: crearImagen("images/juegos/Banderas/sg.png")
        },
        {
            nombre: "Bahamas",
            img: crearImagen("images/juegos/Banderas/bs.png")
        },
        {
            nombre: "Papúa Nueva Guinea",
            img: crearImagen("images/juegos/Banderas/pg.png")
        },
        {
            nombre: "Cabo Verde",
            img: crearImagen("images/juegos/Banderas/cv.png")
        },
        {
            nombre: "Guam",
            img: crearImagen("images/juegos/Banderas/gu.png")
        },
        {
            nombre: "Isla de Man",
            img: crearImagen("images/juegos/Banderas/im.png")
        },
        {
            nombre: "Jersey",
            img: crearImagen("images/juegos/Banderas/je.png")
        },
        {
            nombre: "Islas Caimán",
            img: crearImagen("images/juegos/Banderas/ky.png")
        },
        {
            nombre: "Macao",
            img: crearImagen("images/juegos/Banderas/mo.png")
        },
        {
            nombre: "Gabón",
            img: crearImagen("images/juegos/Banderas/ga.png")
        },
        {
            nombre: "Gambia",
            img: crearImagen("images/juegos/Banderas/gm.png")
        },
        {
            nombre: "Guinea-Bissau",
            img: crearImagen("images/juegos/Banderas/gw.png")
        },
        {
            nombre: "Lesoto",
            img: crearImagen("images/juegos/Banderas/ls.png")
        },
        {
            nombre: "Sudán del Sur",
            img: crearImagen("images/juegos/Banderas/ss.png")
        },
        {
            nombre: "Fiyi",
            img: crearImagen("images/juegos/Banderas/fj.png")
        },
        {
            nombre: "Burundi",
            img: crearImagen("images/juegos/Banderas/bi.png")
        },
        {
            nombre: "Bermuda",
            img: crearImagen("images/juegos/Banderas/bm.png")
        },
        {
            nombre: "Bonaire",
            img: crearImagen("images/juegos/Banderas/bq.png")
        },        
        {
            nombre: "Isla de Navidad",
            img: crearImagen("images/juegos/Banderas/cx.png")
        },
        {
            nombre: "Islas Malvinas",
            img: crearImagen("images/juegos/Banderas/fk.png")
        },
        {
            nombre: "Islas Feroe",
            img: crearImagen("images/juegos/Banderas/fo.png")
        },
        {
            nombre: "Granada",
            img: crearImagen("images/juegos/Banderas/gd.png")
        },
        {
            nombre: "Benín",
            img: crearImagen("images/juegos/Banderas/bj.png")
        },
        {
            nombre: "Sahara Oriental",
            img: crearImagen("images/juegos/Banderas/eh.png")
        },
        {
            nombre: "Baréin",
            img: crearImagen("images/juegos/Banderas/bh.png")
        },
        {
            nombre: "Suazilandia",
            img: crearImagen("images/juegos/Banderas/sz.png")
        },
        {
            nombre: "Brunéi",
            img: crearImagen("images/juegos/Banderas/bn.png")
        },
        {
            nombre: "Seychelles",
            img: crearImagen("images/juegos/Banderas/sc.png")
        },
        {
            nombre: "Malawi",
            img: crearImagen("images/juegos/Banderas/mw.png")
        },
        {
            nombre: "Anguila",
            img: crearImagen("images/juegos/Banderas/ai.png")
        },
        {
            nombre: "Samoa Americana",
            img: crearImagen("images/juegos/Banderas/as.png")
        },
        {
            nombre: "Aruba",
            img: crearImagen("images/juegos/Banderas/aw.png")
        },
        {
            nombre: "Isla Bouvet",
            img: crearImagen("images/juegos/Banderas/bv.png")
        },
        {
            nombre: "Islas Cocos",
            img: crearImagen("images/juegos/Banderas/cc.png")
        },
        {
            nombre: "Islas Cook",
            img: crearImagen("images/juegos/Banderas/ck.png")
        },
        {
            nombre: "Curazao",
            img: crearImagen("images/juegos/Banderas/cw.png")
        },
        {
            nombre: "Samoa",
            img: crearImagen("images/juegos/Banderas/ws.png")
        },
        {
            nombre: "Yibuti",
            img: crearImagen("images/juegos/Banderas/dj.png")
        },
        {
            nombre: "Kirguistán",
            img: crearImagen("images/juegos/Banderas/kg.png")
        },
        {
            nombre: "Dominica",
            img: crearImagen("images/juegos/Banderas/dm.png")
        },
        {
            nombre: "Maldivas",
            img: crearImagen("images/juegos/Banderas/mv.png")
        },
        {
            nombre: "Tonga",
            img: crearImagen("images/juegos/Banderas/to.png")
        },
        {
            nombre: "Vanuatu",
            img: crearImagen("images/juegos/Banderas/vu.png")
        },
        {
            nombre: "Timor Oriental",
            img: crearImagen("images/juegos/Banderas/tl.png")
        },
        {
            nombre: "Islas Marshall",
            img: crearImagen("images/juegos/Banderas/mh.png")
        },
        {
            nombre: "Mauricio",
            img: crearImagen("images/juegos/Banderas/mu.png")
        },
        {
            nombre: "Islas Salomón",
            img: crearImagen("images/juegos/Banderas/sb.png")
        },
        {
            nombre: "Santa Lucía",
            img: crearImagen("images/juegos/Banderas/lc.png")
        },
        {
            nombre: "Comoras",
            img: crearImagen("images/juegos/Banderas/km.png")
        },
        {
            nombre: "Kiribati",
            img: crearImagen("images/juegos/Banderas/ki.png")
        },
        {
            nombre: "Santo Tomé y Príncipe",
            img: crearImagen("images/juegos/Banderas/st.png")
        },
        {
            nombre: "Nauru",
            img: crearImagen("images/juegos/Banderas/nr.png")
        },
        {
            nombre: "Palaos",
            img: crearImagen("images/juegos/Banderas/pw.png")
        },
        {
            nombre: "San Vicente y las Granadinas",
            img: crearImagen("images/juegos/Banderas/vc.png")
        },
        {
            nombre: "San Cristóbal y Nieves",
            img: crearImagen("images/juegos/Banderas/kn.png")
        },
        {
            nombre: "Niue",
            img: crearImagen("images/juegos/Banderas/nu.png")
        },
        {
            nombre: "Tahití",
            img: crearImagen("images/juegos/Banderas/pf.png")
        },
        {
            nombre: "Islas Pitcairn",
            img: crearImagen("images/juegos/Banderas/pn.png")
        },
        {
            nombre: "Santa Helena",
            img: crearImagen("images/juegos/Banderas/sh.png")
        },
        {
            nombre: "San Martín",
            img: crearImagen("images/juegos/Banderas/sx.png")
        },
        {
            nombre: "Turcas y Caicos",
            img: crearImagen("images/juegos/Banderas/tc.png")
        },
        {
            nombre: "Guernsey",
            img: crearImagen("images/juegos/Banderas/gg.png")
        },
        {
            nombre: "Gibraltar",
            img: crearImagen("images/juegos/Banderas/gi.png")
        },
        {
            nombre: "Guadalupe",
            img: crearImagen("images/juegos/Banderas/gp.png")
        },
        {
            nombre: "Islas Georgias del Sur",
            img: crearImagen("images/juegos/Banderas/gs.png")
        },        
        {
            nombre: "Islas Marianas del Norte",
            img: crearImagen("images/juegos/Banderas/mp.png")
        },
        {
            nombre: "Martinica",
            img: crearImagen("images/juegos/Banderas/mq.png")
        },
        {
            nombre: "Montserrat",
            img: crearImagen("images/juegos/Banderas/ms.png")
        },
        {
            nombre: "Nueva Caledonia",
            img: crearImagen("images/juegos/Banderas/nc.png")
        },
        {
            nombre: "Isla Norfolk",
            img: crearImagen("images/juegos/Banderas/nf.png")
        },
        {
            nombre: "Islas Åland ",
            img: crearImagen("images/juegos/Banderas/ax.png")
        },
        {
            nombre: "San Bartolomé",
            img: crearImagen("images/juegos/Banderas/bl.png")
        },
        {
            nombre: "Tayikistán",
            img: crearImagen("images/juegos/Banderas/tj.png")
        },
        {
            nombre: "Tuvalu",
            img: crearImagen("images/juegos/Banderas/tv.png")
        },
        {
            nombre: "Barbados",
            img: crearImagen("images/juegos/Banderas/bb.png")
        },
        {
            nombre: "República Centroafricana",
            img: crearImagen("images/juegos/Banderas/cf.png")
        },
        {
            nombre: "Sierra Leona",
            img: crearImagen("images/juegos/Banderas/sl.png")
        },
        {
            nombre: "Botsuana",
            img: crearImagen("images/juegos/Banderas/bw.png")
        },
        {
            nombre: "Burkina Faso",
            img: crearImagen("images/juegos/Banderas/bf.png")
        },
        {
            nombre: "Micronesia",
            img: crearImagen("images/juegos/Banderas/fm.png")
        },
    ]
}



