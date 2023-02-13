function timeSince(timestamp) {
    const now = new Date();
    const timeDifference = now.getTime() - timestamp * 1000;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return 'just now';
    }
}


const main = async () =>{
   
    const feedbackContractFactory = await hre.ethers.getContractFactory('Feedback');
    const feedbackContract = await feedbackContractFactory.deploy()
    await feedbackContract.deployed();
    console.log('contract deployed to: ', feedbackContract.address)

    const msg = await feedbackContract.addFeedback('You are doing well')
    console.log('message: ', msg)

    const totalFeedback = await feedbackContract.getAllFeedback()
    console.log(totalFeedback)
    console.log(Object.fromEntries(totalFeedback))
    console.log(totalFeedback.map(feedback => {
        return {
        sender:feedback.sender,
        feedback: feedback.message,
        time: timeSince(feedback.timestamp),
        }
       
    }));
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