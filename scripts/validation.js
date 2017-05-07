const maxNameLength = 100,
      nameRegEx = /^[a-zA-Z0-9\-' !.]+$/,
      maxDescLength = 100,
      descRegEx = /^[a-zA-Z0-9\-' !.]*$/,
      minThreshold = 0,
      maxThreshold = 10000,
      dateFormat = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T{1}[0-9]{2}:[0-9]{2}$/,
      daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

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

function checkDate(dateToCheck){
    
    if (!dateFormat.test(dateToCheck)){return false}
    
    if (dateToCheck.substr(0,4) < 2000){return false}
    if (dateToCheck.substr(5,2) < 1){return false}
    if (dateToCheck.substr(8,2) < 1){return false}
    
    if (dateToCheck.substr(5, 2) > 12){return false}
    //check february
    if (dateToCheck.substr(5, 2) == 2){
        if (dateToCheck.substr(2,2) % 4 == 0){
            if (dateToCheck.substr(8,2) > 29){return false}
        }else{
            if (dateToCheck.substr(8,2) > 28){return false}
        }
    }
    
    if (dateToCheck.substr(8,2) > daysInMonths[dateToCheck.substr(5, 2)]){return false}
    
    return true;
}

function formatDate(dateToChange){
    return dateToChange.substr(11) + ":00 " + dateToChange.substr(8,2) + "/" + dateToChange.substr(5, 2) + "/" + dateToChange.substr(0,4)
}