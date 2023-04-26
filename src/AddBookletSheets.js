function getColumn(activeSheet, columnIndex) {
    return activeSheet.getRange(1, columnIndex)
        .getDataRegion(SpreadsheetApp.Dimension.ROWS)
        .getValues()
        .flat();
}


function addBookletSheet(dept, booklet) {


    const spreadsheet = SpreadsheetApp.openById(booklet.spreadsheetId);
    const sheets = spreadsheet.getSheets();


    const existingBookletSheets = new Set();
    sheets.forEach(sheet => existingBookletSheets.add(sheet.getName()));


    const allBooklets = getColumn(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(dept), 1);


    const newBooklets = allBooklets.filter(booklet => !existingBookletSheets.has(booklet));


    const { spreadsheetId, range, taxnIdCol } = booklet.registrations;
    newBooklets.forEach(booklet => {
        let sheet = spreadsheet.insertSheet(booklet);
        let formula = `=QUERY(IMPORTRANGE(${spreadsheetId}, ${range}), "select * where Col${taxnIdCol} like 'pass-${booklet}-%'")`
        sheet.appendRow([formula]);
    });


    Logger.log(dept + " new booklets");
    Logger.log(newBooklets);


}


const booklets = {
    "Campaigning": {
        spreadsheetId: "1SVmMCNhPsVGggK7cDFFvjSTuXO1xu6V-20gYgzUa_KQ",
        registrations: {
            spreadsheetId: "1leHpgRgo9sPijFk11-phEYu5XG25qmLTmLA7S_rJsEc",
            range: "Sheet1!A:Z",
            taxnIdCol: 2
        }
    },
    "Merch": {
        spreadsheetId: "1JLU6ffY-oe4JRxhAdyo2cutlylo-yndG9zZ4NflRQw0",
        registrations: {
            spreadsheetId: "15Yr92IgvBzg_ne2H0BkVBKVCljlz3GW4vFj8_5iWqqQ",
            range: "Sheet1!A:Z",
            taxnIdCol: 1
        }
    }
}




function onChange(e) {


    // google bug, so won't work


    // const activeSheet = e.getActiveSheet();
    // const sheetName = activeSheet.getName();
    // const booklet = booklets[sheetName];
    // addBookletSheet(booklet);


    // work around
    for (let dept in booklets) {
        addBookletSheet(dept, booklets[dept]);
    }


}
