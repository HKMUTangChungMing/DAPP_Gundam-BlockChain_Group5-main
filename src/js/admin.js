App = {
  // Holds the web3 provider, contract instances, and the active account.
  web3Provider: null,
  contracts: {},
  account: null,

  // Initializes the application by starting the web3 initialization.
  init: async function () {
    return await App.initWeb3();
  },

  // Initializes web3 by checking for modern (window.ethereum) or legacy (window.web3) providers,
  // and falls back to a local provider if neither is available.
  initWeb3: async function () {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      await window.ethereum.enable();
    } else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  // Loads the contract's JSON artifact, creates a TruffleContract instance,
  // sets its provider, and then renders the admin panel.
  initContract: function () {
    $.getJSON('ImageStore.json', function (data) {
      App.contracts.ImageStore = TruffleContract(data);
      App.contracts.ImageStore.setProvider(App.web3Provider);
      return App.renderAdminPanel();
    });
  },

  // Renders the admin panel by fetching image data from 'images.json'
  // and populating the table with image details and price update options.
  renderAdminPanel: function () {
    $.getJSON('images.json', function (images) {
      const tableBody = $('#adminTableBody');
      tableBody.empty();

      // Get the list of accounts and set the active account.
      web3.eth.getAccounts(function (err, accounts) {
        App.account = accounts[0];

        // Get the deployed contract instance.
        App.contracts.ImageStore.deployed().then(function (instance) {
          for (let image of images) {
            // Call the contract to get the current price for the image.
            instance.getPrice.call(image.id).then(function (priceWei) {
              const priceEth = web3.fromWei(priceWei.toString(), 'ether');

              // Create a table row with the image, name, current price, and an input/button for price update.
              const row = `
                <tr>
                  <td><img src="${image.picture}" width="100"/></td>
                  <td>${image.name}</td>
                  <td><span id="currentPrice-${image.id}">${priceEth}</span> ETH</td>
                  <td>
                    <input type="number" step="0.001" min="0" id="newPrice-${image.id}" placeholder="e.g. 0.02" />
                    <button class="btn btn-primary update-btn" data-id="${image.id}">Update</button>
                  </td>
                </tr>`;
              tableBody.append(row);
            }).then(() => {
              // Attach click event handler for update buttons to trigger the price update.
              $('.update-btn').off('click').on('click', function () {
                const imageId = $(this).data('id');
                App.updatePrice(imageId);
              });
            });
          }
        });
      });
    });
  },

  // Handles the updating of the image price.
  // Retrieves the new price input, converts it to Wei, and calls the contract's setPrice function.
  updatePrice: function (imageId) {
    const input = $(`#newPrice-${imageId}`).val();
    const newPriceWei = web3.toWei(input, 'ether');

    App.contracts.ImageStore.deployed().then(function (instance) {
      return instance.setPrice(imageId, newPriceWei, { from: App.account });
    }).then(function () {
      // Notify the user of the successful update and update the displayed current price.
      alert(`✅ Price for image ${imageId} updated to ${input} ETH`);
      $(`#currentPrice-${imageId}`).text(input);
    }).catch(function (err) {
      console.error(err);
      alert("❌ Failed to update price. Are you the contract owner?");
    });
  }
};
  
// On window load, initialize the application.
$(function () {
  $(window).load(function () {
    App.init();
  });
});