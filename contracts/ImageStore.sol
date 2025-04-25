// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract ImageStore {
    // The owner of the contract who can set prices and withdraw funds.
    address payable public owner;
    
    // Total number of images available.
    uint constant public totalImages = 16;
    
    // Maximum number of purchases allowed per user for each image.
    uint constant public maxPurchasePerUser = 3;

    // Struct to record a purchase's details.
    struct PurchaseRecord {
        address buyer;
        uint timestamp;
    }

    // Struct to represent each image's data.
    struct Image {
        uint stock; // Remaining stock of the image.
        address[] buyers; // List of addresses that bought the image.
        mapping(address => uint) purchaseCount; // Mapping to count purchases per buyer.
        PurchaseRecord[] history; // History of all purchase records.
    }

    // Mapping from image ID to its Image struct.
    mapping(uint => Image) public images;
    // Mapping from image ID to its price.
    mapping(uint => uint) public prices;

    // Constructor: Initializes the contract setting the deployer as the owner.
    // Sets initial stock for each image to 3 and price to 0.01 ether.
    constructor() public {
        owner = msg.sender;
        for (uint i = 0; i < totalImages; i++) {
            images[i].stock = 3;
            prices[i] = 0.01 ether;
        }
    }

    // Modifier to restrict function calls to only the owner.
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    // Allows the owner to set a new price for a specific image.
    // Checks that the image ID is valid.
    function setPrice(uint imageId, uint newPrice) public onlyOwner {
        require(imageId < totalImages, "Invalid image ID");
        prices[imageId] = newPrice;
    }

    // Returns the current price of a specified image.
    function getPrice(uint imageId) public view returns (uint) {
        return prices[imageId];
    }

    // Allows a user to purchase an image.
    // Verifies that the image exists, is in stock, the sent value is sufficient,
    // and that the user has not exceeded the purchase limit.
    // On success, decreases stock, records the buyer, updates purchase count, and logs the purchase.
    function buyImage(uint imageId) public payable returns (uint) {
        require(imageId < totalImages, "Invalid image ID");
        require(images[imageId].stock > 0, "Sold out");
        require(msg.value >= prices[imageId], "Insufficient ETH");
        require(images[imageId].purchaseCount[msg.sender] < maxPurchasePerUser, "Purchase limit reached");

        images[imageId].buyers.push(msg.sender);
        images[imageId].stock--;
        images[imageId].purchaseCount[msg.sender]++;
        images[imageId].history.push(PurchaseRecord({
            buyer: msg.sender,
            timestamp: block.timestamp
        }));

        return imageId;
    }

    // Allows a user to resell an image they own back to the contract.
    // Checks that the user actually owns the image.
    // Increases the stock, decrements the purchase count, removes the buyer from the buyers array,
    // and refunds the user the price of the image.
    function resellImage(uint imageId) public {
        require(imageId < totalImages, "Invalid image ID");
        require(images[imageId].purchaseCount[msg.sender] > 0, "You do not own this image");

        images[imageId].purchaseCount[msg.sender]--;
        images[imageId].stock++;

        // Remove the last occurrence of msg.sender in the buyers array.
        address[] storage buyers = images[imageId].buyers;
        for (uint i = buyers.length; i > 0; i--) {
            if (buyers[i - 1] == msg.sender) {
                buyers[i - 1] = buyers[buyers.length - 1];
                buyers.pop();
                break;
            }
        }

        uint refundAmount = prices[imageId];
        msg.sender.transfer(refundAmount);
    }

    // Returns the current stock of a specified image.
    function getStock(uint imageId) public view returns (uint) {
        return images[imageId].stock;
    }

    // Returns an array of stocks for all images.
    // Useful for viewing the remaining stock of every image.
    function getAllStocks() public view returns (uint[16] memory) {
        uint[16] memory stocks;
        for (uint i = 0; i < totalImages; i++) {
            stocks[i] = images[i].stock;
        }
        return stocks;
    }

    // Returns the number of times a user has purchased a specific image.
    // This is useful for enforcing the purchase limit.
    function getUserPurchaseCount(uint imageId, address user) public view returns (uint) {
        return images[imageId].purchaseCount[user];
    }

    // Returns the list of buyers for a specified image.
    // Can be used for tracking who has purchased the image.
    function getBuyers(uint imageId) public view returns (address[] memory) {
        return images[imageId].buyers;
    }

    // Returns the purchase history for a specified image.
    // It returns two arrays: one with buyer addresses and one with corresponding purchase timestamps.
    function getPurchaseHistory(uint imageId) public view returns (address[] memory, uint[] memory) {
        uint len = images[imageId].history.length;
        address[] memory addrs = new address[](len);
        uint[] memory times = new uint[](len);
        for (uint i = 0; i < len; i++) {
            addrs[i] = images[imageId].history[i].buyer;
            times[i] = images[imageId].history[i].timestamp;
        }
        return (addrs, times);
    }

    // Allows the owner to withdraw all ether stored in the contract.
    // Ensures that only the owner can withdraw funds.
    function withdraw() public onlyOwner {
        owner.transfer(address(this).balance);
    }
}