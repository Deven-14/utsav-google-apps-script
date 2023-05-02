
function getAllEvents() {

    const findAPIEndPoint = "https://ap-south-1.aws.data.mongodb-api.com/app/data-jbvpx/endpoint/data/v1/action/find";

    const clusterName = "utsav23";

    const apikey = "hx9HWIGKBdf0A6MrmwhpixuzHKDs3WbEzDAs0DP6yyjFzpnPEWmcpoBLLlkdwnr2";

    const payload = {

        //We can Specify sort, limit and a projection here if we want

        collection: "events", database: "test", dataSource: clusterName

    }

    const options = {

        method: 'post',

        contentType: 'application/json',

        payload: JSON.stringify(payload),

        headers: { "api-key": apikey }

    };

    const response = UrlFetchApp.fetch(findAPIEndPoint, options);

    const events = JSON.parse(response.getContentText()).documents;

    // console.log(Object.keys(events[0]));

    return events

}

function ReloadEventData() {
    const data = getAllEvents();
    reloadSpreadsheet("1ErivG4gk4LZaB0VDw8_GHB8aB3HbEXLUbQj64X-MBRs", data);
    console.log("done reloadEventData");
}

function ReloadEventDataTrigger() {
    ScriptApp.newTrigger("ReloadEventData").forSpreadsheet("1ErivG4gk4LZaB0VDw8_GHB8aB3HbEXLUbQj64X-MBRs").onOpen().create();
}