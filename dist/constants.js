"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = exports.valueLst = exports.titleMessageError = exports.messageTypes = exports.labels = void 0;
exports.labels = {
    FIRST: '先頭',
    LAST: '最終',
    NEXT: '次へ',
    PREVIOUS: '前へ',
};
exports.messageTypes = {
    error: 'error',
    info: 'info',
    success: 'success',
};
exports.titleMessageError = {
    NOT_FOUND: 'TITLE NOT FOUND',
    INTERNAL_SERVER_ERROR: 'ページエラー',
    FORBIDDEN: '権限エラー',
};
exports.valueLst = {
    // 無効化フラグ
    disableFlgs: {
        0: '有効',
        1: '無効',
    },
};
exports.messages = {
    CSVDefault: 'フォーマットのヘッダーに不必要なデータもしくは項目名の書き換えがございますとエラーになりますのでご注意ください。',
    ECL001: (column) => `${column}は必須項目です。`,
    FORBIDDEN: `アクセス権限がありません。<br/> 大変お手数ですが、システム管理者までご連絡ください。`,
    INTERNAL_SERVER_ERROR: `申し訳ございません。<br/> お客様がアクセスしようとしたページが見つかりませんでした。<br/>
  サイト更新などによってURLが変更になったか、URLが正しく入力されていない可能性があります。<br/>
  ブラウザの再読込を行ってもこのページが表示される場合は、システム管理者にご連絡ください。`,
    ECL034: (param) => `${param}に不正な値が入力または選択されています。`,
    API_SELECT_ERROR: (code) => `該当の情報が存在しません。(APIレスポンス：<${code}>)`,
    API_UPDATE_ERROR: (code) => `サーバーエラーが発生しました。データをご確認の上、再度登録をお願いいたします。(APIレスポンス：<${code}>)`,
    ECL054: 'CSV作成処理の呼び出しに失敗しました。',
    NOT_FOUND: 'NOT FOUND',
    BAD_REQUEST: 'BAD REQUEST',
    ECL056: 'セッションにデータが存在しません。',
    ECL057: 'データの登録に失敗しました。',
    EBT001: (fieldName) => `${fieldName}は必須です。`,
    EBT002: (fieldName, maxLength, currentLength) => `${fieldName}は「${maxLength}」文字以下で入力してください。（現在${currentLength}文字)`,
    EBT003: (fieldName, minLength, currentLength) => `${fieldName}は「${minLength}」文字以上で入力してください。（現在${currentLength}文字)`,
    EBT004: (fieldName) => `${fieldName}は半角英数で入力してください`,
    EBT005: () => `メールアドレスを正しく入力してください`,
    EBT008: (fieldName) => `${fieldName}は日付を正しく入力してください。`,
    EBT010: (fieldName) => `${fieldName}は数字を正しく入力してください。`,
    EBT011: (fieldName) => `${fieldName}は電話番号を正しく入力してください。`,
    EBT016: () => 'メールアドレスまたは会員IDが間違っています。',
    EBT044: () => '解約予定日は契約終了日前を指定してください。',
    IBT012: () => '検索結果は0件です。',
    IBT013: (id) => `${id}します。よろしいですか？`,
    E006: (fileSize) => `The file size limit ${fileSize} has been exceeded.`,
    E007: (fileExtension) => `File extension is incorrect. Please use ${fileExtension}.`,
    E008: () => `CSV format is incorrect. Please check header information.`,
    E009: (fieldName) => `${fieldName} is duplicated.`,
    E010: () => `Email or Password incorrect.`,
    E011: () => `Re-password is not the same as Password.`,
    E012: (fieldName, format) => `${fieldName} format is not correct. Please enter ${format} only.`,
    EBT017: () => `入力した情報のいずれかの情報が間違っています。`,
    EBT019: () => `すでにメールアドレスは登録されています。`,
    EBT092: () => `インポートできました。`,
    EBT093: () => `登録・更新・削除処理に失敗しました。`,
    EBT094: (fieldName) => `${fieldName}が存在しておりません。`,
    EBT095: () => `インポートファイルの中身が正しくありません。`,
    EBT096: () => `登録・更新・削除処理に成功しました。`,
    messageCSV: (rowNumber, errorText) => `Dòng: ${rowNumber + 1}${errorText}`,
};
//# sourceMappingURL=constants.js.map