function addImportrangePermission(ssId, donorId) {
    // id of the spreadsheet to add permission to import
    // const ssId = "1O7hUqBjR_DCeuvtbmnrUAdhHH_P1Nk8nYgVAM5tD1n8";


    // donor or source spreadsheet id, you should get it somewhere
    // const donorId = "1cd_YYyuLiqRk74Wc8r3eR-aTwQEYi_AWxMGQZIprw00";


    // adding permission by fetching this url
    const url = `https://docs.google.com/spreadsheets/d/${ssId}/externaldata/addimportrangepermissions?donorDocId=${donorId}`;


    const token = ScriptApp.getOAuthToken();


    const params = {
        method: 'post',
        headers: {
            Authorization: 'Bearer ' + token,
        },
        muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, params);


    // Logger.log(response.getResponseCode());
    // Logger.log(response.getContentText());
    // Logger.log(response);
    return response.getResponseCode();
}




function addReadPermissions(fildId, emailIds) {
    var responseCode = 200;


    try {


        const file = DriveApp.getFileById(fildId);
        const viewers = file.getViewers();


        const emailIdsWithViewAccess = new Set();
        viewers.forEach((viewer) => { emailIdsWithViewAccess.add(viewer.getEmail()); });


        const emailIdsWithoutViewAccess = [];
        emailIds.forEach((emailId) => {
            if (!emailIdsWithViewAccess.has(emailId)) {
                emailIdsWithoutViewAccess.push(emailId);
            }
        });


        if (emailIdsWithoutViewAccess.length > 0) {
            file.addViewers(emailIdsWithoutViewAccess);
        }


    } catch (error) {
        Logger.log(error);
        responseCode = 400;
    }


    return responseCode;
}




function doGet(request) {
    const operation = request.parameter.operation;
    const output = ContentService.createTextOutput();
    var error = true;
    var res_status_code = 400;
    Logger.log("operation - " + operation);


    if (operation == "AddImportRangePermission") {


        let ssId = request.parameter.ssId;
        let donorId = request.parameter.donorId;
        res_status_code = addImportrangePermission(ssId, donorId);
        Logger.log("ssId - " + ssId);
        Logger.log("donorId - " + donorId);


    } else if (operation == "AddReadPermissions") {


        let fileId = request.parameter.fileId;
        let emailIds = request.parameters["emailIds[]"];
        Logger.log("fileId - " + fileId);
        Logger.log("emailIds - " + emailIds);
        res_status_code = addReadPermissions(fileId, emailIds);


    } else if (operation == "ReloadAttendance") {


        res_status_code = reloadAttendance()


    }

    if (res_status_code == 200) {
        error = false;
    }


    output.append(JSON.stringify({ error: error, status: res_status_code }));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
}
