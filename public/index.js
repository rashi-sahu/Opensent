$(document).ready(function() {  
  fetch('/balances')
  .then(res => res.json())
  .then(res => {
    const balancesTableHTML = res.candidates.map(function(candidate) {
      return `<tr><td>${stakeholder.name}</td><td id='${stakeholder.name}'>${stakeholder.balance}</td></tr>`;
    });

    $('#balancesTable').html(balancesTableHTML);
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
      body: JSON.stringify({ itemName: $('#itemName').val() }),
    })
    .catch(function() {
      // Error
    });
  });
});