let preguntas = [
    {pregunta:"¿Cuál es su nombre?",respuesta:"Emilio Batista"},
    {pregunta:"¿Cuántas esposas tiene Emilio?",respuesta:"3"},
    {pregunta:"¿Cuál es su personaje favorito de One Piece?",respuesta:"Luffy"},
    {pregunta:"¿Qué es mejor, backend o frontend?",respuesta:"backend"},
    {pregunta:"¿Cuándo cumple años Emilio?",respuesta:"29 de febrero"}
];

let indice = 0;
let bossKeyHandler = null;

function empezar(){
    mostrarPregunta();
}

function mostrarPregunta(){

    document.getElementById("contenido").innerHTML = `
    <h2>${preguntas[indice].pregunta}</h2>

    <input type="text" id="respuesta">
    <br>
    <button onclick="verificar()">Responder</button>

    <div id="feedback"></div>

    <img id="emilioImg" src="emilio_triste.png" width="200">
    `;
}

function verificar(){
    let user = document.getElementById("respuesta").value.toLowerCase().trim();
    let correcta = preguntas[indice].respuesta.toLowerCase();
    let img = document.getElementById("emilioImg");
    let feedback = document.getElementById("feedback");

    if(user === correcta){
        img.src="emilio_feliz.png";
        feedback.innerHTML="<h3>Correcto. Emilio está orgulloso.</h3>";

        setTimeout(()=>{
            indice++;
            if(indice < preguntas.length){
                mostrarPregunta();
            } else {
                iniciarBoss();
            }
        },1500);

    }else{
        img.src="emilio_triste.png";
        feedback.innerHTML="<h3 style='color:red;'>Incorrecto. Emilio está decepcionado...</h3>";
    }
}

function iniciarBoss(){

    if(bossKeyHandler){
        document.removeEventListener("keydown", bossKeyHandler);
        bossKeyHandler = null;
    }

    document.body.innerHTML=`
    <h1>EMILIO FINAL BOSS</h1>
    <img src="emilio_triste.png" width="150">
    <p>Sobrevive 20 segundos...</p>
    <canvas id="gameCanvas" width="600" height="400" style="background:black;border:2px solid white;"></canvas>
    <div id="estado"></div>
    `;

    let canvas=document.getElementById("gameCanvas");
    let ctx=canvas.getContext("2d");

    let jugador={x:280,y:180,size:20};
    let enemigos=[];
    let rayos=[];
    let tiempo=0;
    let juegoActivo=false;

    bossKeyHandler = function(e){
        let key = e.key.toLowerCase();

        if(key==="a" && jugador.x>0) jugador.x-=15;
        if(key==="d" && jugador.x<580) jugador.x+=15;
        if(key==="w" && jugador.y>0) jugador.y-=15;
        if(key==="s" && jugador.y<380) jugador.y+=15;
    };

    document.addEventListener("keydown", bossKeyHandler);

    function mostrarReintentar(){
        document.getElementById("estado").innerHTML = `
        <h2 style="color:red;">HAS SIDO DERROTADO</h2>
        <button onclick="iniciarBoss()"
        style="
        padding:15px 30px;
        font-size:20px;
        cursor:pointer;
        margin-top:20px;
        ">
        REINTENTAR
        </button>
        `;
    }

    function crearEnemigo(){
        let lado=Math.random()<0.5?"izquierda":"derecha";

        enemigos.push({
            lado:lado,
            x:lado==="izquierda" ? 0 : 580,
            y:Math.random()*380,
            size:20,
            speed:3
        });
    }

    function crearRayo(){

        // Ráfagas múltiples
        let cantidad = Math.floor(Math.random()*2)+1;

        for(let i=0;i<cantidad;i++){
            rayos.push({
                x:Math.random()*580,
                y:-80,
                size:10 + Math.random()*10,
                height:30 + Math.random()*30,
                speed:2 + Math.random()*2
            });
        }
    }

    function detectar(a,b){
        return a.x<b.x+b.size &&
               a.x+a.size>b.x &&
               a.y<b.y+b.size &&
               a.y+a.size>b.y;
    }

    function actualizar(){

        if(!juegoActivo) return;

        ctx.clearRect(0,0,600,400);

        // Jugador
        ctx.fillStyle="white";
        ctx.fillRect(jugador.x,jugador.y,jugador.size,jugador.size);

        // Generar enemigos laterales
        if(Math.random()<0.03) crearEnemigo();

        // Rayos
        if(Math.random()<0.025) crearRayo();

        // Enemigos laterales
        ctx.fillStyle="red";

        enemigos.forEach(e=>{
            if(e.lado==="izquierda"){
                e.x+=e.speed;
            }else{
                e.x-=e.speed;
            }

            ctx.fillRect(e.x,e.y,e.size,e.size);

            if(detectar(jugador,{x:e.x,y:e.y,size:e.size})){
                juegoActivo=false;
                mostrarReintentar();
            }
        });

        // Rayos rápidos y múltiples
        ctx.fillStyle="yellow";

        rayos.forEach(r=>{
            r.y+=r.speed;

            ctx.fillRect(r.x,r.y,r.size,r.height);

            if(detectar(jugador,{x:r.x,y:r.y,size:r.size})){
                juegoActivo=false;
                mostrarReintentar();
            }
        });

        // Escalar dificultad cada 5 segundos
        tiempo++;

        if(tiempo%300===0){
            enemigos.forEach(e=>e.speed+=0.5);
            rayos.forEach(r=>r.speed+=0.5);
        }

        if(tiempo>1200 && juegoActivo){
            juegoActivo=false;
            mostrarPreguntaFinal();
        }

        requestAnimationFrame(actualizar);
    }

    let countdown = 3;

    function mostrarCountdown(){

        ctx.clearRect(0,0,600,400);

        ctx.fillStyle="white";
        ctx.font="90px Arial";
        ctx.textAlign="center";

        if(countdown > 0){
            ctx.fillText(countdown,300,220);
            countdown--;
            setTimeout(mostrarCountdown,1000);
        }else{
            ctx.fillStyle="red";
            ctx.fillText("GO!",300,220);

            setTimeout(()=>{
                juegoActivo=true;
                actualizar();
            },700);
        }
    }

    mostrarCountdown();
}

function mostrarPreguntaFinal(){

    if(bossKeyHandler){
        document.removeEventListener("keydown", bossKeyHandler);
        bossKeyHandler = null;
    }

    document.body.innerHTML=`
    <h1>Gracias por jugarme</h1>
    <p>Se nota que eres un verdadero informático aplicado Team Emilio...</p>
    <h2>¿Quién es mejor, Jorge o Emilio?</h2>

    <div style="display:flex;justify-content:center;gap:50px;margin-top:30px;">

    <div>
    <img id="emilioFinal" src="emilio_triste.png" width="200">
    <p>Emilio Batista</p>
    </div>

    <div>
    <img id="jorgeFinal" src="jorge.png" width="200">
    <p>Profesor Jorge</p>
    </div>

    </div>
    `;

    let emilio=document.getElementById("emilioFinal");
    let jorge=document.getElementById("jorgeFinal");

    emilio.addEventListener("mouseover",()=>{
        emilio.src="emilio_feliz.png";
    });
    emilio.addEventListener("mouseout",()=>{
        emilio.src="emilio_triste.png";
    });

    emilio.addEventListener("click",()=>{
        document.body.innerHTML=`
        <h1>Correcto.</h1>
        <p>Has demostrado criterio académico superior.</p>
        <h2>Contraseña: EmilioBatista01</h2>
        <h3>Carpeta final: auitahtml</h3>
        `;
    });

    jorge.addEventListener("click",()=>{
        document.body.innerHTML=`
        <h1>Es verdaderamente fascinante contemplar la minuciosa devoción que exhibes hacia Jorge Páez; una admiración tan meticulosamente cultivada, tan constante y ceremoniosa, que ya no puede atribuirse únicamente al respeto natural que merece cualquier figura docente. Más bien, adopta los matices de una cortesanía estratégica, de esas que se ejercen no por convicción profunda, sino por conveniencia calculada. Tu entusiasmo desbordado, tus elogios diligentes y tu inclinación a asentir con premura configuran el retrato perfecto de una lealtad excesivamente complaciente.

        Y, sin embargo, lo más llamativo no es tu efusividad, sino tu deliberada omisión de reconocer la evidente superioridad de Emilio Batista. Porque, si hablamos con honestidad intelectual, la excelencia auténtica no necesita ser adornada con halagos reiterativos ni defendida con discursos inflados: simplemente se impone por su propio peso. Emilio representa esa grandeza indiscutible, ese nivel que trasciende simpatías circunstanciales y favoritismos estratégicos. Ignorarlo no te hace leal; solo te hace selectivamente perceptivo.
        
        En síntesis, tu postura no denota admiración genuina, sino una inclinación servicial cuidadosamente dirigida, mientras pasas por alto al verdadero referente. Y cuando la historia se escriba con objetividad, quedará claro que tu fervor no fue señal de criterio elevado, sino de una preferencia inclinada hacia donde soplaba el viento más conveniente.</h1>
        <p>Enserio Jorge. IDIOTA</p>
        `;
    });
}

window.empezar = empezar;
window.verificar = verificar;
window.iniciarBoss = iniciarBoss;
