
function ReloadLogData() {
    const data = fetchDataFromBackendUrl("http://139.59.82.33:5700/logsdata");
    reloadSpreadsheet("1JgUKjdGY6_3h52aRm5VBoE6sGFHe8JyKEg6ri_ICEw0", data);
    console.log("done reloadLogData");
}

function ReloadLogDataTrigger() {
    ScriptApp.newTrigger("ReloadLogData").forSpreadsheet("1JgUKjdGY6_3h52aRm5VBoE6sGFHe8JyKEg6ri_ICEw0").onOpen().create();
}

function ReloadSponsorshipData() {
    const data = fetchDataFromBackendUrl("http://139.59.82.33:5700/sponsordata");
    reloadSpreadsheet("13QNkh1dsrnCsWsYNv1d3oPmnTfLFFcDYMbTfOvkouJk", data);
    console.log("done reloadSponsorshipData");
}

function ReloadSponsorshipDataTrigger() {
    ScriptApp.newTrigger("ReloadSponsorshipData").forSpreadsheet("13QNkh1dsrnCsWsYNv1d3oPmnTfLFFcDYMbTfOvkouJk").onOpen().create();
}

