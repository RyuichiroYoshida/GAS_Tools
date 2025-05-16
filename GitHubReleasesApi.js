function doGet(e) {
    getReleases();
    return ContentService.createTextOutput(JSON.stringify(releases)).setMimeType(ContentService.MimeType.JSON);
}

function getReleases() {
    let owner = "RyuichiroYoshida";
    let repo = "SepDriveActions";
	let url = "https://api.github.com/repos/" + owner + "/" + repo + "/releases";
	let options = {
		method: "get",
		headers: {
			Accept: "application/vnd.github.v3+json",
			Authorization: PropertiesService.getScriptProperties().getProperty("GITHUB_TOKEN"),
		},
		muteHttpExceptions: true,
	};
	let response = UrlFetchApp.fetch(url, options);
	let releases = JSON.parse(response.getContentText());
	return releases;
}
