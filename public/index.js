$(document).ready(function() {  
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