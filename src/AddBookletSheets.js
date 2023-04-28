function getColumn(activeSheet, columnIndex) {
    return activeSheet.getRange(1, columnIndex)
        .getDataRegion(SpreadsheetApp.Dimension.ROWS)
        .getValues()
        .flat();
}


function addBookletSheet(booklet) {


    const spreadsheet = SpreadsheetApp.openById(booklet.spreadsheetId);
    const sheets = spreadsheet.getSheets();


    const existingBookletSheets = new Set();
    sheets.forEach(sheet => existingBookletSheets.add(sheet.getName()));


    const allBooklets = getColumn(SpreadsheetApp.openById(booklet.bookletsTracker).getSheetByName("Sheet1"), 1);


    const newBooklets = allBooklets.filter(booklet => !existingBookletSheets.has(booklet));


    const { spreadsheetId, range, taxnIdCol } = booklet.registrations;
    newBooklets.forEach(booklet => {
        let sheet = spreadsheet.insertSheet(booklet);
        let formula = `=QUERY(IMPORTRANGE("${spreadsheetId}", "${range}"), "select * where Col${taxnIdCol} like 'pass-${booklet}-%'")`
        sheet.appendRow([formula]);
    });

    console.log(newBooklets);

}


function AddCampainingBooklet(e) {

    const campainingBooklet = {
        spreadsheetId: "1T24Xk_G5mFBo-Tc5U7wKVwh5kIFgsakyKrLAccT2D-4",
        bookletsTracker: "1gPQDzSkFdQ8dYidrKmBB4l838ioCjj4DbA2L8c0RlsI",
        registrations: {
            spreadsheetId: "1SgYXOdSoiANVHAgEwWsPTKaFu_KoUwOUtsN9LYfzCmo",
            range: "Sheet1!A:Z",
            taxnIdCol: 2
        }
    }

    addBookletSheet(campainingBooklet)

    console.log("Campaining - new booklets");

}


function AddMerchBooklet(e) {

    const merchBooklet = {
        spreadsheetId: "1T24Xk_G5mFBo-Tc5U7wKVwh5kIFgsakyKrLAccT2D-4",
        bookletsTracker: "1gPQDzSkFdQ8dYidrKmBB4l838ioCjj4DbA2L8c0RlsI",
        registrations: {
            spreadsheetId: "1SgYXOdSoiANVHAgEwWsPTKaFu_KoUwOUtsN9LYfzCmo",
            range: "Sheet1!A:Z",
            taxnIdCol: 2
        }
    }

    addBookletSheet(merchBooklet)

}



function CampainingBookletTrigger() {
    const ss = SpreadsheetApp.openById("1gPQDzSkFdQ8dYidrKmBB4l838ioCjj4DbA2L8c0RlsI")
    ScriptApp.newTrigger("AddCampainingBooklet").forSpreadsheet(ss).onChange().create();    
}