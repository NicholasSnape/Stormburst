const maxNameLength = 20,
      nameRegEx = /^[a-zA-Z0-9\-\']+$/,
      maxDescLength = 30,
      descRegEx = /^[a-zA-Z0-9\-\']+$/,
      minThreshold = 0,
      maxThreshold = 10000;

function checkName(nameToCheck){
    if (nameToCheck.length > maxNameLength){return false;}
    if (!nameRegEx.test(nameToCheck)){return false;}
    
    return true;
}

function checkDesc(descToCheck){
    if (descToCheck.length > maxDescLength){return false;}
    if (!descRegEx.test(descToCheck)){return false;}
    
    return true;
}

function checkThreshold(thresToCheck){
    if (isNaN(thresToCheck)){return false}
    if ((thresToCheck < minThreshold) && (thresToCheck > maxThreshold)){return false}
    
    return true;
}