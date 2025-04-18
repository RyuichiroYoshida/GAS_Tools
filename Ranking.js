const user = {
    userid: 0,
    name: "",
    password: "",
};

const ranking = {
  userid: 0,
  score: 0,
};

const musicData = ["music1"];

const id = "1zw5mVigLKu0TQhjDJ9lmbxSetSuyodEikY5x6Y0aufs";

function doGet(e) {
    switch (e.parameter.mode) {
        case "getAll":
            return getRecordsAsJson();
    }
}

function doPost(e) {
    const sheet = SpreadsheetApp.openById(id).getSheetByName("User");
    const rows = sheet.getDataRange().getValues();

    switch (e.parameter.mode) {
        case "user":
            const id = e.parameter.address;
            const name = e.parameter.name;
            const score = e.parameter.score;
            switch (e.parameter.route) {
                case "update":
                    return updateRecord(id, name, score);
                case "signUp":
                    return signUp(name, password);
                case "signIn":
                    return signIn(userId, name, password);
                default:
                    return false;
            }
        case "ranking":
            return getRecordsAsJson();
        default:
            return false;
    }

    var index = 0;
    for (var i = 1; i < rows.length; i++) {
        if (rows[i][0] == id) {
            index = i + 1;
        }
    }

    if (index > 0) {
        const nowDate = getNowDate();
        const currentScore = sheet.getRange(index, 2).getValue();

        sheet.getRange(index, 2).setValue(name);
        if (score > currentScore) {
            sheet.getRange(index, 3).setValue(score);
        }
        sheet.getRange(index, 5).setValue(nowDate);
    } else {
        const nowDate = getNowDate();
        const created = nowDate;
        const updated = nowDate;
        sheet.appendRow([id, name, score, created, updated]);
    }

    return getRecordsAsJson();
}

function getNowDate() {
    const date = new Date();
    return Utilities.formatDate(date, "Asia/Tokyo", "yyyy-MM-dd HH:mm:ss");
}

function getRecordsAsJson() {
    function getRecords() {
        const sheet = SpreadsheetApp.openById(id).getSheetByName("User");
        const rows = sheet.getDataRange().getValues();
        const keys = rows.splice(0, 1)[0];

        return rows.map(function (row) {
            var obj = {};
            row.map(function (item, index) {
                obj[keys[index]] = item;
            });
            return obj;
        });
    }
    return ContentService.createTextOutput('{"records":' + JSON.stringify(getRecords(), null, 2) + "}").setMimeType(ContentService.MimeType.JSON);
}

function signUp(name, password) {
    const sheet = SpreadsheetApp.openById(id).getSheetByName("User");
    const rows = sheet.getDataRange().getValues();

    var index = 0;
    for (var i = 1; i < rows.length; i++) {
        if (rows[i][0] == id) {
            index = i + 1;
        }
    }

    const nowDate = getNowDate();
    const created = nowDate;
    const updated = nowDate;
    const uuid = Utilities.getUuid();
    sheet.appendRow([uuid, name, password, created, updated]);

    return uuid;
}

function signIn(userId, name, password) {
    const sheet = SpreadsheetApp.openById(id).getSheetByName("User");
    const rows = sheet.getDataRange().getValues();

    for (var i = 1; i < rows.length; i++) {
        if (rows[i][1] == name && rows[i][2] == password) {
            user.id = rows[i][0];
            user.name = rows[i][1];
            user.password = rows[i][2];
            user.score = rows[i][3];
            return true;
        }
    }

    return false;
}
