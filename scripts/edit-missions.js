const editMissionClone = $(".edit-mission").clone();
let descClone;

// PRIZES
//Display Prize options
function editPrize(m_id, p_id){
    let prize = $(".edit-mission").children(".mission").children(".m-body").children(".prize." + p_id);
    $(prize).attr("style", "height: 20em");
    $(prize).children(".p-prog").append('<div class="p-text"><p>Hello World!</p></div>');
}


//MISSIONS
//Mission Name
function cancelMissionName(m_id){
    $(".edit-mission." + m_id).children(".mission").children(".m-head").children(".m-head-left").html('<p style="float: left">' + missions[m_id]["name"] + '<button class="edit" style="float: none" onclick="editMissionName(' + m_id + ')">&#9881;</button></p>')
}

function saveMissionName(m_id){
    const name = $(".edit-mission." + m_id).children(".mission").children(".m-head").children(".m-head-left").children("input").val();
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
            $(".edit-mission." + m_id).children(".mission").children(".m-head").children(".m-head-left").html('<p style="float: left">' + name + '</p><button class="edit" style="float: left" onclick="editMissionName(1157)">&#9881;</button><p style="color: red; display : block; float: left; padding-left: 10px">Saved</p>');
        }else {
            console.log(status);
        }
    });
}

function editMissionName(m_id){
    $(".edit-mission." + m_id).children(".mission").children(".m-head").children(".m-head-left").children().remove()
    
    $(".edit-mission." + m_id).children(".mission").children(".m-head").children(".m-head-left").append('<input style="width: 50%" type="text" placeholder="' + missions[m_id]["name"] + '">');
    $(".edit-mission." + m_id).children(".mission").children(".m-head").children(".m-head-left").append('<button onclick="saveMissionName(' + m_id + ')">Save</button>');
    $(".edit-mission." + m_id).children(".mission").children(".m-head").children(".m-head-left").append('<button onclick="cancelMissionName(' + m_id + ')">Cancel</button>');
}

//Mission Description
function cancelMissionDesc(m_id){
    $(".edit-mission." + m_id).children(".mission").children(".m-body").children(".m-desc").html('<p class="m-players">' + missions[m_id]["description"] + '<button class="edit" onclick="editMissionDesc(' + m_id + ')">&#9881;</button></p>')
}

function saveMissionDesc(m_id){
    const desc = $(".edit-mission." + m_id).children(".mission").children(".m-body").children(".m-desc").children("input").val();
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
            $(".edit-mission." + m_id).children(".mission").children(".m-body").children(".m-desc").html('<p style="float: left">' + desc + '</p><button style="float: left" class="edit" onclick="editMissionDesc(' + m_id + ')">&#9881;</button><p style="color: red; display : block; float: left; padding-left: 10px">Saved</p>');
        }else {
            console.log(status);
        }
    });
}

function editMissionDesc(m_id){
    $(".edit-mission." + m_id).children(".mission").children(".m-body").children(".m-desc").children().remove()
   
    
    $(".edit-mission." + m_id).children(".mission").children(".m-body").children(".m-desc").append('<input style="width: 50%" type="text" placeholder="' + missions[m_id]["description"] + '">');
    $(".edit-mission." + m_id).children(".mission").children(".m-body").children(".m-desc").append('<button onclick="saveMissionDesc(' + m_id + ')">Save</button>');
    $(".edit-mission." + m_id).children(".mission").children(".m-body").children(".m-desc").append('<button onclick="cancelMissionDesc(' + m_id + ')">Cancel</button>');
}

//Overall Mission
function closeEdit(m_id){
    if ($(".edit-mission." + m_id)){
        $(".edit-mission." + m_id).remove();
    }
}

function editMission(m_id){
    let eMission = editMissionClone.clone();
    eMission.attr("hidden", false);
    eMission.attr("class", "edit-mission " + m_id);
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
    
    eMission.appendTo("#main-container");
}