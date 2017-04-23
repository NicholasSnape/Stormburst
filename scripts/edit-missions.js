const editMissionClone = $(".edit-mission").clone();

function editMission(m_id){
    let eMission = editMissionClone.clone();
    eMission.attr("hidden", false);
    createCard(eMission.children(".mission"), missions, m_id);
    // change button to a close one
    eMission.children(".mission").children(".m-head").children(".m-head-right").children("button").attr("onclick", "");
    
    
    eMission.appendTo("#main-container");
}