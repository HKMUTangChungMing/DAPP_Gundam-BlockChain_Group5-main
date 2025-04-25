// App object to handle web3 initialization, contract interaction, and UI rendering.
App = {
  // Holds the web3 provider, contract instances, and the active account.
  web3Provider: null,
  contracts: {},
  account: null,

  // Initialize the application.
  init: async function() {
    // Load image data from images.json and populate the UI.
    $.getJSON('../images.json', function(data) {
      var imagesRow = $('#imagesRow');
      var imageTemplate = $('#imageTemplate');
  
      // Iterate through each image in the data.
      for (let i = 0; i < data.length; i++) {
        // Clone the image template and update its content.
        const newPanel = imageTemplate.clone();
        newPanel.removeAttr('id').show();
        newPanel.find('.panel-title').text(data[i].name);
        newPanel.find('img').attr('src', data[i].picture).css('width', '50%');
        newPanel.find('.image-desc').text(data[i].description);
        newPanel.find('.btn-buy').attr('data-id', data[i].id);
        newPanel.find('.image-price').text('Price: Loading...');
        newPanel.find('.image-stock').text('Stock: Loading...');
        newPanel.find('.image-buyers').text('Buyers: Loading...');
        imagesRow.append(newPanel);
      }
    });
  
    // Initialize web3 after setting up the UI.
    return await App.initWeb3();
  },

  // Initialize web3 by detecting the provider (MetaMask, legacy, or local).
  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access if needed.
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access");
      }
    } else if (window.web3) {
      // Use the browser's injected web3 provider.
      App.web3Provider = window.web3.currentProvider;
    } else {
      // Fall back to a local provider.
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    // Instantiate web3 with the selected provider.
    web3 = new Web3(App.web3Provider);

    // Initialize the contract.
    return App.initContract();
  },

  // Initialize the contract by loading the contract's JSON artifact.
  initContract: function() {
    $.getJSON('ImageStore.json', function(data) {
      var ImageStoreArtifact = data;
      // Create a TruffleContract instance using the artifact.
      App.contracts.ImageStore = TruffleContract(ImageStoreArtifact);
      // Set the provider for the contract.
      App.contracts.ImageStore.setProvider(App.web3Provider);
  
      // Update the UI to mark purchased images and display prices.
      App.markPurchased();
      App.renderPrices();
    });
  
    // Bind UI events like button clicks.
    return App.bindEvents();
  },

  // Bind events to UI elements.
  bindEvents: function() {
    // Listen for clicks on elements with class 'btn-buy' and handle purchase.
    $(document).on('click', '.btn-buy', App.handlePurchase);
  },

  // Check which images have been purchased and update the UI accordingly.
  markPurchased: function() {
    var instance;

    // Get the current account.
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      App.account = accounts[0];

      // Interact with the deployed contract.
      App.contracts.ImageStore.deployed().then(function(inst) {
        instance = inst;
        // Retrieve stock for all images.
        return instance.getAllStocks.call();
      }).then(function(stocks) {
        // Iterate through each image stock.
        for (let i = 0; i < stocks.length; i++) {
          (function(index) {
            App.contracts.ImageStore.deployed().then(function(inst) {
              // Get how many times the current account purchased this image.
              inst.getUserPurchaseCount.call(index, App.account).then(function(count) {
                // Get the corresponding panel for the image.
                const panel = $('.panel-image').eq(index);
                const button = panel.find('button');
                // Update the stock display.
                panel.find('.image-stock').text(`Stock: ${stocks[index]}`);

                // If out of stock, disable the button.
                if (stocks[index] === '0' || stocks[index] === 0) {
                  button.text('Finish').attr('disabled', true);
                } else if (parseInt(count) >= 3) { // If user reached purchase limit.
                  button.text('Purchased').attr('disabled', true);
                } else {
                  button.text('Buy').attr('disabled', false);
                }
              });

              // Retrieve and display the list of buyers for the image.
              inst.getBuyers.call(index).then(function(buyers) {
                const panel = $('.panel-image').eq(index);
                panel.find('.image-buyers').text(`Buyers: ${buyers.join(', ')}`);
              });
            });
          })(i);
        }
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  // Render prices for all images by retrieving them from the contract.
  renderPrices: function () {
    App.contracts.ImageStore.deployed().then(function (instance) {
      for (let i = 0; i < 16; i++) {
        (function (index) {
          // Call the contract to get the price in Wei.
          instance.getPrice.call(index).then(function (priceWei) {
            // Convert Wei to Ether for display.
            const priceEth = web3.fromWei(priceWei.toString(), 'ether');
            // Update the UI with the current price.
            $('.panel-image').eq(index).find('.image-price').text(`Price: ${priceEth} ETH`);
            console.log(`✅ Price loaded for image ${index}: ${priceEth} ETH`);
          }).catch(err => console.error(err));
        })(i);
      }
    }).catch(function (err) {
      console.error("❌ Error loading prices: ", err);
    });
  },

  // Handle purchase when a user clicks the "Buy" button.
  handlePurchase: function(event) {
    event.preventDefault();
    // Retrieve the image ID from the button's data attribute.
    var imageId = parseInt($(event.target).data('id'));
    var instance;
  
    // Get the current account.
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
        return;
      }
  
      var account = accounts[0];
  
      // Interact with the deployed contract.
      App.contracts.ImageStore.deployed().then(function(inst) {
        instance = inst;
        // Get the price for the selected image.
        return instance.getPrice.call(imageId);
      }).then(function(priceWei) {
        // Purchase the image by calling the contract's buyImage function,
        // sending the required amount of Ether.
        return instance.buyImage(imageId, {
          from: account,
          value: priceWei
        });
      }).then(function(result) {
        // Alert the user and update the UI after a successful purchase.
        alert("✅ Purchase successful!");
        return App.markPurchased();
      }).catch(function(err) {
        console.error(err.message);
        alert("❌ Purchase failed: " + err.message);
      });
    });
  }
};

// Initialize the application when the window is fully loaded.
$(function() {
  $(window).load(function() {
    App.init();
  });
});