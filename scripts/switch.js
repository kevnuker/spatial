var energyUsed = 0;

function startTurbine() {
    var turbineIFrame = this.parent.frames[1];
    turbineIFrame.callTurbineFrame('on');
}

function stopTurbine() {
    var turbineIFrame = this.parent.frames[1];
    turbineIFrame.callTurbineFrame('off');
}

function callSwitchFrame(data) {
    energyUsed = energyUsed + (.000002 * event.data);
    document.getElementById('energy').innerHTML = "Energy Used = " + mRound(energyUsed, 4) + "Wh"
}

function mRound(energy, prec) {
  var factor = Math.pow(10, prec);
  return Math.round(energy * factor) / factor;
}