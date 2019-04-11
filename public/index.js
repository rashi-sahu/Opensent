$(document).ready(function () {
    $('#personLogin').click(function (event) {
      const headers = new Headers({
        'Content-Type': 'application/json',
      });
      fetch('/person/login', {
        method: 'post',
        headers: headers,
        body: JSON.stringify({ privateKey: $('#personPvtKey').val() }),
      })
        .then(res => res.json())
        .then(res => {
          console.log(res);
        })
        .catch(function () {
        });
    });
    $('#canteenLogin').click(function (event) {
        const headers = new Headers({
          'Content-Type': 'application/json',
        });
        fetch('/person/login', {
          method: 'post',
          headers: headers,
          body: JSON.stringify({ privateKey: $('#canteenPvtKey').val() }),
        })
          .then(res => res.json())
          .then(res => {
            console.log(res);
          })
          .catch(function () {
          });
      });
  });
