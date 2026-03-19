import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { SendHorizonal, Loader2 } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;  

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = prompt;
    setHistory((prev) => [...prev, { sender: "user", text: userMessage }]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/ai/sql/`, null, {
        params: { prompt: userMessage },
      });

      const data = res.data;

      const botMsg = {
        sender: "bot",
        text: data.answer || "No response.",
        query: data.query || null,
        table:
          data.columns && data.data
            ? { columns: data.columns, rows: data.data }
            : null,
        error: data.error || null,
      };

      setHistory((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = "Something went wrong. Please try again.";
      setHistory((prev) => [
        ...prev,
        { sender: "bot", text: errorMsg, error: errorMsg },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <motion.h2
        className="text-2xl font-bold text-emerald-700 mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Chat with Sahaayak
      </motion.h2>

      <div className="bg-white border border-gray-200 rounded-lg shadow p-4 h-[400px] overflow-y-auto space-y-3 mb-4">
        {history.length === 0 ? (
          <p className="text-sm text-gray-600 mb-4 font-semibold h-5">
            <Typewriter
              words={[
                "Ask anything in English...",
                "हिंदी में पूछें...",
                "বাংলায় জিজ্ঞাসা করুন...",
                "தமிழில் கேளுங்கள்...",
                "తెలుగులో అడగండి...",
                "ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ...",
                "മലയാളത്തിൽ ചോദിക്കൂ...",
              ]}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={60}
              deleteSpeed={40}
              delaySpeed={1500}
            />
          </p>
        ) : (
          history.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`p-3 rounded max-w-[90%] ${
                msg.sender === "user"
                  ? "ml-auto bg-emerald-100 text-right text-emerald-800"
                  : "mr-auto bg-gray-100 text-left text-gray-800"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.query && (
                <div className="mt-2 text-xs text-gray-500 font-mono">
                  <strong>Query:</strong> {msg.query}
                </div>
              )}

              {msg.error && (
                <div className="mt-2 text-sm text-red-600 font-medium">
                  ⚠️ Error: {msg.error}
                </div>
              )}

              {msg.table && (
                <div className="overflow-x-auto mt-3">
                  <table className="w-full text-sm border border-gray-300">
                    <thead className="bg-emerald-100 text-emerald-800">
                      <tr>
                        {msg.table.columns.map((col) => (
                          <th key={col} className="px-2 py-1 border">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {msg.table.rows.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className="border-t hover:bg-gray-50"
                        >
                          {msg.table.columns.map((col) => (
                            <td key={col} className="px-2 py-1 border">
                              {row[col]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask about prices, stock, etc..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          className="flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <SendHorizonal className="w-4 h-4" /> Send
            </>
          )}
        </button>
      </form>
    </div>
  );
}
