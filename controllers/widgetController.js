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
  const { user_id, primaryColor, secondaryColor, fontFamily } = req.body;

  const encodedUserId = encodeURIComponent(user_id || "");
  // const iframeUrl = `https://convo-x-signup.vercel.app/chat-widget?user_id=${user_id}&primaryColor=${primaryColor}&secondaryColor=${secondaryColor}&fontFamily=${fontFamily}`;

  res.setHeader("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>ConvoX Chat</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    :root {
      --primary-color: ${primaryColor || "#0675E6"};
      --secondary-color:  ${secondaryColor || "#e6f0ff"};
      --font-family:  ${fontFamily || "Inter, sans-serif"};
    }

    body {
      margin: 0;
      font-family: var(--font-family);
    }

    .chat-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background-color: var(--primary-color);
      border-radius: 50%;
      color: white;
      font-size: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      z-index: 999;
    }

    .chat-box {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 350px;
      max-width: 90%;
      height: 450px;
      background-color: white;
      border: 2px solid var(--primary-color);
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      z-index: 998;
    }

    .chat-header {
      height: 48px;
      background-color: var(--primary-color);
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .chat-message {
      max-width: 80%;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 14px;
      line-height: 1.4;
    }

    .chat-message.user {
      align-self: flex-end;
      background-color: var(--primary-color);
      color: white;
    }

    .chat-message.bot {
      align-self: flex-start;
      background-color: #f0f0f0;
      color: black;
    }

    .chat-input-area {
      display: flex;
      gap: 8px;
      padding: 10px;
      background-color: var(--secondary-color);
      border-top: 1px solid #ddd;
    }

    .chat-input {
      flex: 1;
      padding: 8px 12px;
      font-size: 14px;
      border-radius: 9999px;
      border: 1px solid #ccc;
    }

    .chat-send {
      width: 40px;
      height: 40px;
      background-color: var(--primary-color);
      border: none;
      border-radius: 50%;
      color: white;
      font-size: 18px;
      cursor: pointer;
    }

    .chat-typing {
      align-self: flex-start;
      background-color: #f0f0f0;
      padding: 6px 10px;
      border-radius: 16px;
      font-size: 13px;
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }
  </style>
</head>
<body>
  <div class="chat-toggle" onclick="toggleChat()">
    <svg
        width="44px"
        height="44px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#ffffff"
        stroke-width="0.00024000000000000003"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.5 11C6.94772 11 6.5 11.4477 6.5 12C6.5 12.5523 6.94772 13 7.5 13C8.05228 13 8.5 12.5523 8.5 12C8.5 11.4477 8.05228 11 7.5 11ZM5.5 12C5.5 10.8954 6.39543 10 7.5 10C8.60457 10 9.5 10.8954 9.5 12C9.5 13.1046 8.60457 14 7.5 14C6.39543 14 5.5 13.1046 5.5 12Z"
            fill="#ffffff"
          ></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.5 11C15.9477 11 15.5 11.4477 15.5 12C15.5 12.5523 15.9477 13 16.5 13C17.0523 13 17.5 12.5523 17.5 12C17.5 11.4477 17.0523 11 16.5 11ZM14.5 12C14.5 10.8954 15.3954 10 16.5 10C17.6046 10 18.5 10.8954 18.5 12C18.5 13.1046 17.6046 14 16.5 14C15.3954 14 14.5 13.1046 14.5 12Z"
            fill="#ffffff"
          ></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10 15.5C10.2761 15.5 10.5 15.7239 10.5 16L10.5003 16.0027C10.5003 16.0027 10.5014 16.0073 10.5034 16.0122C10.5074 16.022 10.5171 16.0405 10.5389 16.0663C10.5845 16.1202 10.6701 16.1902 10.8094 16.2599C11.0883 16.3993 11.5085 16.5 12 16.5C12.4915 16.5 12.9117 16.3993 13.1906 16.2599C13.3299 16.1902 13.4155 16.1202 13.4611 16.0663C13.4829 16.0405 13.4926 16.022 13.4966 16.0122C13.4986 16.0073 13.4997 16.0027 13.4997 16.0027L13.5 16C13.5 15.7239 13.7239 15.5 14 15.5C14.2761 15.5 14.5 15.7239 14.5 16C14.5 16.5676 14.0529 16.9468 13.6378 17.1543C13.1928 17.3768 12.6131 17.5 12 17.5C11.3869 17.5 10.8072 17.3768 10.3622 17.1543C9.9471 16.9468 9.5 16.5676 9.5 16C9.5 15.7239 9.72386 15.5 10 15.5Z"
            fill="#ffffff"
          ></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16 5.5V7.5H8V5.5C8 5.22386 7.77614 5 7.5 5C7.22386 5 7 5.22386 7 5.5V7.5H6C4.61929 7.5 3.5 8.61929 3.5 10V17C3.5 18.3807 4.61929 19.5 6 19.5H18C19.3807 19.5 20.5 18.3807 20.5 17V10C20.5 8.61929 19.3807 7.5 18 7.5H17V5.5C17 5.22386 16.7761 5 16.5 5C16.2239 5 16 5.22386 16 5.5ZM6 8.5C5.17157 8.5 4.5 9.17157 4.5 10V17C4.5 17.8284 5.17157 18.5 6 18.5H18C18.8284 18.5 19.5 17.8284 19.5 17V10C19.5 9.17157 18.8284 8.5 18 8.5H6Z"
            fill="#ffffff"
          ></path>
        </g>
      </svg>
  </div>

  <div class="chat-box" id="chatBox" style="display: none;">
    <div class="chat-header"></div>
    <div class="chat-messages" id="chatMessages"></div>
    <div class="chat-input-area">
      <input
        type="text"
        id="chatInput"
        placeholder="Type your message..."
        class="chat-input"
        onkeydown="if(event.key === 'Enter') sendMessage()"
      />
      <button class="chat-send" onclick="sendMessage()">➤</button>
    </div>
  </div>

  <script>
  const userId = "${user_id}";
  const primaryColor = "${primaryColor || "#0675E6"}";
  const secondaryColor = "${secondaryColor || "#e6f0ff"}";
  const fontFamily = "${fontFamily || "Inter, sans-serif"}";

  const sessionId = "sess_" + Math.random().toString(36).substring(2, 10);

  if (!userId) {
    document.body.innerHTML = '<h3 style="font-family:' + fontFamily + '; color:red; text-align:center; margin-top:2rem;">Error: Missing user_id</h3>';
  }

  // Apply dynamic styles
  document.documentElement.style.setProperty("--primary-color", primaryColor);
  document.documentElement.style.setProperty("--secondary-color", secondaryColor);
  document.documentElement.style.setProperty("--font-family", fontFamily);

    function toggleChat() {
      const chat = document.getElementById("chatBox");
      chat.style.display = chat.style.display === "none" ? "flex" : "none";
    }

    function appendMessage(from, text) {
      const msgDiv = document.createElement("div");
      msgDiv.className = "chat-message " + from;
      msgDiv.textContent = text;
      document.getElementById("chatMessages").appendChild(msgDiv);
      document.getElementById("chatMessages").scrollTop = document.getElementById("chatMessages").scrollHeight;
    }

    function showTyping() {
      const typingDiv = document.createElement("div");
      typingDiv.className = "chat-typing";
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
      showTyping();

      try {
        const res = await fetch("https://walrus.kalavishva.com/webhook/convox_trial", {
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
        });

        const data = await res.json();
        hideTyping();

        const botReply = Array.isArray(data) && data.length > 0
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
