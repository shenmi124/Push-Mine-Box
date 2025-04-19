let SAVEEDIT = {}

function saveEdit(){
    SAVEEDIT = {
        type: document.getElementById("editType").value,
        choose: document.getElementById("editChoose").value,
        data: document.getElementById("editData").value,
        meta: [document.getElementById("editMetaMain").value, document.getElementById("editMetaSide").value],
        info: document.getElementById("editInfo").value
    }
}

function loadEdit(){
    edit(SAVEEDIT)
}