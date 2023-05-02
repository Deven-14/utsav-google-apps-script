function formatDate(date) {
    d = new Date(date);
    return d.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  }
  
  function flattenObject(object) {
    var result = {};
  
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        var value = object[key];
        if (typeof value === "object") {
          var flattened = flattenObject(value);
          for (var subKey in flattened) {
            if (flattened.hasOwnProperty(subKey)) {
              var subValue = flattened[subKey];
              result[key + " " + subKey] = subValue;
            }
          }
        } else {
          if (key === 'createdAt' || key === 'updatedAt') {
            result[key] = formatDate(value)
          } else {
            result[key] = value;
          }
        }
      }
    }
  
    return result;
  }
  
  
  
  function fetchDataFromUrlAndAddToSheet() {
  
    var headers = {
      "Authorization": "Bearer 346433c5cdf018029041",
    };
  
  
    // Replace <URL> with the URL that returns the JSON data
    var url = "http://139.59.82.33:5700/logsdata";
    var response = UrlFetchApp.fetch(url, { 'method': "post", "headers": headers });
    var json = response.getContentText();
    var data = JSON.parse(json);
  
    // Replace <SheetName> and <SheetRange> with the name of the sheet and range where you want to add the data
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    
  
    let flattenedData = data.map(item => flattenObject(item))
  
  
    // Convert the data to a 2D array
    var values = flattenedData.map(function(row) {
      return Object.keys(row).map(function(key) {
        return row[key];
      });
    });
  
    console.log("values", values[0])
  
    var keys = Object.keys(flattenedData[0])
  
    // console.log(keys)
  
    const finalValues = [keys, ...values]
  
    console.log(finalValues[1])
  
    var range = sheet.getRange(1,1, flattenedData.length + 1, keys.length);
  
    // Set the values in the sheet
    range.setValues(finalValues);
  }
  
  fetchDataFromUrlAndAddToSheet();
  
  
  