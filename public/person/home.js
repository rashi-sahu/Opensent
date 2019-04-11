$(document).ready(function () {
  fetch('/balances', {
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => {
      $('#Person').html(res.balances['personBalance']);
      $('#Canteen').html(res.balances['canteenBalance']);
      $('#Government').html(res.balances['governmentBalance']);
    }).catch(function (err) {
      console.log(err);
    });

  $('#buyItem').click(function (event) {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    fetch('/buy', {
      method: 'post',
      headers: headers,
      body: JSON.stringify({ itemName: $('#itemName').val(), privateKey: $('#privateKey').val() }),
    })
      .then(() => {
        location.reload(true);
      })
      .catch(function () {
      });
  });
});