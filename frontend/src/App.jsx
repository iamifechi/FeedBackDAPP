import "./App.css";
import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import MetaMaskOnboarding from "@metamask/onboarding";
import { formatFeedbacks } from "./utils/getFormattedFeedbacks";
import { CONTRACT_ADDRESS, RPC_URL, ORIGIN, CONNECTED_TEXT, ONBOARD_TEXT, CONNECT_TEXT } from "./const/constants";
import Feedback from "./abi/Feedback.json";
import Feedbacks from "./components/Feedbacks";



const App = () => {
  const [buttonText, setButtonText] = useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [accounts, setAccounts] = useState();
  const [feedback, setFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState();
  const [response, setResponse] = useState(null);
  const onboarding = useRef();

  const fetchFeedbacks = async () => {
    try {
        const signer = new ethers.VoidSigner(
          CONTRACT_ADDRESS,
          ethers.getDefaultProvider(RPC_URL)
        );
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Feedback.abi,
          signer
        );

        const data = await contract.getAllFeedback();
        if (data) {
          setFeedbacks(formatFeedbacks(data));
        }
    } catch (error) {
      console.log("Error fetching feedbacks: ", error);
    }
  };

  const onClickConnect = () => {
    if(accounts && accounts.length !== 0){
         setAccounts(undefined);
         return;
    }
    try {
      if (MetaMaskOnboarding.isMetaMaskInstalled()) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((newAccounts) => setAccounts(newAccounts));
      } else {
        onboarding.current.startOnboarding();
      }
    } catch (error) {
      console.log("Error getting metamask: ", error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);
    setDisableSubmit(true);
    try {
      if (!feedback) return;
      if (typeof window.ethereum !== "undefined") {
        // await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Feedback.abi,
          provider.getSigner()
        );

        const transaction = await contract.addFeedback(feedback);
        setFeedback("");
         setResponse({
            status: true,
            message: `Mining ${transaction.hash}`,
          })

        await transaction.wait().then(() =>
          setResponse({
            status: true,
            message: `Feedback submitted: Mined ${transaction.hash}`,
          })
        );

        await fetchFeedbacks();
        setDisableSubmit(false);
      }
    } catch (error) {
      setResponse({
        status: false,
        message: error.message,
      });
      setDisableSubmit(false);
      console.log("Failed to update feedback: ", error);
    }
  };

  const handleInput = (e) => {
    if (response) {
      setResponse(null);
    }
    setFeedback(e.target.value);
  };

  // fetch existing feedbacks
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // check for metamask
  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      setButtonText(CONNECT_TEXT);
      try {
        if (accounts && accounts.length > 0) {
          setButtonText(CONNECTED_TEXT);
          setDisabled(false);
          onboarding.current.stopOnboarding();
        } else {
          setButtonText(CONNECT_TEXT);
          setDisabled(false);
        }
      } catch (error) {
        console.log("Error connecting to metamask: ", error);
      }
    } else {
    }
  }, [accounts]);

  useEffect(() => {
    function handleNewAccounts(newAccounts) {
      setAccounts(newAccounts);
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleNewAccounts);
      window.ethereum.on("accountsChanged", handleNewAccounts);
      return () => {
        window.ethereum.removeListener("accountsChanged", handleNewAccounts);
      };
    }
  }, []);

  return (
    <>
      <main>
        <section className="feedback_area">
          <header className="header">
            Who is your favourite #Learnable23 person 🤗?
          </header>
          <p>[ Could be a genie, mentor, facilitator... ]</p>


          <Feedbacks feedbacks={feedbacks} />

          <form onSubmit={handleSubmit}>
            <textarea
              onChange={handleInput}
              type="text"
              name="feedback"
              value={feedback}
              placeholder="Enter feedback here!"
              required
            />
            {accounts ? (
              <>
                <span>Commenting as {accounts}</span>
                {response && (
                  <span className={response.status ? "success" : "error"}>
                    {response.message}
                  </span>
                )}
                <button
                  className={feedback ? "active send" : "send"}
                  type="submit"
                  disabled={disableSubmit}
                >
                  Send Feedback
                </button>
              </>
            ) : null}
          </form>
        </section>
        <button disabled={isDisabled} onClick={onClickConnect}>
          {isDisabled ? "loading..." : buttonText}
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
