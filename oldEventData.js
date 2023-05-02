
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

    console.log(Object.keys(events[0]));

    return events

}

function setHeaders(sheet, eventHeaders) {

    eventHeaders.shift() // remove _id
    eventHeaders.pop()  // remove __v

    sheet.getRange("A1:W1").setValues([eventHeaders]).setBackground("black").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center").setVerticalAlignment("middle").setWrap(true).setFontSize(12);

}

function countAndJoin(arr) {

    let str = ""
    arr.forEach((ele, index) => {
        str += (index + 1) + ". " + ele + "\n"
    })
    return str
}

function getEventParticipationAsString(eventParticipation) {
    
    let str = ""
    str += eventParticipation.participationType
    str += "\nMin: " + eventParticipation.minParticipants
    str += "\nMax: " + eventParticipation.maxParticipants
    return str

}

function getCoordinatorsAsString(coordinators) {
    
    let str = ""
    coordinators.forEach((coordinator) => {
        str += coordinator.name + "\n" + coordinator.email + "\n" + coordinator.phone + "\n\n"
    })
    return str

}

function join(arr) {
    if (arr == undefined || arr == null) {
        return ""
    }

    return arr.join("\n")
}

function reloadAllEvents() {

    const events = getAllEvents();

    const spreadsheet = SpreadsheetApp.openById("1ErivG4gk4LZaB0VDw8_GHB8aB3HbEXLUbQj64X-MBRs");

    const sheet = spreadsheet.getSheetByName("Sheet1");

    let lastRow = sheet.getLastRow();
    if(lastRow != 0) {
      sheet.getRange(`A1:W${lastRow}`).clear();
    }

    setHeaders(sheet, Object.keys(events[0]));

    const rows = [];
    for(let event of events) {

        let row = [
            event.eventId,
            event.eventName,
            event.description,
            event.category,
            event.club,
            event.isIEEE,
            event.regFee,
            event.ieeeRegFee,
            event.eventMode,
            event.imageurl,
            event.stoponlineregs,
            event.stopspotregs,
            event.stopallregs,
            join(event.eventType),
            countAndJoin(event.rules),
            countAndJoin(event.prize),
            event.venue,
            getEventParticipationAsString(event.eventParticipation[0]),
            getCoordinatorsAsString(event.coordinators),
            join(event.sponsorsDetails), // TODO: fix this later
            join(event.resourcePersonDetails),
            event.createdAt,
            event.updatedAt,
        ];

        rows.push(row);

    }

    sheet.getRange(`A2:W${rows.length + 1}`).setValues(rows);

    console.log("done");

}


function ReloadAllEventsTrigger() {
    ScriptApp.newTrigger("reloadAllEvents").forSpreadsheet("1ErivG4gk4LZaB0VDw8_GHB8aB3HbEXLUbQj64X-MBRs").onOpen().create();
}