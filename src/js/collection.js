// Main App object for initializing web3, loading the contract, and rendering the user's collection.
App = {
  // Stores the web3 provider, contract instance, and the active account.
  web3Provider: null,
  contracts: {},
  account: null,

  // Initialize the application by first setting up web3.
  init: async function () {
    return await App.initWeb3();
  },

  // Initialize web3 by detecting the provider (MetaMask, legacy, or local) and then load the contract.
  initWeb3: async function () {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request access to the user's Ethereum account.
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access");
      }
    } else if (window.web3) {
      // Use legacy web3 provider.
      App.web3Provider = window.web3.currentProvider;
    } else {
      // Fallback to local provider (e.g., Ganache).
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    // Create a new instance of Web3 using the selected provider.
    web3 = new Web3(App.web3Provider);
    // After web3 is initialized, load the contract.
    return App.initContract();
  },

  // Initialize the contract by loading the contract JSON artifact and setting the provider.
  initContract: function () {
    $.getJSON('ImageStore.json', function (data) {
      var ImageStoreArtifact = data;
      // Create a TruffleContract instance from the artifact.
      App.contracts.ImageStore = TruffleContract(ImageStoreArtifact);
      // Set the web3 provider for the contract.
      App.contracts.ImageStore.setProvider(App.web3Provider);
      // Render the collection for the current user.
      return App.renderCollection();
    });
  },

  // Render the user's image collection by fetching image data and the purchase details from the contract.
  renderCollection: function () {
    $.getJSON('../images.json', function (data) {
      var myCollectionRow = $('#myCollectionRow');
      var myImageTemplate = $('#myImageTemplate');

      // Store the image data for later use if needed.
      App.imageData = data;

      // Interact with the deployed contract.
      App.contracts.ImageStore.deployed().then(function (instance) {
        // Get the user's Ethereum account.
        web3.eth.getAccounts(function (error, accounts) {
          App.account = accounts[0];

          // Loop through each image in the data.
          for (let i = 0; i < data.length; i++) {
            const image = data[i];

            // Get the number of times the current user purchased the image.
            instance.getUserPurchaseCount.call(image.id, App.account).then(function (count) {
              if (parseInt(count) > 0) {
                // If the user has purchased the image, clone the template to display it in their collection.
                let newPanel = myImageTemplate.clone();
                newPanel.removeAttr('id').show();
                newPanel.find('.panel-title').text(image.name);
                newPanel.find('img').attr('src', image.picture);
                newPanel.find('.image-desc').text(image.description);
                newPanel.find('.image-count').text(`Bought: ${count} times`);
                newPanel.find('.btn-download').attr('href', image.picture);

                // Insert purchase history by retrieving the purchase records from the contract.
                instance.getPurchaseHistory.call(image.id).then(function (result) {
                  const buyers = result[0];
                  const timestamps = result[1];

                  let historyList = newPanel.find('.purchase-history');
                  for (let j = 0; j < buyers.length; j++) {
                    // Check if the buyer in the record matches the current account.
                    if (buyers[j].toLowerCase() === App.account.toLowerCase()) {
                      const timestamp = Number(timestamps[j]);
                      const date = new Date(timestamp * 1000);
                      const formatted = date.toLocaleString();
                      // Append the formatted purchase time to the history list.
                      historyList.append(`<li>${formatted}</li>`);
                    }
                  }
                });

                // Create a "Resell" button to allow the user to resell the image.
                const resellBtn = $('<a class="btn btn-warning btn-resell" href="#">Resell</a>');
                resellBtn.attr('data-id', image.id);
                // Bind the click event to the handleResell function.
                resellBtn.on('click', App.handleResell);
                // Append the resell button to the panel.
                newPanel.find('.panel-body').append('<br/><br/>').append(resellBtn);

                // Add the completed panel to the collection row.
                myCollectionRow.append(newPanel);
              }
            });
          }
        });
      });
    });
  },

  // Handle the resell process when the user clicks the "Resell" button.
  handleResell: function (event) {
    event.preventDefault();
    // Retrieve the image ID from the clicked button.
    const imageId = parseInt($(event.target).data('id'));

    // Interact with the deployed contract to resell the image.
    App.contracts.ImageStore.deployed().then(function (instance) {
      return instance.resellImage(imageId, { from: App.account });
    }).then(function () {
      // Notify the user of a successful resell and refresh the page to update the collection.
      alert("✅ Resell successful! ETH sent back to your wallet.");
      location.reload();
    }).catch(function (err) {
      console.error(err.message);
      alert("❌ Resell failed: " + err.message);
    });
  }
};

// On window load, initialize the application.
$(function () {
  $(window).load(function () {
    App.init();
  });
});