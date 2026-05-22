<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Team Emilio</title>

<style>
body{
    background:#111;
    color:white;
    font-family:Arial, sans-serif;
    text-align:center;
    margin:0;
    padding:20px;
}

button{
    padding:10px 20px;
    font-size:18px;
    margin-top:10px;
    cursor:pointer;
}

input{
    padding:10px;
    font-size:18px;
    width:250px;
}

canvas{
    margin-top:20px;
}
</style>
</head>
<body onload="empezar()">

<div id="contenido"></div>

<script>

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

document.body.innerHTML=`
<h1>EMILIO FINAL BOSS</h1>

<img src="emilio_triste.png" width="150">

<p>Sobrevive 20 segundos...</p>

<canvas id="gameCanvas" width="600" height="400"
style="background:black;border:2px solid white;"></canvas>

<p id="estado"></p>
`;

let canvas=document.getElementById("gameCanvas");
let ctx=canvas.getContext("2d");

let jugador={
    x:280,
    y:180,
    size:20
};

let enemigos=[];
let rayos=[];

let tiempo=0;
let juegoActivo=true;

document.addEventListener("keydown",function(e){

    if(e.key==="ArrowLeft" && jugador.x>0)
        jugador.x-=15;

    if(e.key==="ArrowRight" && jugador.x<580)
        jugador.x+=15;

    if(e.key==="ArrowUp" && jugador.y>0)
        jugador.y-=15;

    if(e.key==="ArrowDown" && jugador.y<380)
        jugador.y+=15;
});

function crearEnemigo(){

    let lado=Math.random()<0.5?"izquierda":"derecha";

    enemigos.push({
        x: lado==="izquierda" ? 0 : 580,
        lado:lado,
        y:Math.random()*380,
        size:20,
        speed:4
    });
}

function crearRayo(){

    let cantidad = Math.floor(Math.random()*3)+2;

    for(let i=0;i<cantidad;i++){

        rayos.push({
            x:Math.random()*580,
            y:-100,
            size:10 + Math.random()*10,
            height:40 + Math.random()*60,
            speed:7 + Math.random()*3
        });
    }
}

function detectar(a,b){

    return a.x < b.x + b.size &&
           a.x + a.size > b.x &&
           a.y < b.y + b.size &&
           a.y + a.size > b.y;
}

function actualizar(){

if(!juegoActivo) return;

ctx.clearRect(0,0,600,400);

////////////////////////////
// JUGADOR
////////////////////////////

ctx.fillStyle="white";

ctx.fillRect(
    jugador.x,
    jugador.y,
    jugador.size,
    jugador.size
);

////////////////////////////
// GENERAR ENEMIGOS
////////////////////////////

if(Math.random()<0.03)
    crearEnemigo();

if(Math.random()<0.05)
    crearRayo();

////////////////////////////
// ENEMIGOS
////////////////////////////

ctx.fillStyle="red";

enemigos.forEach(e=>{

    if(e.lado==="izquierda"){
        e.x += e.speed;
    }else{
        e.x -= e.speed;
    }

    ctx.fillRect(e.x,e.y,e.size,e.size);

    if(detectar(jugador,{
        x:e.x,
        y:e.y,
        size:e.size
    })){

        juegoActivo=false;

        document.getElementById("estado").innerText=
        "DERROTA. Emilio está decepcionado de ti.";
    }
});

////////////////////////////
// RAYOS
////////////////////////////

ctx.fillStyle="yellow";

rayos.forEach(r=>{

    r.y += r.speed;

    ctx.fillRect(
        r.x,
        r.y,
        r.size,
        r.height
    );

    if(detectar(jugador,{
        x:r.x,
        y:r.y,
        size:r.size
    })){

        juegoActivo=false;

        document.getElementById("estado").innerText=
        "DERROTA. Emilio te fulminó sin piedad.";
    }
});

////////////////////////////
// DIFICULTAD
////////////////////////////

tiempo++;

if(tiempo%300===0){

    enemigos.forEach(e=>e.speed+=0.5);
    rayos.forEach(r=>r.speed+=0.5);
}

////////////////////////////
// GANAR
////////////////////////////

if(tiempo>1200 && juegoActivo){

    juegoActivo=false;
    mostrarPreguntaFinal();
}

requestAnimationFrame(actualizar);
}

//////////////////////////////////////////////////////
// COUNTDOWN 3 2 1
//////////////////////////////////////////////////////

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
            actualizar();
        },700);
    }
}

mostrarCountdown();
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
<h1>
Es verdaderamente fascinante contemplar la minuciosa devoción que exhibes hacia Jorge Páez...
</h1>

<p>Enserio Jorge. IDIOTA</p>
`;
});
}

</script>

</body>
</html>
    
