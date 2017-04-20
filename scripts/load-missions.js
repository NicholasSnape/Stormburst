function editMission(m_id){
    console.log(m_id);
}

function getPrizePercentage(mission, prize){
    if (typeof mission["performance"] == 'array'){
        
    }
    const performance = getTotalPerformance(mission["performance"])
}

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
    console.log("Data Gotten");
    if (status != "success"){
        $("#status > h2").html("Missions couldn't be loaded. Please try again later.").addClass("error");
        return;
    }
    
    $("#status").remove();
    data = JSON.parse(data);
    const missions = data["missions"];
    let missionDemo = $(".mission").clone();
    missionDemo.attr("hidden", false);
    
    $.each(missions, function(m_id){
        let missionClone = missionDemo.clone();
        
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
        
        // Body of the mission
        // Description
        // Player count
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
        /*if (typeof missions[m_id]["prizes"] == 'object'){
            let i = 0;
            let prizes = [];
            while ((i < missions[m_id]["prizes"].length) && (prizes.length < 3)){
            }
        } else {
            missionClone.children(".m-body").children(".prize").children(".m-task").html(missions[m_id]["description"]);
            console.log("[ERROR] No prizes found on mission " + m_id);
        }*/
        
        missionClone.appendTo($("#main-container"));
    });
    
    
    /*let output = "";
    $.each(missions, function(m_id){//mission id
        output += '<div id="' + m_id + '" class="mission">';
        output += '<div class="m-head">';
        output += '<div class="m-head-left">';
        if (typeof missions[m_id]["name"] != 'undefined'){
            output += '<p>' + missions[m_id]["name"] + '</p>';
        } else {
            output += '<p>Error</p>';
        }
        
        output += '</div>';
        output += '<div class="m-head-right">';
        output += '<button onclick="editMission(this.value)" value=' + m_id + '>&#9881;</button>';
        const totalPercentage = getTotalPercentage(missions[m_id], 0);//returns either a number to dp given or an error string
        if (isNaN(totalPercentage)){
            console.log("[ERROR] " + totalPercentage);
            output += '<p class="m-completion">Error</p>';
        }else{
            output += '<p class="m-completion">' + totalPercentage + '% complete</p>';
        }
        output += '</div></div>';
        
        output += '<div class="m-body">';
        output += '<div class="m-desc">';
        output += '<p class="m-players">' + missions[m_id]["members"].length + ' players</p>';
        output += '<p class="m-task">' + missions[m_id]["description"] + '</p>';
        output += '</div></div>';
        
        if (typeof missions[m_id]["prizes"] == 'object'){
            let i = 0;
            let prizes = [];
            while ((i < missions[m_id]["prizes"].length) && (prizes.length < 3)){
                output += '<div class="prize">';
                //output += '<div class="p-prog p-prog" style="width: ' + getPrizePercentage(missions[m_id]["prizes"][i]) + '%">';
                output += '</div>';
                output += '</div>';
            }
        } else {
            console.log("[ERROR] No prizes found on mission " + m_id);
            output += '<div class="m-desc">No prizes found on mission' + m_id + "</div>";
        }
        
        output += '</div>';
        $("#main-container").html(output);
    });*/
}); 