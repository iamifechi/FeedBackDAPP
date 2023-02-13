const main = async () =>{
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();

    console.log('Deploying contracts with account: ', deployer.address);
    console.log('Account balance: ', accountBalance.toString());

    const feedbackContractFactory = await hre.ethers.getContractFactory('Feedback');
    const feedbackContract = await feedbackContractFactory.deploy();
    await feedbackContract.deployed();
    console.log('contract deployed to: ', feedbackContract.address)
}

const runMain = async () =>{
    try{
        await main();
        process.exit()
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

runMain()