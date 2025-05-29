export const generateScript = (req, res) => {
  const { user_id, primaryColor, secondaryColor, fontFamily } = req.body;

  if (!user_id || !primaryColor || !secondaryColor || !fontFamily) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const encodedParams = new URLSearchParams({
    user_id,
    primaryColor,
    secondaryColor,
    fontFamily,
  }).toString();

  const widgetURL = `https://convo-x-signup.vercel.app/chat-widget?${encodedParams}`;

  const scriptTag = `
<script>
  (function() {
    const iframe = document.createElement('iframe');
    iframe.src = "${widgetURL}";
    iframe.style = "border: none; width: 400px; height: 600px; position: fixed; bottom: 20px; right: 20px; z-index: 9999;";
    document.body.appendChild(iframe);
  })();
</script>`.trim();

  res.status(200).send(scriptTag);
};

export const widgetScript = (req, res) => {
  const { user_id, primaryColor, secondaryColor, fontFamily, widgetWidth, companionName } =
    req.body;

  const encodedUserId = encodeURIComponent(user_id || "");
  console.log(req.body);
  // const iframeUrl = `https://convo-x-signup.vercel.app/chat-widget?user_id=${user_id}&primaryColor=${primaryColor}&secondaryColor=${secondaryColor}&fontFamily=${fontFamily}`;

  const sanitizedPrimary = (primaryColor || "").trim() || "#0675E6";
  const sanitizedSecondary = (secondaryColor || "").trim() || "#FFFFFF";
  const sanitizedFont = (fontFamily || "").trim() || "Poppins, sans-serif";
  const sanitizedWidth = (widgetWidth || "").trim() || "350px";

  res.setHeader("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>ConvoX Chat</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      #chatBox {
        transition: all 0.3s ease;
        transform: scale(0.95);
        opacity: 0;
        pointer-events: none;
      }
      #chatBox.open {
        transform: scale(1);
        opacity: 1;
        pointer-events: auto;
      }
      textarea::-webkit-scrollbar {
        width: 6px;
      }
      textarea {
        resize: none;
        overflow-y: auto;
        max-height: 80px;
      }
    </style>
  </head>
  <body class="m-0" style="font-family: ${sanitizedFont}">
    <!-- Chat Toggle Button -->
    <div
      id="chatToggleBtn"
      class="fixed bottom-5 right-5 w-[60px] h-[60px] rounded-full text-white text-2xl flex items-center justify-center shadow-lg z-[999] cursor-pointer"
      style="background-color: ${sanitizedPrimary}"
      onclick="toggleChat()"
    >
      <svg
        id="chatIcon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
      >
        <path fill="#ffffff" d="M8 7H16V9H8V7Z" />
        <path fill="#ffffff" d="M14 11H8V13H14V11Z" />
        <path
          fill="#ffffff"
          d="M19.2 3C20.19 3 20.99 3.81 20.99 4.8L21 21L17.4 17.4H4.8C3.81 17.4 3 16.59 3 15.6V4.8C3 3.81 3.81 3 4.8 3H19.2Z"
        />
      </svg>
    </div>

    <!-- Chat Box -->
    <div
      id="chatBox"
      class="fixed bottom-[90px] right-3 w-[90%] sm:w-[370px] h-[70vh] rounded-2xl overflow-hidden flex flex-col shadow-lg z-[998]"
      style="background-color: ${sanitizedSecondary}"
    >
      <div
        class="h-16 text-white flex flex-col justify-center px-6"
        style="background-color: ${sanitizedPrimary}"
      >
        <div>
          <h1>${companionName}</h1>
          <p class="text-xs text-100">Powered By ConvoX</p>
        </div>
      </div>

      <div
        id="chatMessages"
        class="flex-1 overflow-y-auto p-3 flex flex-col gap-2"
      ></div>

      <div
        class="flex gap-2 items-center p-2 border-t border-gray-300"
        style="background-color: ${sanitizedSecondary}"
      >
        <textarea
          id="chatInput"
          placeholder="How can we help you today..."
          rows="1"
          class="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none resize-none overflow-y-auto"
          oninput="adjustHeight(this)"
          onkeydown="if(event.key === 'Enter' && !event.shiftKey){ event.preventDefault(); sendMessage(); }"
        ></textarea>
        <button
          onclick="sendMessage()"
          class="w-10 h-10 text-white text-lg rounded-full flex items-center justify-center"
          style="background-color: ${sanitizedPrimary}"
        >
          <svg
            width="19px"
            height="19px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <script>
      const userId = "${user_id}";
      const primaryColor = "${sanitizedPrimary}";
      const secondaryColor = "${sanitizedSecondary}";
      const fontFamily = "${sanitizedFont}";
      const sessionId = "sess_" + Math.random().toString(36).substring(2, 10);
      const chatBox = document.getElementById("chatBox");
      const chatIcon = document.getElementById("chatIcon");
      let isChatOpen = false;

      if (!userId) {
        document.body.innerHTML =
          '<h3 class="text-red-500 text-center mt-8">Error: Missing user_id</h3>';
      }

      function toggleChat() {
        isChatOpen = !isChatOpen;
        chatBox.classList.toggle("open");

        chatIcon.innerHTML = isChatOpen
          ? \`<path stroke="#fff" stroke-width="2" d="M6 6L18 18M6 18L18 6" />\`
          : \`<path fill="#ffffff" d="M8 7H16V9H8V7Z"/><path fill="#ffffff" d="M14 11H8V13H14V11Z"/><path fill="#ffffff" d="M19.2 3C20.19 3 20.99 3.81 20.99 4.8L21 21L17.4 17.4H4.8C3.81 17.4 3 16.59 3 15.6V4.8C3 3.81 3.81 3 4.8 3H19.2Z"/>\`;
      }

      function adjustHeight(el) {
        el.style.height = "auto";
        el.style.height = (el.scrollHeight < 80 ? el.scrollHeight : 80) + "px";
      }

      function appendMessage(from, text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = \` chat-message \${
          from === "user"
            ? "self-end text-white"
            : "self-start bg-gray-100 text-black"
        } max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed \`;
        msgDiv.textContent = text;
        if (from === "user") {
          msgDiv.style.backgroundColor = primaryColor;
        }
        document.getElementById("chatMessages").appendChild(msgDiv);
        document.getElementById("chatMessages").scrollTop =
          document.getElementById("chatMessages").scrollHeight;
      }

      function showTyping() {
        const typingDiv = document.createElement("div");
        typingDiv.className =
          "self-start bg-gray-100 px-3 py-1.5 rounded-xl text-xs animate-pulse";
        typingDiv.id = "typing-indicator";
        typingDiv.textContent = "typing...";
        document.getElementById("chatMessages").appendChild(typingDiv);
      }

      function hideTyping() {
        const typingDiv = document.getElementById("typing-indicator");
        if (typingDiv) typingDiv.remove();
      }

      async function sendMessage() {
        const input = document.getElementById("chatInput");
        const message = input.value.trim();
        if (!message) return;

        appendMessage("user", message);
        input.value = "";
        adjustHeight(input);
        showTyping();

        try {
          const res = await fetch(
            "https://walrus.kalavishva.com/webhook/convox_trial",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: userId,
                session_id: sessionId,
                timestamp: new Date().toLocaleString("en-GB"),
                user_message: message,
              }),
            }
          );

          const data = await res.json();
          hideTyping();

          const botReply =
            Array.isArray(data) && data.length > 0
              ? data[data.length - 1].response
              : "Sorry, something went wrong.";
          appendMessage("bot", botReply);
        } catch (err) {
          hideTyping();
          appendMessage("bot", "Error contacting server.");
          console.error(err);
        }
      }
    </script>
  </body>
</html>
  `);
};
