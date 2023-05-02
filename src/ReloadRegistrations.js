function reloadRegistrations() { // acts as main function


    const token = "346433c5cdf018029041";


    const registrations = getRegistrations(token);
    const events = getEvents(token);


    const rows = getRegistrationsAsRows(registrations, events);

    // Logger.log(rows);
    addRowsToMainSheet(rows);

    console.log("done reloadRegistrations");


}




function getRegistrations(token) {


    const url = `https://backend.bmsutsav.in/r/registrations`;
    const params = {
        method: 'post',
        headers: {
            Authorization: 'Bearer ' + token,
        }
    };
    const response = UrlFetchApp.fetch(url, params);


    // Logger.log(JSON.parse(response.getContentText()));
    return JSON.parse(response.getContentText());
}




function getEvents(token) {


    const url = `https://backend.bmsutsav.in/api/getEventsSmall`;
    const params = {
        method: 'post',
        headers: {
            Authorization: 'Bearer ' + token,
        }
    };
    const response = UrlFetchApp.fetch(url, params);


    // converting from club[clubId] = events TO events[eventId] = event
    const clubs = JSON.parse(response.getContentText());
    // Logger.log(clubs);
    // Logger.log(clubs["eee"])


    const events = {};
    for (let clubId in clubs) {
        let club = clubs[clubId];
        for (let eventId in club) {
            events[eventId] = club[eventId];
        }
    }


    // Logger.log(events["IEMLIO"]);
    return events;


}




function getRegistrationsAsRows(registrations, events) {


    const rows = [];
    for (let registration of registrations) {


        let eventName;
        try {
            eventName = events[registration.eventId].eventName;
        } catch (error) {
            Logger.log("scrapped eventId " + registration.eventId);
            throw error;
        }


        rows.push([
            registration.eventId,
            registration.taxnId,
            registration.campaigner,
            eventName,
            registration.amount,
            registration.name,
            registration.email,
            registration.phone,
            registration.college,
            registration.updatedAt
        ]);


    }
    return rows;


}




function addRowsToMainSheet(rows) {


    const MAIN_ALL_EVENTS_SSID = "1SgYXOdSoiANVHAgEwWsPTKaFu_KoUwOUtsN9LYfzCmo";


    const spreadsheet = SpreadsheetApp.openById(MAIN_ALL_EVENTS_SSID);
    const sheet = spreadsheet.getSheetByName("Sheet1");


    // adding additionaly rows
    const lastRow = sheet.getLastRow();
    if (lastRow < (rows.length + 1)) {
        sheet.insertRows(rows.length + 1 - lastRow);
    }


    sheet.getRange(`A2:J${lastRow}`).clear();


    // clearing and adding registrations again
    const range = sheet.getRange(`A2:J${rows.length + 1}`); // +1 coz of A2, the '2' ************* COLUMNS HAVE TO BE HARDCODED 'J'
    // range.clear();
    range.setValues(rows);


}



function ReloadRegistrationsTrigger() {
    ScriptApp.newTrigger("reloadRegistrations").timeBased().everyHours(3).create();
}
