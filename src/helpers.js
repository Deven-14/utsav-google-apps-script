function getFolderNames() {
    const folders = DriveApp.getFolderById("1Wl_5fnDHlj-K_-qJlPywRjCyCh9_WuNZ").getFolders();
    const clubIds = [];
    while (folders.hasNext()) {
        var folder = folders.next();
        clubIds.push(folder.getName().split("_")[0])
        // Logger.log(folder.getName());
    }
    Logger.log(clubIds);
}
