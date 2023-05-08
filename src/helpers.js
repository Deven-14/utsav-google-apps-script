
function formatDate(date) {
    d = new Date(date);
    return d.toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hourCycle: 'h12'  })
}

function fetchDataFromBackendUrl(url) {

    const token = "346433c5cdf018029041"
    const params = {
        method: 'post',
        headers: {
            Authorization: 'Bearer ' + token,
        }
    };
    const response = UrlFetchApp.fetch(url, params);

    return JSON.parse(response.getContentText());
}

function setSheetHeaders(sheet, headers) {

    const range = sheet.getRange(1, 1, 1, headers.length);

    range.setValues([headers]).setBackground("black").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center").setVerticalAlignment("middle").setWrap(true).setFontSize(12);

}

function addValuesToSheet(sheet, values) {
    // values is an array of arrays
    // each array is a row
    const range = sheet.getRange(2, 1, values.length, values[0].length);

    const lastRow = sheet.getLastRow();
    if(lastRow != 0) {
        sheet.getRange(2, 1, lastRow, values[0].length).deleteCells(SpreadsheetApp.Dimension.ROWS);
    }

    range.setValues(values);
}

function addToSpreadsheet(ssId, sheetName, headers, values) {

    const ss = SpreadsheetApp.openById(ssId);
    const sheet = ss.getSheetByName(sheetName);
    setSheetHeaders(sheet, headers);
    addValuesToSheet(sheet, values);

}

function flattenObject(object) {
    const result = {};

    for (let key in object) {
        if (object.hasOwnProperty(key)) {

            let value = object[key];
            if (typeof value === "object") {

                let flattened = flattenObject(value);

                delete flattened._id;
                delete flattened.createdAt;
                delete flattened.updatedAt;
                
                let values = Object.values(flattened);
                values.push("\n");
                result[key] = values.join("\n");

            } else if (key === 'createdAt' || key === 'updatedAt') {
                result[key] = formatDate(value)
            } else {
                result[key] = value;
            }
            
        }
    }
    
    return result;
}

function getAllHeaders(flattenedData) {
    const headers = new Set();

    for(let ele of flattenedData) {
        for(let key in ele) {
            if(ele.hasOwnProperty(key)) {
                headers.add(key);
            }
        }
    }

    return Array.from(headers);
}

function convertFlattenedDataTo2DArray(flattenedData, headers) {
    // Convert the data to a 2D array
    const values = flattenedData.map((row) => {
        return headers.map((key) => {
            return row[key];
        });
    });

    return values;
}

function reloadSpreadsheet(ssId, data) {

    const flattenedData = data.map(item => {
        delete item._id;
        delete item.__v;
        return flattenObject(item);
    });

    const headers = getAllHeaders(flattenedData);
    const values = convertFlattenedDataTo2DArray(flattenedData, headers);

    addToSpreadsheet(ssId, "Sheet1", headers, values);

    console.log("done reloadSpreadsheet");
    
}
