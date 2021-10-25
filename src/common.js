function realNumber(string){
    let real = Number(string);
    if (!isFinite(real)) real=0;
    return real;
}

function formatArm(arm){
    arm=realNumber(arm);
    return Math.round(arm*10)/10;
}

function formatWeight(weight){
    weight=realNumber(weight);
    return Math.round(weight*10)/10;
}

function formatMoment(moment){
    return Math.round(moment*1000)/1000;
}

export {realNumber, formatArm, formatWeight, formatMoment};