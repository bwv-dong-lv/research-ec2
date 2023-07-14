const curPage = $('#save-page').val();

function pageClick(obj) {
  $('#save-page').val(obj.value);
}

function prevClick() {
  $('#save-page').val(Number(curPage) - 1);
}

function nextClick() {
  $('#save-page').val(Number(curPage) + 1);
}

function firstPageClick() {
  $('#save-page').val(1);
}

function lastPageClick() {
  const lastPage = $('#save-last-page').val();
  $('#save-page').val(lastPage);
}

function importCSV() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.addEventListener('click', event => {
    event.stopPropagation();
  });

  fileInput.addEventListener('change', async event => {
    const file = await event.target.files[0];

    if (!file) {
      return;
    }

    const validExtension = '.csv';
    const fileExtension = await file.name
      .split('.')
      .pop()
      .toLowerCase();

    if (!validExtension.includes(fileExtension)) {
      $('#error-csv').html(
        'ファイル形式が誤っています。CSVを選択してください。',
      );
    } else {
      const maxSize = 2 * 1024 * 1024;

      if ((await file.size) > maxSize) {
        $('#error-csv').html('ファイルのサイズ制限2 MBを超えています。');
      } else {
        // csv file oke
        const tempInput = document.getElementById('csv-file');

        tempInput.files = await event.target.files;

        $('#csv-form').submit();
      }
    }
  });
  fileInput.click();
}
