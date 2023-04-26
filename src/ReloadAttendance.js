function reloadAttendance() { // MAIN function

    var responseCode = 200;
    try {


        const attendances = getAttendances();
        const attendances_rows = getAttendancesAsRows(attendances);
        addRowsToAttendanceSheet(attendances_rows);


    } catch (error) {
        responseCode = 400;
    }
    return responseCode;


}




function getAttendances() {


    const token = "346433c5cdf018029041";
    const url = `https://backend.phaseshift.in/a/attendances`;
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




function getAttendancesAsRows(attendances) {


    const rows = [];
    for (let attendance of attendances) {

        let row = [];
        row.push(attendance.eventId);
        row.push(attendance.taxnId);
        row.push(attendance.loginEmail);


        for (let participant of attendance.participants) {
            row.push(participant.name);
            row.push(participant.email);
        }


        rows.push(row);


    }
    return rows;


}




function addRowsToAttendanceSheet(rows) {


    const MAIN_ALL_EVENTS_SSID = "1leHpgRgo9sPijFk11-phEYu5XG25qmLTmLA7S_rJsEc";
    const range = "Attendance!A:Z";


    Sheets.Spreadsheets.Values.clear(
        {},
        MAIN_ALL_EVENTS_SSID,
        range
    );



    const resource = {
        range: range,
        majorDimension: "ROWS",
        values: rows
    };


    const otherArguments = {
        valueInputOption: "USER_ENTERED"
    };

    // use update instead of append vvvviiimmmpppp.... or else rows increases drastically and the sheet gets stuck
    Sheets.Spreadsheets.Values.update(
        resource,
        MAIN_ALL_EVENTS_SSID,
        range,
        otherArguments
    );


}


  // function addTriggers() {
  //   ScriptApp.newTrigger("reloadAttendance").timeBased().atHour(16).nearMinute(30).everyDays(1).create();
  // }
