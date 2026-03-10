let preguntas = [
    {pregunta:"¿Cuál es su nombre?",respuesta:"Emilio Batista"},
    {pregunta:"¿Cuántas esposas tiene Emilio?",respuesta:"3"},
    {pregunta:"¿Cuál es su personaje favorito de One Piece?",respuesta:"Luffy"},
    {pregunta:"¿Qué es mejor, backend o frontend?",respuesta:"backend"},
    {pregunta:"¿Cuándo cumple años Emilio?",respuesta:"29 de febrero"}
    ];
    
    let indice = 0;
    
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
        let user = document.getElementById("respuesta").value.toLowerCase();
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
    
    document.body.innerHTML=`
    <h1>EMILIO FINAL BOSS</h1>
    <img src="emilio_triste.png" width="150">
    <p>Sobrevive 20 segundos...</p>
    <canvas id="gameCanvas" width="600" height="400" style="background:black;border:2px solid white;"></canvas>
    <p id="estado"></p>
    `;
    
    let canvas=document.getElementById("gameCanvas");
    let ctx=canvas.getContext("2d");
    
    let jugador={x:280,y:180,size:20};
    let enemigos=[];
    let rayos=[];
    let tiempo=0;
    let juegoActivo=true;
    
    document.addEventListener("keydown",function(e){
        if(e.key==="ArrowLeft" && jugador.x>0) jugador.x-=15;
        if(e.key==="ArrowRight" && jugador.x<580) jugador.x+=15;
        if(e.key==="ArrowUp" && jugador.y>0) jugador.y-=15;
        if(e.key==="ArrowDown" && jugador.y<380) jugador.y+=15;
    });
    
    function crearEnemigo(){
        let lado=Math.random()<0.5?"izquierda":"derecha";
    
        enemigos.push({
            lado:lado,
            y:Math.random()*380,
            size:20,
            speed:4
        });
    }
    
    function crearRayo(){
    
        // Ráfagas múltiples
        let cantidad = Math.floor(Math.random()*3)+2;
    
        for(let i=0;i<cantidad;i++){
            rayos.push({
                x:Math.random()*580,
                y:0,
                size:10 + Math.random()*10,
                height:40 + Math.random()*60,
                speed:7 + Math.random()*3
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
    if(Math.random()<0.04) crearEnemigo();
    
    // MUCHOS rayos
    if(Math.random()<0.08) crearRayo();
    
    // Enemigos laterales
    ctx.fillStyle="red";
    
    enemigos.forEach(e=>{
        if(e.lado==="izquierda"){
            e.x=0;
            e.x+=e.speed;
        }else{
            e.x=580;
            e.x-=e.speed;
        }
    
        ctx.fillRect(e.x,e.y,e.size,e.size);
    
        if(detectar(jugador,{x:e.x,y:e.y,size:e.size})){
            juegoActivo=false;
            document.getElementById("estado").innerText="DERROTA. Emilio está decepcionado de ti.";
        }
    });
    
    // Rayos rápidos y múltiples
    ctx.fillStyle="yellow";
    
    rayos.forEach(r=>{
        r.y+=r.speed;
    
        ctx.fillRect(r.x,r.y,r.size,r.height);
    
        if(detectar(jugador,{x:r.x,y:r.y,size:r.size})){
            juegoActivo=false;
            document.getElementById("estado").innerText="DERROTA. Emilio te fulminó sin piedad.";
        }
    });
    
    // Escalar dificultad cada 5 segundos
    tiempo++;
    
    if(tiempo%300===0){
        enemigos.forEach(e=>e.speed+=1);
        rayos.forEach(r=>r.speed+=1);
    }
    
    if(tiempo>1200 && juegoActivo){
        juegoActivo=false;
        mostrarPreguntaFinal();
    }
    
    requestAnimationFrame(actualizar);
    }
    
    actualizar();
    }
    
    function mostrarPreguntaFinal(){
    
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