# Instruction - Gundam online NFT marketplace

 We use the Web3 Framework to design the Decentralized Application to create blockchain. Our topic is the Gundam online NFT marketplace.
 The purpose of designing this project is to provide Gundam enthusiasts with a platform where they can purchase images related to Gundam.

### User
 In the website, user can visit the website, check all the NFT products(products image, description, price, stock, buyers) available at the marketplace, and check what they buy at their collection. 
 
 The user cab buy the image through MetaMask, also MetaMask was receive some gas for the fee. On the other hand, users can browse the images they have bought on the collection page. User also can resell the image. 

### Admin
 The admin can do the same thing as same as the user but also can modify the ETH of image at the admin page after login successful.



## Table of contents

- [Using Techniques](#UsingTechniques)

- [Tools Requirements & Download](#ToolsRequirements&Download)

- [Using Command](#UsingCommand)

- [How to Open](#HowtoOpen)

- [Bug Fixing ](#BugFixing)



## Using Techniques

| ![image-20250406170910603](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170910603.png) | **Web3 Technology**   |
| ------------------------------------------------------------ | --------------------- |
| Web3 is a set of JavaScript libraries (such as  Web3.js or Ethers.js) that allow your Decentralized Application to interact with  smart contracts on the blockchain through the frontend. |                       |
| ![image-20250406170917393](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170917393.png) | **Ganache Platform**  |
| Ganache provides a fast, free, and resettable  blockchain environment that allows you to develop and test your DApp locally  without needing to connect to the actual Ethereum mainnet or testnet. |                       |
| ![image-20250406170923091](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170923091.png) | **MetaMask Platform** |
| MetaMask is a browser extension that serves as an  Ethereum wallet, a blockchain gateway, and a signature tool that helps users  interact with smart contracts. |                       |
| ![image-20250406170928612](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170928612.png) | **Solidity Language** |
| Solidity is the "smart contract language"  used in developing DApps. It functions as the backend logic on the  blockchain, responsible for implementing the core functionalities of your  DApp, such as purchasing and transferring tokens. |                       |
| ![](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170939090.png) | **Truffle Module**    |
| Truffle is a comprehensive blockchain application  development framework that assists in developing, compiling, deploying,  testing, and interacting with smart contracts, making your DApp projects  faster, more structured, and better managed. |                       |
| ![image-20250406171701401](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406171701401.png) | **Node.js Module**    |
| In DApp projects, Node.js serves as the  foundational platform for the entire development environment. It supports  smart contract tools (such as Truffle and Hardhat), frontend Web3 libraries,  testing tools, server logic, automation workflows, and more. |                       |



## Tools Requirements & Download

- [Node.js](https://nodejs.org/en)
- [ganache](https://archive.trufflesuite.com/ganache/)
- Truffle
- Code Editor:
    * [VS Code](https://code.visualstudio.com/download)



## Using Command

Execution Type:

| ·   Run scripts using Node.js.                               | npm run dev                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ·   Redeploy all smart contracts to the blockchain.          | truffle migrate --reset                                      |
| ·   Convert the Solidity files of the smart contracts into ABI JSON files  for use by the DApp web framework. | truffle compile                                              |
| ·   Enable developers to use PowerShell commands in the Vscode Terminal. | Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy  RemoteSigned |

 

Installation Type:

| Use Node.js to install Truffle. | npm install -g truffle |
| ------------------------------- | ---------------------- |
|                                 |                        |



## How to Open

**There are a few of simple steps for open the websit at local:**

**Step 1:**

First, install Node.js on your Windows machine by visiting https://nodejs.org/en. After installation, restart your computer.

**Step 2:**

 Open VSCode, open PowerShell, and run npm commands:     

Enter the following command to allow npm to execute: 
```
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned   
```

Install Truffle by running:  
```      
npm install -g truffle    
```

- If you haven't used VS Code before, be sure to check out the Getting Started guide online.

**Step 3:**

  Install Ganache on  Windows by visiting the following URL:   https://archive.trufflesuite.com/ganache/  

**Step 4:**

Chick『NEW WORKSPACE』
![image-20250406170414663](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170414663.png)

**Step 5:**

Select the desired file path to use, and then you'll find the 'truffle-config.js' file.

![image-20250406170436946](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170436946.png)

**Step 6:**

![image-20250406170444478](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170444478.png)

**Step 7:**

Next, open Google Chrome and install MetaMask. Go to the extensions section and select MetaMask from the available options.

![image-20250406170500672](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170500672.png)

**Step 8:**

![image-20250406170509452](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170509452.png)

**Step 9:**

After a successful installation, return to this screen and adjust the appropriate simulated currency settings.

![image-20250406170524389](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170524389.png)

**Step 10:**

![image-20250406170532439](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170532439.png)

**Step 11:**

Add a Custom Network.
![image-20250406170549984](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170549984.png)



**Step 12:**

Next, you'll use Ganache's private key.

![image-20250406170603931](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170603931.png)



**Step 13:**

And just like that, you've obtained simulated virtual currency.
![image-20250331232635248](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250331232635248.png)

**Step 14:**

Return to VS Code and enter the following commands:

 

truffle migrate --reset

npm run dev
![image-20250406170651686](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170651686.png)

After running these commands, you'll be able to open the webpage and start buying and selling images.



## Bug Fixing 

In admin.html, I will attempt to modify ETH, but we must ensure that the website's account owner matches the current account. Therefore, in the browser, press Ctrl+Shift+I to open the Developer Tools console, and then input the following commands into the console.

```
App.contracts.ImageStore.deployed().then(i => i.owner()).then(o  => console.log("Contract owner：", o));  
```

and

```  
web3.eth.getAccounts(function (err, accounts) {   console.log("current  account：", accounts[0]);  });  
```

To verify if the two match. If they do, we can be confident that we can modify the ETH in the admin at the current blockchain address. Otherwise, we must change the current account to the same account as the owner contract account.

![image-20250406170121754](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170121754.png)

Regarding html 
 html part。[3 files]

### index.html![image-20250406170141197](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170141197.png)

### admin.html

![image-20250406170153832](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170153832.png)

### collection.html

![image-20250406170203596](http://pdm888.oss-cn-beijing.aliyuncs.com/img/image-20250406170203596.png)


