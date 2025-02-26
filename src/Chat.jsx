import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());
const BOT_API_URL = "https://mocki.io/v1/dd3c3357-e8b1-4d05-a050-38dcc2aa4bb9";

export default function Chat() {
  const [messages, setMessages] = useState([
    { text: "Ciao", sender: "you" },
    { text: "Ciao", sender: "friend" },
    { text: "Come stai?", sender: "you" },
    { text: "Tutto bene, tu?", sender: "friend" },
    { text: "Tutto bene, grazie", sender: "you" },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const lastMessageRef = useRef(null);

  const { data, mutate } = useSWR(
    newMessage ? `${BOT_API_URL}?message=${newMessage}` : null,
    fetcher
  );

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (data?.response) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, sender: "friend" },
      ]);
    }
  }, [data]);

  const handleNewMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: newMessage, sender: "you" },
      ]);
      mutate();
      setNewMessage("");
    }
  };

  const handlePressEnter = (event) => {
    if (event.key === "Enter") {
      handleNewMessage();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto h-full p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-[80%] p-3 rounded-lg text-lg ${
                message.sender === "you"
                  ? "bg-green-100 ml-auto text-right"
                  : "bg-white border border-gray-300 text-left"
              }`}
            >
              <span>{message.text}</span>
            </div>
          ))}
          <div ref={lastMessageRef} />
        </div>
        <div className="p-4 border-t border-gray-200 flex items-center gap-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyUp={handlePressEnter}
            className="w-full p-3 rounded-lg border border-gray-300 text-lg hover:border-gray-500 "
            placeholder="Scrivi un messaggio..."
          />
          <button
            onClick={handleNewMessage}
            className="bg-blue-500 text-white p-3 rounded-lg text-xl hover:bg-blue-600"
          >
            Invia
          </button>
        </div>
      </div>
    </div>
  );
}
