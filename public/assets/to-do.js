// Notification ?

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
    .then(function(swReg) {
      console.log('Service Worker is registered', swReg);

      swRegistration = swReg;
    })
    .catch(function(error) {
      console.error('Service Worker Error', error);
    });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}

const applicationServerPublicKey = "BAkcZz5hJwSARPbn75rPG7f6l8goPMueO3IpA1IDAgJbstttVFu3Nt6tWLp9N-4jF0NsdxScEOf5myT8mDmfGvA";

function initialiseUI() {
  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
    .then(function(subscription) {
      isSubscribed = !(subscription === null);

      if (isSubscribed) {
        console.log('User IS subscribed.');
      } else {
        console.log('User is NOT subscribed.');
        const applicationServerKey = applicationServerPublicKey;
        swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
          })
          .then(function(subscription) {
            console.log('User is subscribed.');

            updateSubscriptionOnServer(subscription);

            isSubscribed = true;
          })
      }
    });
}


navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
    initialiseUI();
  })


  // DATA GESTION


$(document).ready(function() {

  $('form').on('submit', function() {
    var item = $('form input');
    var todo = {
      item: item.val()
    };
    $.ajax({
      type: 'POST',
      url: '/todo',
      data: todo,
      success: function(data) {
        // Faire quelquechose avec le framework en front-end
        location.reload();
      }
    });
    return false;
  });

  $('li').on('click', function() {
    var item = $(this).text().replace(/ /g, "-");
    var id = this.getAttribute("data-id");
    console.log("data_id" + id)
    $.ajax({
      type: 'DELETE',
      url: '/todo/' + id,
      success: function(data) {
        // Faire quelquechose avec le framework en front-end
        location.reload();
      }
    });
  });
});
