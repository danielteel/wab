const momentSimplifier=1000;

function realNumber(string){
    let real = Number(string);
    if (!isFinite(real)) real=0;
    return real;
}

function calcArm(weight, moment){
    return formatArm((formatMoment(moment)*momentSimplifier)/formatWeight(weight));
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

function isAboutEquals(a,b, smallestDiff=0.0000001){
    if (Math.abs(a-b)<smallestDiff){
        return true;
    }
    return false;
}

export {calcArm, realNumber, formatArm, formatWeight, formatMoment, isAboutEquals, momentSimplifier};