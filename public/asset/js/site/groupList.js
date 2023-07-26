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
      $('#error-container').html('');
      $('#error-max-file').html(`
<div id="flash-message" class="alert alert-danger alert-dismissible">
  <button style="padding: 0.45rem 0.45rem;" id="close-flash-message" type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
  ファイル形式が誤っています。CSVを選択してください。
</div>
        `);
    } else {
      const maxSize = 2 * 1024 * 1024;

      if ((await file.size) > maxSize) {
        $('#error-container').html('');
        $('#error-max-file').html(`
<div id="flash-message" class="alert alert-danger alert-dismissible">
  <button style="padding: 0.45rem 0.45rem;" id="close-flash-message" type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
  ファイルのサイズ制限2 MBを超えています。
</div>
        `);
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

$('#close-flash-message-info').click(function() {
  $('#flash-message-info').addClass('d-none');
});
