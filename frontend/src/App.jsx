import { ethers } from "ethers";
import { useEffect, useState } from "react";
import "./App.css";
import { data } from "./data";

// import ABI data
import Feedback from "./abi/Feedback.json";
import { formatFeedbacks } from "./utils/getFormattedFeedbacks";

const fetchAccounts = async () => {
  try {
    const ethereum = window.ethereum;
    if (!ethereum) {
      console.error("Make sure you have Metamask");
      return null;
    }
    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("found an authorized account: ", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [balance, setBalance] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const CONTRACT_ADDRESS = "0x25F8ca0Ded9716e0D757C0b345b51EB3Cb25E5Af";

  const requestAccount = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const fetchFeedbacks = async () => {
   
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Feedback.abi,
          signer
        );

        const data = await contract.getAllFeedback();
        if (data) {
          console.log("data");
          setFeedbacks(formatFeedbacks(data));
        }
      }
    } catch (error) {
      console.log("Error ", error);
    }
  };
  const onConnect = async () => {
    setLoading(true);
    try {
      const ethereum = window.ethereum;
      if (!ethereum) {
        alert("Get MetaMask!");
        setLoading(false);
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const onDisconnect = () => {
    console.log("onDisconnect");
    setBalance(undefined);
    setCurrentAccount(undefined);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback) return;

    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Feedback.abi,
        provider.getSigner()
      );

      const transaction = await contract.addFeedback(feedback);
      setFeedback("");
      await transaction.wait();
      fetchFeedbacks();
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  });

  useEffect(() => {
    async function getAccount() {
      const account = await fetchAccounts();
      if (account !== null) {
        setCurrentAccount(account);
      }
    }
    getAccount();
  }, []);

  const handleInput = (e) => setFeedback(e.target.value);

  return (
    <>
      <main>
        <section className="feedback_area">
          <header className="header">
            Who is your favourite #Learnable23 person 🤗?
          </header>
          <p>[ Could be a genie, mentor, facilitator... ]</p>
          <div className="feedbacks">
            {feedbacks.map((feedback, index) => {
              return (
                <div key={index} className="cards">
                  <p className="address">
                    <span>From: </span>
                    {feedback.sender}
                  </p>
                  <p className="feedback">{feedback.feedback}</p>
                  <p className="time">{feedback.time}</p>
                </div>
              );
            })}
            <form onSubmit={handleSubmit}>
              <textarea
                onChange={handleInput}
                type="text"
                name="feedback"
                value={feedback}
                placeholder="Enter feedback here!"
                required
              />
              {currentAccount ? (
                <>
                  <span>Commenting as {currentAccount}</span>

                  <button
                    className={feedback ? "active send" : "send"}
                    type="submit"
                  >
                    Send Feedback
                  </button>
                </>
              ) : null}
            </form>
          </div>
        </section>

        <button onClick={currentAccount ? onDisconnect : onConnect}>
          {currentAccount
            ? loading
              ? "Disconnecting..."
              : "Disconnect wallet"
            : loading
            ? "Connecting..."
            : "Connect Wallet"}
        </button>
      </main>

      <footer>
        <p>
          Made with ❤️ by{" "}
          <a href="https://github.com/iamifechi" target="_blank">
            Ifechi
          </a>
        </p>
      </footer>
    </>
  );
};

export default App;
