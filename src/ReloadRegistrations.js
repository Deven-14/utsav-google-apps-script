function ReloadRegistrations() { // acts as main function

    const registrations = fetchDataFromBackendUrl("https://backend.bmsutsav.in/r/registrations");
    
    const eventsSmall = fetchDataFromBackendUrl("https://backend.bmsutsav.in/api/getEventsSmall");
    const events = convertEventsSmallToEvents(eventsSmall);

    const headers = ["Event ID", "Ticket ID", "Campaigner Email", "Event Name", "Amount", "Participant Name", "Participant Email", "Participant Phone", "Participant College", "TIMESTAMP"];
    const rows = getRegistrationsAsRows(registrations, events);

    addToSpreadsheet("1SgYXOdSoiANVHAgEwWsPTKaFu_KoUwOUtsN9LYfzCmo", "Sheet1", headers, rows);

    console.log("done reloadRegistrations");

}


function convertEventsSmallToEvents(eventsSmall) {
    const clubs = eventsSmall;
    const events = {};

    for (let clubId in clubs) {
        let club = clubs[clubId];
        for (let eventId in club) {
            events[eventId] = club[eventId];
        }
    }

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


function ReloadRegistrationsTrigger() {
    ScriptApp.newTrigger("ReloadRegistrations").timeBased().everyHours(3).create();
}
