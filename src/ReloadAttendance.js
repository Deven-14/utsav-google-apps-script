function ReloadAttendance() { // MAIN function

    var responseCode = 200;
    try {

        const attendances = fetchDataFromBackendUrl("https://backend.bmsutsav.in/a/attendances");
        const attendances_rows = getAttendancesAsRows(attendances);
        const headers = getAttendanceSheetHeaders();
        addToSpreadsheet("1SgYXOdSoiANVHAgEwWsPTKaFu_KoUwOUtsN9LYfzCmo", "Attendance", headers, attendances_rows);

    } catch (error) {
        responseCode = 400;
    }
    return responseCode;

}


function getAttendanceSheetHeaders() {

    const headers = [
        "Event ID",
        "Ticket ID",
        "Campaigner Email",
    ];
    const MAX_PARTICIPANTS_PER_TEAM = 15; // * Mannualy set this value
    for (let i = 0; i < MAX_PARTICIPANTS_PER_TEAM; i++) {
        headers.push(`Participant ${i+1} Name`);
        headers.push(`Participant ${i+1} Email`);
    }
    return headers;

}


function getAttendancesAsRows(attendances) {

    const MAX_PARTICIPANTS_PER_TEAM = 15; // * Mannualy set this value
    const MAX_ARRAY_LENGHT = 3 + MAX_PARTICIPANTS_PER_TEAM * 2;
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

        let newRow = row.concat(Array(MAX_ARRAY_LENGHT - row.length).fill(""));
        rows.push(newRow);        

    }
    return rows;

}

function ReloadAttendanceTrigger() {
    ScriptApp.newTrigger("ReloadAttendance").timeBased().everyHours(3).create();
}


function ChangeAttendanceFormula() {
    const registrationsFolder = DriveApp.getFolderById("1hnP1gibt8sU6L8pN7jwWvL7ehjdYZapT");
    const folders = registrationsFolder.getFolders();
    while (folders.hasNext()) {
        let clubFolder = folders.next();
        let files = clubFolder.getFiles();
        while (files.hasNext()) {
            let file = files.next();
            let sheet = SpreadsheetApp.openById(file.getId()).getSheetByName("Attendance");
            let range = sheet.getRange(1, 1);
            let formula = range.getFormula();
            let newFormula = formula.replace("A:Z", "A:AG");
            range.setFormula(newFormula);
            console.log("done - ", file.getName());
        }
        console.log("done - ", clubFolder.getName());
    }

}