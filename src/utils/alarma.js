let contexto = null;
let oscilador = null;
let intervalo = null;

export function prepararAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!contexto) contexto = new AC();
    if (contexto.state === "suspended") contexto.resume();
}

export function tocarAlarma() {
    prepararAudio();
    if (!contexto || oscilador) return;

    oscilador = contexto.createOscillator();
    const ganancia = contexto.createGain();
    oscilador.type = "square";
    oscilador.frequency.value = 760;
    oscilador.connect(ganancia);
    ganancia.connect(contexto.destination);
    ganancia.gain.value = 0;
    oscilador.start();

    let encendido = false;
    intervalo = setInterval(() => {
        const t = contexto.currentTime;
        encendido = !encendido;
        ganancia.gain.cancelScheduledValues(t);
        if (encendido) {
            ganancia.gain.setTargetAtTime(0.3, t, 0.02);
        } else {
            ganancia.gain.setTargetAtTime(0.0, t, 0.02);
        }
    }, 350);
}

export function detenerAlarma() {
    if (intervalo) {
        clearInterval(intervalo);
        intervalo = null;
    }
    if (oscilador) {
        try {
            oscilador.stop();
        } catch {
            // ya estaba detenido
        }
        try {
            oscilador.disconnect();
        } catch {
            // nodo ya desconectado
        }
        oscilador = null;
    }
}