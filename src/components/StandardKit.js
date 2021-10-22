

export default function StandardKitOrCargo({isKit}){
    let arrayToUse='kit';
    if (!isKit) arrayToUse='cargo';
    return "Standard kit";
}