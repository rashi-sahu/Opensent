$(document).ready(function() {  
  fetch('/balances', {
    method: 'GET',
  })
  .then(res => res.json())
  .then(res => {
    const balancesTableHTML = `<tr><td>${"Person"}</td><td id='${"Person"}'>${res.balances["personBalance"]}</td></tr>`
      + `<tr><td>${"Canteen"}</td><td id='${"Canteen"}'>${res.balances["canteenBalance"]}</td></tr>`
      + `<tr><td>${"Government"}</td><td id='${"Government"}'>${res.balances["governmentBalance"]}</td></tr>`;
    $('#Person').html(res.balances["personBalance"]);
    $('#Canteen').html(res.balances["canteenBalance"]);
    $('#Government').html(res.balances["governmentBalance"]);
  }).catch(function(err) {
    // Error :(
  });

  $('#buyItem').click(function(event) {
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    fetch('/buy', {
      method: 'post',
      headers: headers,
      body: JSON.stringify({ itemName: $('#itemName').val(), privateKey: $('#privateKey').val() }),
    })
    .then(() => {
      location.reload(true);
    })
    .catch(function() {
      // Error
    });
  });
});