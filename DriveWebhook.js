/**
 * DriveActivityAPIを使用してGoogle Driveのアクティビティを取得し、最大10件のアクティビティをログに出力
 */
function listDriveActivity() {
  const rootFolderId =
    PropertiesService.getScriptProperties().getProperty("ROOT_FOLDER_ID");

  var since = new Date();
  since.setMinutes(since.getMinutes() - 10);
  since = since.getTime().toString();

  const request = {
    pageSize: 10,
    ancestorName: "items/" + rootFolderId,
    filter: since ? `time > ${since}` : "",
    consolidationStrategy: { legacy: {} },
  };
  console.log(request);

  try {
    // Activity.queryメソッドはGoogle Driveの過去のアクティビティをクエリします。
    const response = DriveActivity.Activity.query(request);

    console.log(response);

    const activities = response.activities;
    if (!activities || activities.length === 0) {
      console.log("アクティビティがありません。");
    }
    console.log("最近のアクティビティ:");
    let responseMessage = "";
    for (const activity of activities) {
      // アクティビティの時間情報を取得します。
      const time = getTimeInfo(activity);
      // アクションの詳細情報を取得します。
      const action = getActionInfo(activity.primaryActionDetail);
      // アクティビティのアクターの詳細を取得します。
      const actors = activity.actors.map(getActorInfo);
      // アクティビティのターゲット情報を取得します。
      const targets = activity.targets.map(getTargetInfo);
      // アクティビティの時間、アクター、アクション、ターゲットを出力します。
      console.log("%s: %s, %s, %s", time, actors, action, targets);
      responseMessage +=
        "変更時間 " +
        time +
        "\n" +
        "変更したユーザー " +
        actors +
        "\n" +
        "行ったアクション " +
        action +
        "\n" +
        "対象 " +
        targets +
        "\n\n";
    }

    postToDiscordWebhook(responseMessage, rootFolderId);
  } catch (err) {
    console.log("エラーが発生しました: %s", err.message);
  }
}

/**
 * Google Drive 更新通知をDiscordに送信
 * @param {Discord送信メッセージ} message
 */
function postToDiscordWebhook(message, folderId) {
  const url = PropertiesService.getScriptProperties().getProperty(
    "DISCORD_WEBHOOK_URL"
  );
  let driveLink = DriveApp.getFolderById(folderId).getUrl();
  let driveName = DriveApp.getFolderById(folderId).getName();

  UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      content: "Google Drive 変更通知",
      embeds: [
        {
          title: driveName,
          url: driveLink,
          description: message,
          color: 5620992,
        },
      ],
    }),
  });
}

/**
 * @param {object} object
 * @return {string} オブジェクト内の設定されたプロパティの名前を返します。なければ "unknown" を返します。
 */
function getOneOf(object) {
  for (const key in object) {
    return key;
  }
  return "unknown";
}

/**
 * @param {object} activity アクティビティオブジェクト。
 * @return {string} アクティビティに関連する時間を返します。
 */
function getTimeInfo(activity) {
  if ("timestamp" in activity) {
    return activity.timestamp;
  }
  if ("timeRange" in activity) {
    return activity.timeRange.endTime;
  }
  return "unknown";
}

/**
 * @param {object} actionDetail アクティビティの主要なアクションの詳細。
 * @return {string} アクションの種類を返します。
 */
function getActionInfo(actionDetail) {
  return getOneOf(actionDetail);
}

/**
 * @param {object} user ユーザーオブジェクト。
 * @return {string} ユーザー情報を返します。既知のユーザーでない場合はユーザーの種類を返します。
 */
function getUserInfo(user) {
  if ("knownUser" in user) {
    const knownUser = user.knownUser;
    const isMe = knownUser.isCurrentUser || false;
    return isMe ? "people/me" : knownUser.personName;
  }
  return getOneOf(user);
}

/**
 * @param {object} actor アクターオブジェクト。
 * @return {string} アクター情報を返します。ユーザーでない場合はアクターの種類を返します。
 */
function getActorInfo(actor) {
  if ("user" in actor) {
    return getUserInfo(actor.user);
  }
  return getOneOf(actor);
}

/**
 * @param {object} target ターゲットオブジェクト。
 * @return {string} ターゲットの種類と関連するタイトルを返します。
 */
function getTargetInfo(target) {
  if ("driveItem" in target) {
    const title = target.driveItem.title || "unknown";
    return 'driveItem:"' + title + '"';
  }
  if ("drive" in target) {
    const title = target.drive.title || "unknown";
    return 'drive:"' + title + '"';
  }
  if ("fileComment" in target) {
    const parent = target.fileComment.parent || {};
    const title = parent.title || "unknown";
    return 'fileComment:"' + title + '"';
  }
  return getOneOf(target) + ":unknown";
}
