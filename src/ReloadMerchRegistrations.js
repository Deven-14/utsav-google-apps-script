function ReloadMerchRegistrations() { // MAIN function

    const registrations = fetchDataFromBackendUrl("https://backend.bmsutsav.in/merch/registrations");    
    const rows = getMerchRegistrationsAsRows(registrations);
    const headers = [
        "Ticket ID", 
        "Campaigner Email", 
        "Amount", 
        "Name", 
        "Email", 
        "Phone",
        "Color",
        "College",
        "Type",
        "Sizes",
        "TIMESTAMP"
    ];
    const merchRegistrationSSID = "14Xa6FHSybrf6mR-BmiGmtjil70gtQ1j4y2cnkpAw3yc";

    addToSpreadsheet(merchRegistrationSSID, "Sheet1", headers, rows);

    console.log("done reloadMerchRegistrations");

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
            registration.color.join(","),
            registration.college,
            registration.type,
            registration.sizes.join(","),
            formatDate(registration.updatedAt)
        ]);

    }

    return rows;

}


function ReloadMerchRegistrationsTrigger() {
    ScriptApp.newTrigger("ReloadMerchRegistrations").timeBased().everyHours(3).create();
}
