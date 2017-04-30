const editMissionClone = $(".edit-mission").clone();
let descClone;

function closeEdit(m_id){
    if ($(".edit-mission." + m_id)){
        $(".edit-mission." + m_id).remove();
    }
}

function saveDesc(m_id){
    const desc = $(".edit-mission." + m_id).children(".mission").children(".m-body").children(".m-desc").children("input").val();
    const uMission = {
        id : parseInt(m_id),
        description : desc,
        start_date : missions[m_id]["start_date"],
        end_date : missions[m_id]["end_date"],
        members : missions[m_id]["members"]
    }
    $.post("https://www.oneupsales.io/tech-test/create-mission", function(uMission, status){
        console.log(status);
        closeEdit(m_id);
    });
}

function editDesc(m_id){
    $(".edit-mission." + m_id).children(".mission").children(".m-body").children(".m-desc").append('<input style="width: 50%" type="text" placeholder="' + missions[m_id]["description"] + '">');
    $(".edit-mission." + m_id).children(".mission").children(".m-body").children(".m-desc").append('<button onclick="saveDesc(' + m_id + ')">Save</button>');
    $(".edit-mission." + m_id).children(".mission").children(".m-body").children(".m-desc").append('<button>Cancel</button>');
    
    descClone = $(".edit-mission." + m_id).children(".mission").children(".m-body").children(".m-desc").children("p").clone()
    $(".edit-mission." + m_id).children(".mission").children(".m-body").children(".m-desc").children("p").remove()
}

function editMission(m_id){
    let eMission = editMissionClone.clone();
    eMission.attr("hidden", false);
    eMission.attr("class", "edit-mission " + m_id);
    createCard(eMission.children(".mission"), missions, m_id);
    // change button to a close one
    eMission.children(".mission").children(".m-head").children(".m-head-right").children("button").attr("onclick", "");
    
    // move description accross and remove playercount (playerlist is later on)
    eMission.children(".mission").children(".m-body").children(".m-desc").children(".m-players").html(eMission.children(".mission").children(".m-body").children(".m-desc").children(".m-task").html());
    eMission.children(".mission").children(".m-body").children(".m-desc").children(".m-task").remove();
    eMission.children(".mission").children(".m-body").children(".m-desc").children(".m-players").append('<button class="edit" onclick="editDesc(' + m_id + ')">&#9881;</button>');
    
    eMission.appendTo("#main-container");
}