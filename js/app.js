const Doremi = [
    {note: "Do", frequency: "261.626"},
    {note: "Re", frequency: "294.33"},
    {note: "Mi", frequency: "327.03"},
    {note: "Fa", frequency: "348.83"},
    {note: "So", frequency: "392.44"},
    {note: "La", frequency: "436.04"},
    {note: "Si", frequency: "490.55"},
    {note: "Doe", frequency: "523.25"}
];
const main = document.querySelector(".synthetiseur");
main.innerHTML += "<article id='piano'> </article>";
const piano = main.querySelector("#piano");


Doremi.forEach(function(note){
    console.log("dez");
    piano.innerHTML += `
        <div class="note" id="${note.note}" data-source-frequency="${note.frequency}">
            <div class="note-label">${note.note}</div>
        </div>
    `;
});

// Audio

const ctxAudio = new (window.AudioContext || window.webkitAudioContext)();
const allNoteElement = main.querySelectorAll(".note");
const volume = document.querySelector(".volume");
const slidePan = document.querySelector(".pan");
const oscillatorType = document.getElementById("oscillatorType");

let connect = false;
let oscillator = ctxAudio.createOscillator();
let gain = ctxAudio.createGain();
let pan = ctxAudio.createStereoPanner();
pan.pan.value = 0;
gain.gain.value = 0.1;
oscillator.type = oscillatorType.value;
oscillator.start();

function jouerSon(event){
    oscillator.frequency.value = event.target.getAttribute("data-source-frequency");
    if (connect)
    {
        gain.disconnect(ctxAudio.destination); // deconnecte le dernier noeud qui est lié à la sortie audio, pour ne jouer aucun son
    }
    else
    {
        //let buttonGain = shema.querySelector("#gain").dataset.activeNode
        //let buttonPan = shema.querySelector("#pan");
        console.log(gain.toString())
        if (pan.toString() == "[object StereoPannerNode]  [object GainNode]")
        console.log("oui")
        else
        console.log("non")


        if (gain && pan)
        {
            oscillator.connect(pan); //je connecte la source a un filtre
            pan.connect(gain); // puis connecte les filtre entre eux
            
            gain.connect(ctxAudio.destination); //ensuite prend le dernier filtre connecté pour le lier à l'output
        }
        else if(gain == null && pan != null){
            oscillator.connect(pan);
            pan.connect(ctxAudio.destination);
        }
        else if(gain.toString() != null && pan == null)
        {
            oscillator.connect(gain);
            gain.connect(ctxAudio.destination);
        }
        else
            oscillator.connect(ctxAudio.destination);
        
    }

    connect = !connect; // permet de redefinir la valeur connect et ainsi verfifier la connection entre les noeuds
    
    
    
}


allNoteElement.forEach(function(noteElement){
    noteElement.onmousedown = jouerSon;
    noteElement.onmouseup = jouerSon;
    //noteElement.onactivate = jouerSon;
    //noteElement.onmouseenter = jouerSon;
})

// textContent des Effets *****************************
volume.addEventListener("input", () => {gain.gain.value = volume.value;  document.querySelector(".volumeLabel").textContent = volume.value});

slidePan.addEventListener("input", () => {pan.pan.value = slidePan.value;  document.querySelector(".panLabel").textContent = slidePan.value});

oscillatorType.addEventListener("input", () => oscillator.type = oscillatorType.value);



//Boutons Shema ***********************************
const shema = document.querySelector(".Audio-Node-Shema");
const buttonGain = shema.querySelector("#gain"); //filter
const buttonPan = shema.querySelector("#pan"); //filter
const buttonOscType = shema.querySelector("#oscType"); //filter

// buttonOscillator.onclick = (event) => {
//     if (buttonOscillator.dataset.activeNode == "false")
//         buttonOscillator.dataset.activeNode = "true";
//     else
//         buttonOscillator.dataset.activeNode = "false";
//         console.log(buttonOscillator.dataset.activeNode)
// };

// version raccourcis pour mettre des onclick a tout les bouton Node et changer la value du dataset-active-node dans le HTML
document.querySelectorAll(".node").forEach((node) => { //tout les boutons avec la class .node
    node.onclick = () => {
        let pastillePann = buttonGain.querySelector(".pastille");
        let pastilleGain = buttonPan.querySelector(".pastille");

        let pastille = node.querySelector(".pastille");
        if (node.dataset.activeNode == "false"){
            node.dataset.activeNode = "true";
            //node.style.background = " #c6ffb8";
            //pastille.style.background = "#c6ffb8";
            //pastille.style.boxShadow = "0px 0px 36px 7px rgba(230,3,3,1);";
        }
        else{
            node.dataset.activeNode = "false";
            //node.style.background = " #ffa4a4";
            //pastille.style.background = "#ffa4a4";
        }
        console.log(node.dataset.activeNode)
        pastille.classList.toggle("pastille-desactive");
    };
})



//bouton connecter **************
document.querySelector("#connection").onclick = function connecter(){

    buttonGain
    buttonPan
    //oscillator.start();
    //gain
    if (buttonGain.dataset.activeNode == "false")
    {
        gain = null;
        volume.style.visibility = "hidden";
        
    }
    else
    {
        volume.style.visibility = "visible";
        gain = ctxAudio.createGain();
        gain.gain.value = 0.1;
    }
    //pan
    if (buttonPan.dataset.activeNode == "false")
    {
        pan = null;
        slidePan.style.visibility = "hidden";
    }
    else
    {
        slidePan.style.visibility = "visible";
        pan = ctxAudio.createStereoPanner();
        pan.pan.value = 0;
    }

}

//stop
document.querySelector(".stop").onclick = () => oscillator.stop();


















// MDN code ----------
async function getFile(audioContext, filepath){
    const response = await fetch(filepath)
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

async function setupSample(){
    const filepath = "../assets/wave/Piano.wav";
    const sample = await getFile(ctxAudio, filepath);
    return sample;
    
}

setupSample().then((sample) => {
    const divTest = document.getElementById("divTest");
    divTest.onclick = () => {
        
        console.log(sample)
        playSample(ctxAudio, sample);
    }
});


function playSample(audioContext, audioBuffer) {
    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.playbackRate.value = 2;
    //let volumeTest = audioContext.createGain()
    //volumeTest.gain.value = 0.1;
    sampleSource.connect(audioContext.destination)
    sampleSource.start();
    return sampleSource;
}














// TEST
/*
const contexteAudio = new (window.AudioContext || window.webkitAudioContext)();
var oscillateur = contexteAudio.createOscillator();
var noeudGain = contexteAudio.createGain();
var div = document.querySelector("#divTest");
var volume = document.querySelector(".volume");
//volume.addEventListener();
noeudGain.gain.value = volume.value;
volume.addEventListener("input", function(){
    console.log(volume.value);
    noeudGain.gain.value = volume.value;
})
oscillateur.start();
div.onclick = function(){
    console.log('tet');
    oscillateur.connect(noeudGain);
    noeudGain.connect(contexteAudio.destination);
};
*/