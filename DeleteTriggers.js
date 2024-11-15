function delTrigger(){
  //GASプロジェクトに設定したトリガーをすべて取得
  const triggers = ScriptApp.getProjectTriggers();
  //トリガーの登録数をログ出力
  console.log('トリガー数：' + triggers.length);
  //トリガー登録数のforループを実行
  for(let i=0;i<triggers.length;i++){
    //取得したトリガーをdeleteTriggerで削除
    ScriptApp.deleteTrigger(triggers[i]);
  }
}