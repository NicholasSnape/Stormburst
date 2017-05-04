let missions;
function updateCard(m_id){
    let mCard = $(".mission." + m_id);
    createCard(mCard, missions, m_id);
}

function createCard(missionClone, missions, m_id, showLocked = true){
    // Header of the mission
    // Name
    if (typeof missions[m_id]["name"] != 'undefined'){
        missionClone.children(".m-head").children(".m-head-left").children("p").html(missions[m_id]["name"]);
    } else {
        missionClone.children(".m-head").children(".m-head-left").children("p").html("Error");
        console.log("[ERROR] Message has no name.");
    }

    // %
    const totalPercentage = getTotalPercentage(missions[m_id], 0);//returns either a number to dp given or an error string
    if (isNaN(totalPercentage)){
        console.log("[ERROR] " + totalPercentage);
        missionClone.children(".m-head").children(".m-head-right").children("p").html("Error");
    }else{
        missionClone.children(".m-head").children(".m-head-right").children("p").html(totalPercentage + "% complete");
    }
    missionClone.children(".m-head").children(".m-head-right").children("button").attr("onclick", "editMission(" + m_id + ")");

    // Body of the mission
    // Description
    // Player count
    missionClone.children(".m-body").children(".prize").remove();
    if (typeof missions[m_id]["performance"] == 'object'){
        missionClone.children(".m-body").children(".m-desc").children(".m-players").html(Object.keys(missions[m_id]["performance"]).length + " players");
    } else if (typeof missions[m_id]["performance"] == 'undefined'){
        missionClone.children(".m-body").children(".m-desc").children(".m-players").html("ERROR");
        console.log("[ERROR] Mission " + m_id + " performance is undefined.");
    } else {
        missionClone.children(".m-body").children(".m-desc").children(".m-players").html("ERROR");
        console.log("[ERROR] Mission " + m_id + " performance is not an object.");
    }
    // Description
    if (typeof missions[m_id]["description"] == 'undefined'){
        missionClone.children(".m-body").children(".m-desc").children(".m-task").html("ERROR");
        console.log("[ERROR] Mission " + m_id + " description is undefined.");
    } else {
        missionClone.children(".m-body").children(".m-desc").children(".m-task").html(missions[m_id]["description"]);
    }

    //Prizes
    if (typeof missions[m_id]["prizes"] == 'undefined'){
        missionClone.children(".m-body").append('<div class="prize"><p class="p-text">ERROR</p></div>');
        console.log("[ERROR] Prizes not found in mission " + m_id + ".");
    }else if (typeof missions[m_id]["prizes"] != 'object'){
        missionClone.children(".m-body").append('<div class="prize"><p class="p-text">ERROR</p></div>');
        console.log("[ERROR] Prizes is not an object in mission " + m_id + ".");
    }else{
        // Get percentage 
        let talley = "";
        if (typeof missions[m_id]["performance"] == 'object'){
            talley = getTotalPerformance(missions[m_id]["performance"], m_id);
        } else {
            missionClone.children(".m-body").append('<div class="prize"><p class="p-text">ERROR</p></div>');
            console.log("[ERROR] Performance is not an object in mission " + m_id);
        }
        if (isNaN(talley)){
            missionClone.children(".m-body").append('<div class="prize"><p class="p-text">ERROR</p></div>');
            console.log("[ERROR] " + talley);
        }else{
            let prevPercent = 100;
            $.each(missions[m_id]["prizes"], function(p){
                let output = '<div class="prize ' + missions[m_id]["prizes"][p]["id"] + '">';
                if (typeof missions[m_id]["prizes"][p]["threshold"] == 'undefined'){
                    output += '<p class="p-val">ERROR</p>';
                    console.log("[ERROR] Prize " + missions[m_id]["prizes"][p]["id"] + " threshold is undefined.");
                }else if (isNaN(missions[m_id]["prizes"][p]["threshold"])){
                    output += '<p class="p-val">ERROR</p>';
                    console.log("[ERROR] Prize " + missions[m_id]["prizes"][p]["id"] + " threshold is not a number.");
                }else{
                    let percent = ((talley/missions[m_id]["prizes"][p]["threshold"])*100).toFixed(0);
                    let cssPercent = 0;
                    if ((prevPercent == 100) || !showLocked){
                        if (percent >= 75){
                            cssPercent = 75;
                        }else if(percent >= 50){
                            cssPercent = 50;
                        }else if(percent >= 25){
                            cssPercent = 25;
                        }
                    } else{
                        percent = 0;
                    }

                    output += '<div class="p-prog p-prog-' + cssPercent + '" style="width: ' + percent + '%">';
                    if (typeof missions[m_id]["prizes"][p]["name"] == 'undefined'){
                        output += '<p class="p-text">ERROR</p>';
                        console.log("[ERROR] Prize " + p + " has no name.")
                    } else {
                        output += '<div class="p-text"><p>' + missions[m_id]["prizes"][p]["name"] + '</p></div>';
                    }
                    output += '</div>';
                    if (percent <= 100){
                        if ((prevPercent == 100) || !showLocked){
                            prevPercent = percent;
                            output += '<p class="p-val">' + percent +'%</p>';
                        }else{
                            prevPercent = percent;
                            output += '<p class="p-val">LOCKED</p>';
                        }

                    }else{
                        prevPercent = 100;
                        output += '<p class="p-val">100%</p>';
                    }

                }
                output += '</div>';
                missionClone.children(".m-body").append(output);
            });
        }
    }

    // Footer
    // Start date
    if (typeof missions[m_id]["start_date"] == 'undefined'){
        missionClone.children(".m-footer").children(".m-start").children(".m-date").html("ERROR");
        missionClone.children(".m-footer").children(".m-start").children(".m-days").html("ERROR");
        console.log("[ERROR] Start date is undefined for mission " + m_id);
    }else{
        missionClone.children(".m-footer").children(".m-start").children(".m-date").html(missions[m_id]["start_date"].substr(9));
        missionClone.children(".m-footer").children(".m-start").children(".m-days").html(missions[m_id]["start_date"].substr(0,8));
    }

    // Time left
    if ((typeof missions[m_id]["start_date"] == 'undefined') || (typeof missions[m_id]["end_date"] == 'undefined')){
        missionClone.children(".m-footer").children(".m-prog").children(".m-days").html("ERROR");
    }else{
        const _second = 1000;
        const _minute = _second * 60;
        const _hour = _minute * 60;
        const _day = _hour * 24;
        let timer;
        
        function startCountdown(){
            let today = new Date();
            endDate = missions[m_id]["end_date"].substr(0,9);
            endDate += missions[m_id]["end_date"].substr(12,3);
            endDate += missions[m_id]["end_date"].substr(9,3);
            endDate += missions[m_id]["end_date"].substr(15);
            endDate = new Date(endDate);

            const timeLeft = endDate-today;

            if (!isNaN(timeLeft)){
                if (timeLeft <= 0){
                    missionClone.children(".m-footer").children(".m-prog").children(".m-days").html("00:00:00:00");
                    clearInterval(timer)
                    return;
                } else {
                    const days = Math.floor(timeLeft / _day);
                    const hours = Math.floor((timeLeft % _day) / _hour);
                    const minutes = Math.floor((timeLeft % _hour) / _minute);
                    const seconds = Math.floor((timeLeft % _minute) / _second);

                    missionClone.children(".m-footer").children(".m-prog").children(".m-days").html(days + ':' + ("0" + hours).slice(-2) + ':' + ("0" + minutes).slice(-2) + ':' + ("0" + seconds).slice(-2));
                }
            } else {
                missionClone.children(".m-footer").children(".m-prog").children(".m-days").html("ERROR");
                console.log("[ERROR] Time left is not a number for mission " + m_id);
                clearInterval(timer)
                return;
            }
        }
        timer = setInterval(startCountdown, 1000);
    }

    // End date
    if (typeof missions[m_id]["end_date"] == 'undefined'){
        missionClone.children(".m-footer").children(".m-end").children(".m-date").html("ERROR");
        missionClone.children(".m-footer").children(".m-end").children(".m-days").html("ERROR");
        console.log("[ERROR] End date is undefined for mission " + m_id);
    }else{
        missionClone.children(".m-footer").children(".m-end").children(".m-date").html(missions[m_id]["end_date"].substr(9));
        missionClone.children(".m-footer").children(".m-end").children(".m-days").html(missions[m_id]["end_date"].substr(0,8));
    }
};

function getTotalPerformance(performance, m_id){
    let currTally = 0;
    if (typeof performance == 'object'){
        $.each(performance, function(s_id){//staff id
            if (typeof performance[s_id] != 'undefined') {
                if (!isNaN(performance[s_id])){
                    currTally += performance[s_id];
                } else {
                    return("Staff " + s_id + " has NaN performance on mission " + m_id);
                }
            } else {
                return("Staff " + s_id + " has no performance data on mission " + m_id);
            }
        })
    } else {
        return("No staff performances found on mission " + m_id);
    }
    return currTally;
}

function getTotalThreshold(prizes, m_id){
    let currThresh = 0;
    if (typeof prizes != 'undefined'){
        $.each(prizes, function(p_id){//prize id
            if (typeof prizes[p_id]["threshold"] != 'undefined'){
                if (isNaN(prizes[p_id]["threshold"])){
                    console.log("[ERROR] Threshold for prize " + p_id + " isn't a number.");
                } else {
                    currThresh += prizes[p_id]["threshold"];
                }
            } else {
                console.log("[ERROR] No threshold found for prize " + p_id);
            }
        })
    } else {
        return "No prizes found for mission " + m_id;
    }
    if (currThresh == 0){
        return "Total threshold is 0 for prizes for mission " + m_id + " or another error occurred.";
    }
    return currThresh;
}

function getTotalPercentage(mission, dp = 2){
    let talley = "",
          threshold = "";
    if (typeof mission["performance"] == 'object'){
        talley = getTotalPerformance(mission["performance"], mission["id"]);
    } else {
        return "Performance is not an object in mission " + mission["id"];
    }
    if (isNaN(talley)){
        return talley;
    }
    
    if (typeof mission["prizes"] == 'object'){
    threshold = getTotalThreshold(mission["prizes"], mission["id"]);
    } else {
        return "Prizes is not an object in mission " + mission["id"];
    }
    if (isNaN(threshold)){
        return threshold;
    }
    
   
    const tPercentage = ((talley/threshold) * 100).toFixed(dp);
    return tPercentage;
}

$.get("https://www.oneupsales.io/tech-test/get-missions-data", function(data, status){
    if (status != "success"){
        $("#status > h2").html("Missions couldn't be loaded. Please try again later.").addClass("error");
        return;
    }
    
    $("#status").remove();
    data = JSON.parse(data);
    missions = data["missions"];
    let missionDemo = $("#main-container").children(".mission").clone();
    missionDemo.attr("hidden", false);
    
    $.each(missions, function(m_id){        
        let missionClone = missionDemo.clone();
        missionClone.attr("class", "mission " + m_id);
        createCard(missionClone, missions, m_id);
        
        
        missionClone.appendTo($("#main-container"));
    });
}); 