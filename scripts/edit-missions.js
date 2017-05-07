const editMissionClone = $(".edit-mission-modal").clone();
$(".edit-mission-modal").remove();
const editPrizeClone = $(".edit-prize-modal").clone();
$(".edit-prize-modal").remove();
let descClone;

function addMembers(m_id){
    
}

// PRIZES
function saveNewPrize(m_id){
    if (($(".edit-prize-modal").children(".edit-prize").children(".edit-prize-option.edit-prize-name").children("p").children("input").val() == "") || ($(".edit-prize-modal").children(".edit-prize").children(".edit-prize-option.edit-prize-description").children("p").children("input").val() == "") || ($(".edit-prize-modal").children(".edit-prize").children(".edit-prize-option.edit-prize-threshold").children("p").children("input").val() == "")){
        alert("One or more of the inputs is empty, please fill them in and try again.")
        return
    }
    
    const name = $(".edit-prize-modal").children(".edit-prize").children(".edit-prize-option.edit-prize-name").children("p").children("input").val(),
          desc = $(".edit-prize-modal").children(".edit-prize").children(".edit-prize-option.edit-prize-description").children("p").children("input").val(),
          threshold = $(".edit-prize-modal").children(".edit-prize").children(".edit-prize-option.edit-prize-threshold").children("p").children("input").val();
    
    if (!checkName(name)){
        alert("One of the inputs is incorrect.");
        return;
    }
    if (!checkDesc(desc)){
        alert("One of the inputs is incorrect.");
        return;
    }
    if (!checkThreshold(threshold)){
        alert("One of the inputs is incorrect.");
        return;
    }
    
    
    const pos = Object.keys(missions[m_id]["prizes"]).length;
    
    const nPrize = {
        "mission_id" : m_id,
        "name" :  name,
        "description" :  desc,
        "threshold" :  threshold
    }
    
    $.post("https://www.oneupsales.io/tech-test/create-objective", function(nPrize, status){
        if (status == "success"){
            missions[m_id]["prizes"][pos] = {
                "mission_id" : m_id,
                "name" :  name,
                "description" :  desc,
                "threshold" :  threshold
            }
            updateCard(m_id);
            editMission(m_id);
            $(".edit-prize-modal").remove();
            alert("Added a new prize");
        }else {
            console.log(status);
        }
    });
}

function addPrize(m_id){
    let ePrize = editPrizeClone.clone();
    let prize = -1;
    let p_id;
    if (missions[m_id]["prizes"].length-1 < 0){p_id = 1}
    else{p_id = missions[m_id]["prizes"][missions[m_id]["prizes"].length-1]["id"] + 1};
    
    $(".edit-mission-modal." + m_id).remove();
    
    ePrize.attr("class", ePrize.attr("class") + " " + p_id);
    
    ePrize.children(".edit-prize").children(".edit-prize-save").attr("onclick", "saveNewPrize(" + m_id + ")");
    ePrize.children(".edit-prize").children(".edit-prize-close").attr("onclick", "closeEditPrize(" + p_id + ", " + m_id + ")");
    
    ePrize.children(".edit-prize").append('<div class="edit-prize-option edit-prize-name"><p>Name: <input name="name"></p></div>');
    
    ePrize.children(".edit-prize").append('<div class="edit-prize-option edit-prize-description"><p>Description: <input name="desc"></p></div>');
    
    ePrize.children(".edit-prize").append('<div class="edit-prize-option edit-prize-threshold"><p>Threshold: <input type="number" name="threshold"></p></div>');
    
    ePrize.attr("hidden", false);
    ePrize.appendTo("#main-container");
}

function closeEditPrize(p_id, m_id){
    $(".edit-prize-modal." + p_id).remove();
    editMission(m_id);
}

function savePrize(m_id, p_id, pos){
    let name,
        description,
        threshold;
    
    if ($(".edit-prize-modal." + p_id).children(".edit-prize").children(".edit-prize-option.edit-prize-name").children("p").children("input").val() == ""){
        name = $(".edit-prize-modal." + p_id).children(".edit-prize").children(".edit-prize-option.edit-prize-name").children("p").children("input").attr("placeholder");
    } else {
        name = $(".edit-prize-modal." + p_id).children(".edit-prize").children(".edit-prize-option.edit-prize-name").children("p").children("input").val();
    }
    if ($(".edit-prize-modal." + p_id).children(".edit-prize").children(".edit-prize-option.edit-prize-description").children("p").children("input").val() == ""){
        description = $(".edit-prize-modal." + p_id).children(".edit-prize").children(".edit-prize-option.edit-prize-description").children("p").children("input").attr("placeholder");
    } else {
        description = $(".edit-prize-modal." + p_id).children(".edit-prize").children(".edit-prize-option.edit-prize-description").children("p").children("input").val();
    }
    if ($(".edit-prize-modal." + p_id).children(".edit-prize").children(".edit-prize-option.edit-prize-threshold").children("p").children("input").val() == ""){
        threshold = $(".edit-prize-modal." + p_id).children(".edit-prize").children(".edit-prize-option.edit-prize-threshold").children("p").children("input").attr("placeholder");
    } else {
        threshold = $(".edit-prize-modal." + p_id).children(".edit-prize").children(".edit-prize-option.edit-prize-threshold").children("p").children("input").val();
    }
        
    if (!checkName(name)){
        alert("One of the inputs is incorrect.");
        return;
    }
    if (!checkDesc(description)){
        alert("One of the inputs is incorrect.");
        return;
    }
    if (!checkThreshold(threshold)){
        alert("One of the inputs is incorrect.");
        return;
    }
    
    const uPrize = {
        "id" : p_id,
        "name" :  name,
        "description" :  description,
        "threshold" :  threshold
    }

    $.post("https://www.oneupsales.io/tech-test/update-objective", function(uPrize, status){
        if (status == "success"){
            missions[m_id]["prizes"][pos]["name"] = name;
            missions[m_id]["prizes"][pos]["description"] = description;
            missions[m_id]["prizes"][pos]["threshold"] = threshold;
            updateCard(m_id);
            editMission(m_id);
            closeEditPrize(p_id, m_id);
            alert("Saved prize");
        }else {
            alert("Prize couldn't be saved. Please try again later.")
            console.log(status);
        }
    });
}

//Display Prize options
function editPrize(m_id, p_id){
    let ePrize = editPrizeClone.clone();
    let prize = -1;
    
    $(".edit-mission-modal." + m_id).remove();
    
    ePrize.attr("class", ePrize.attr("class") + " " + p_id);
    
    $.each(missions[m_id]["prizes"], function(i){
        if (missions[m_id]["prizes"][i]["id"] == p_id){
            prize = i;
        }
    });
    
    ePrize.children(".edit-prize").children(".edit-prize-save").attr("onclick", "savePrize(" + m_id + "," + p_id + ", " + prize + ")");
    ePrize.children(".edit-prize").children(".edit-prize-close").attr("onclick", "closeEditPrize(" + p_id + ", " + m_id + ")");
    
    ePrize.children(".edit-prize").append('<div class="edit-prize-option edit-prize-name"><p>Name: <input name="name" placeholder="' + missions[m_id]["prizes"][prize]["name"] + '"></p></div>');
    
    ePrize.children(".edit-prize").append('<div class="edit-prize-option edit-prize-description"><p>Description: <input name="desc" placeholder="' + missions[m_id]["prizes"][prize]["description"] + '"></p></div>');
    
    ePrize.children(".edit-prize").append('<div class="edit-prize-option edit-prize-threshold"><p>Threshold: <input type="number" name="threshold" placeholder="' + missions[m_id]["prizes"][prize]["threshold"] + '"></p></div>');
    
    ePrize.attr("hidden", false);
    ePrize.appendTo("#main-container");
}


//MISSIONS
//Mission Name
function cancelMissionName(m_id){
    $(".edit-mission-modal." + m_id).children(".mission").children(".m-head").children(".m-head-left").html('<p style="float: left">' + missions[m_id]["name"] + '<button class="edit" style="float: none" onclick="editMissionName(' + m_id + ')">&#9881;</button></p>');
}

function saveMissionName(m_id){
    const name = $(".edit-mission-modal." + m_id).children(".mission").children(".m-head").children(".m-head-left").children("input").val();
    if (!checkName(name)){
        alert("Mission name invalid.");
        return;
    }
    const uMission = {
        id : parseInt(m_id),
        name : name,
        description : missions[m_id]["description"],
        start_date : missions[m_id]["start_date"],
        end_date : missions[m_id]["end_date"],
        members : missions[m_id]["members"]
    }
    
    $.post("https://www.oneupsales.io/tech-test/create-mission", function(uMission, status){
        if (status == "success"){
            missions[m_id]["name"] = name;
            updateCard(m_id);
            $(".edit-mission-modal." + m_id).children(".mission").children(".m-head").children(".m-head-left").html('<p style="float: left">' + name + '</p><button class="edit" style="float: left" onclick="editMissionName(1157)">&#9881;</button><p style="color: red; display : block; float: left; padding-left: 10px">Saved</p>');
        }else {
            console.log(status);
        }
    });
}

function editMissionName(m_id){
    $(".edit-mission-modal." + m_id).children(".mission").children(".m-head").children(".m-head-left").children().remove()
    
    $(".edit-mission-modal." + m_id).children(".mission").children(".m-head").children(".m-head-left").append('<input style="width: 50%" type="text" placeholder="' + missions[m_id]["name"] + '">');
    $(".edit-mission-modal." + m_id).children(".mission").children(".m-head").children(".m-head-left").append('<button onclick="saveMissionName(' + m_id + ')">Save</button>');
    $(".edit-mission-modal." + m_id).children(".mission").children(".m-head").children(".m-head-left").append('<button onclick="cancelMissionName(' + m_id + ')">Cancel</button>');
}

//Mission Description
function cancelMissionDesc(m_id){
    $(".edit-mission-modal." + m_id).children(".mission").children(".m-body").children(".m-desc").html('<p class="m-players">' + missions[m_id]["description"] + '<button class="edit" onclick="editMissionDesc(' + m_id + ')">&#9881;</button></p>')
}

function saveMissionDesc(m_id){
    const desc = $(".edit-mission-modal." + m_id).children(".mission").children(".m-body").children(".m-desc").children("input").val();
    if (!checkDesc(desc)){
        alert("Mission description invalid.");
        return;
    }
    const uMission = {
        id : parseInt(m_id),
        name : missions[m_id]["name"],
        description : desc,
        start_date : missions[m_id]["start_date"],
        end_date : missions[m_id]["end_date"],
        members : missions[m_id]["members"]
    }
    
    
    $.post("https://www.oneupsales.io/tech-test/create-mission", function(uMission, status){
        if (status == "success"){
            missions[m_id]["description"] = desc;
            updateCard(m_id);
            $(".edit-mission-modal." + m_id).children(".mission").children(".m-body").children(".m-desc").html('<p style="float: left">' + desc + '</p><button style="float: left" class="edit" onclick="editMissionDesc(' + m_id + ')">&#9881;</button><p style="color: red; display : block; float: left; padding-left: 10px">Saved</p>');
        }else {
            console.log(status);
        }
    });
}

function editMissionDesc(m_id){
    $(".edit-mission-modal." + m_id).children(".mission").children(".m-body").children(".m-desc").children().remove()
   
    
    $(".edit-mission-modal." + m_id).children(".mission").children(".m-body").children(".m-desc").append('<input style="width: 50%" type="text" placeholder="' + missions[m_id]["description"] + '">');
    $(".edit-mission-modal." + m_id).children(".mission").children(".m-body").children(".m-desc").append('<button onclick="saveMissionDesc(' + m_id + ')">Save</button>');
    $(".edit-mission-modal." + m_id).children(".mission").children(".m-body").children(".m-desc").append('<button onclick="cancelMissionDesc(' + m_id + ')">Cancel</button>');
}

//Add Mission
function closeNewMission(){
    $(".edit-prize-modal.new").remove();
}

function saveNewMission(){
    const missionDetailsModal = $(".edit-prize-modal.new");
    
    if (missionDetailsModal == 'undefined'){return}
    
    const name = missionDetailsModal.children(".edit-prize").children(".create-mission-name").children("p").children("input").val(),
          desc =  missionDetailsModal.children(".edit-prize").children(".create-mission-description").children("p").children("input").val(),
          metric = missionDetailsModal.children(".edit-prize").children(".create-mission-metric").children("p").children("select").val(),
          startDate = missionDetailsModal.children(".edit-prize").children(".create-mission-start-date").children("p").children("input").val(),
          endDate = missionDetailsModal.children(".edit-prize").children(".create-mission-end-date").children("p").children("input").val();
    
    const startDateCheck = checkDate(startDate),
          endDateCheck = checkDate(endDate);
    let dateCheck = true;
    
    if (startDateCheck && endDateCheck){
        if (startDate > endDate){dateCheck = false}
        else{dateCheck = true}
    } else{
        dateCheck = false;
    }
    if (!checkName(name) || !checkDesc(desc) || !dateCheck){
        alert("One of the inputs doesn't fit the criteria.");
        return;
    }
    
    const newMissionDetails = {
        "name" : name,
        "description" : desc,
        "metric_id" : metric,
        "start_date" : startDate,
        "end_date" : endDate,
        "members" : []
    }
    
    
    
    $.post("https://www.oneupsales.io/tech-test/create-mission", function(newMissionDetails, status){
        if (status == "success"){
            const pos = Math.max.apply(null, Object.keys(missions).filter(isFinite)) + 1;
            missions[pos] = {};
            missions[pos]["id"] = pos;
            missions[pos]["name"] = name;
            missions[pos]["description"] = desc;
            missions[pos]["start_date"] = startDate.substr(11) + ":00 " + startDate.substr(8,2) + "/" + startDate.substr(5, 2) + "/" + startDate.substr(0,4);
            missions[pos]["end_date"] = endDate.substr(11) + ":00 " + endDate.substr(8,2) + "/" + endDate.substr(5, 2) + "/" + endDate.substr(0,4);
            missions[pos]["metric_id"] = metric;
            missions[pos]["members"] = [];
            missions[pos]["performance"] = {};
            missions[pos]["prizes"] = [];

            $(".mission.add").remove();
            let newMissionCard = missionDemo.clone(),
                newAddNewCard = missionDemo.clone();
            createCard(newMissionCard, missions, pos);
            createAddMissionCard(newAddNewCard);
            closeNewMission();
            newMissionCard.appendTo($("#main-container"));
            newAddNewCard.appendTo($("#main-container"));
            alert("Added new mission.");
        }else{
            alert("New mission couldn't be saved. Please try again later.");
            console.log(status);
        }
    });
}

function addMission(){
    let newMission = editPrizeClone.clone();
    
    newMission.attr("class", "edit-prize-modal new");
    
    newMission.children(".edit-prize").children(".edit-prize-save").attr("onclick", "saveNewMission()");
    newMission.children(".edit-prize").children(".edit-prize-close").attr("onclick", "closeNewMission()");
    
    newMission.children(".edit-prize").append('<div class="edit-prize-option create-mission-name"><p>Name: <input name="name"></p></div>');
    
    newMission.children(".edit-prize").append('<div class="edit-prize-option create-mission-description"><p>Description: <input name="desc"></p></div>');
    
    newMission.children(".edit-prize").append('<div class="edit-prize-option create-mission-metric"><p>Metric: <select></select></p></div>');
    
    $.each(metrics, function(i, metric){
         newMission.children(".edit-prize").children(".create-mission-metric").children("p").children("select").append('<option value="' + i + '">' + metric["name"] + '</option>');
    });
    
    newMission.children(".edit-prize").append('<div class="edit-prize-option create-mission-start-date"><p>Start Date: <input type="datetime-local" name="start"></p></div>');
    
    newMission.children(".edit-prize").append('<div class="edit-prize-option create-mission-end-date"><p>End Date: <input type="datetime-local" name="end"></p></div>');
    
    newMission.attr("hidden", false);
    newMission.appendTo("#main-container");
}

//Overall Mission
function closeEdit(m_id){
    if ($(".edit-mission-modal." + m_id)){
        $(".edit-mission-modal." + m_id).remove();
    }
}

function editMission(m_id){
    let eMission = editMissionClone.clone();
    eMission.attr("hidden", false);
    eMission.attr("class", "edit-mission-modal " + m_id);
    createCard(eMission.children(".mission"), missions, m_id, false);
    // change button to a close one
    eMission.children(".mission").children(".m-head").children(".m-head-right").children("button").attr("onclick", "closeEdit(" + m_id + ")");
    eMission.children(".mission").children(".m-head").children(".m-head-left").children("p").append('<button class="edit" style="float: none" onclick="editMissionName(' + m_id + ')">&#9881;</button>');
    
    // move description across and remove playercount (playerlist is later on)
    eMission.children(".mission").children(".m-body").children(".m-desc").children(".m-players").html(eMission.children(".mission").children(".m-body").children(".m-desc").children(".m-task").html());
    eMission.children(".mission").children(".m-body").children(".m-desc").children(".m-task").remove();
    eMission.children(".mission").children(".m-body").children(".m-desc").children(".m-players").append('<button class="edit" onclick="editMissionDesc(' + m_id + ')">&#9881;</button>');
    
    $.each(eMission.children(".mission").children(".m-body").children(".prize"), function(i, obj){
        $(obj).children(".p-prog").children(".p-text").children("p").append('<button class="edit" onclick="editPrize(' + m_id + ', ' + $(obj).attr("class").substr(6) + ')">&#9881;</button>')
    });
    
    eMission.children(".mission").children(".m-body").append('<div class="prize"><div class="p-prog p-prog-0" style="width: 0"><div class="p-text"><button class="edit" style="font-size: 1em; margin: 0" onclick="addPrize(' + m_id + ')">+ Add new Objective</button></p></div></div></div>');
    eMission.children(".mission").children(".m-body").append('<div class="performance"></div>')
    
    $.each(missions[m_id]["performance"], function(i, count){
        eMission.children(".mission").children(".m-body").children(".performance").append('<p>' + members[i]["forename"] + ' ' + members[i]["surname"] + ': ' + count + '</p>');
    });
     eMission.children(".mission").children(".m-body").children(".performance").append('<button onclick="addMembers(' + m_id + ')">Add Member</button>')
    
    eMission.appendTo("#main-container");
}