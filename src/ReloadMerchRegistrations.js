function reloadMerchRegistrations() { // MAIN function

    const registrations = getMerchRegistrations();
    const registrations_rows = getMerchRegistrationsAsRows(registrations);
    addRowsToMerchRegistrationsSheet(registrations_rows);


}




function getMerchRegistrations() {


    const token = "346433c5cdf018029041";
    const url = `https://backend.bmsutsav.in/merch/registrations`;
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




function getMerchRegistrationsAsRows(registrations) {


    const rows = [];


    for (let registration of registrations) {


        rows.push([
            registration.taxnId,
            registration.campaigner,
            registration.amount,
            registration.name,
            registration.email,
            registration.phone,
            registration.college,
            registration.type,
            registration.sizes.join(","),
            registration.updatedAt
        ]);


    }


    return rows;


}




function addRowsToMerchRegistrationsSheet(rows) {


    const spreadsheet = SpreadsheetApp.openById("15Yr92IgvBzg_ne2H0BkVBKVCljlz3GW4vFj8_5iWqqQ");
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




  // function addTriggers() {
  //   ScriptApp.newTrigger("reloadMerchRegistrations").timeBased().atHour(16).nearMinute(30).everyDays(1).create();
  // }
