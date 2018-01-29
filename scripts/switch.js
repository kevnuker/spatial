var energyUsed = 0;

function startTurbine() {
    var turbineIFrame = this.parent.frames[1];
    turbineIFrame.postMessage('on', '*')
}

function stopTurbine() {
    var turbineIFrame = this.parent.frames[1];
    turbineIFrame.postMessage('off', '*')
}

window.addEventListener('message', function(event) {
    energyUsed = energyUsed + (.000002 * event.data);
    document.getElementById('energy').innerHTML = "Energy Used = " + mRound(energyUsed, 4) + "Wh"
});

function mRound(energy, prec) {
  var factor = Math.pow(10, prec);
  return Math.round(energy * factor) / factor;
}