(function () {
  const style = document.createElement('style');
  style.innerHTML = `
    .chat-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #007bff;
      background-image: url('https://raw.githubusercontent.com/RatheeshGitHub123/thirukural-bot/main/images/logo.png');
      background-size: 60%;
      background-repeat: no-repeat;
      background-position: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.2s, background-color 0.3s;
    }
    .chat-button:hover {
      background-color: #0056b3;
      transform: scale(1.1);
    }
    #loading-dots {
      display: inline-block;
      font-size: 24px;
      color:#007bff;
      letter-spacing: 2px;
      animation: blink 1s infinite steps(3);
    }
    @keyframes blink {
      0%, 100% { content: ''; }
      33% { content: '.'; }
      66% { content: '..'; }
    }
    #chatbot {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 464px;
      max-height: 80vh;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
      animation: fadeIn 0.4s ease-out;
    }
    #chatbot.maximized { width: 760px; }
    .chatbox-container {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      max-height: 80vh;
      scroll-behavior: smooth;
      scrollbar-width: thin;
      scrollbar-color: #bbb transparent;
    }
    .chatbox-container::-webkit-scrollbar {
      width: 6px;
    }
    .chatbox-container::-webkit-scrollbar-thumb {
      background-color: #bbb;
      border-radius: 3px;
    }
    .chatbox-container::-webkit-scrollbar-thumb:hover {
      background-color: #999;
    }
    header {
      height: 80px;
      background: #007bff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
    .logo-title { display: flex; align-items: center; }
    .logo {
      width: 41px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 10px;
    }
    .title {
      font-size: 18px;
      color: #fff;
      font-weight: bold;
    }
    .close-btn {
      font-size: 24px;
      color: #fff;
      cursor: pointer;
    }
    .close-btn:hover { color: #c0d4ff; }
    #input-area {
      display: flex;
      padding: 10px;
      background: white;
      border-top: 1px solid #ddd;
    }
    #user-input {
      flex: 1;
      padding: 12px;
      border: none;
      border-bottom-left-radius: 12px;
    }
    #send-button {
      width: 50px;
      background: transparent;
      color: #007bff;
      border-bottom-right-radius: 12px;
      font-size: 20px;
      cursor: pointer;
    }
    #send-button:hover { background: #e6f4ff; }
    .message {
      display: flex;
      align-items: flex-start;
      margin: 8px 0;
      max-width: 100%;
      animation: popIn 0.3s ease;
    }
    .message.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    .message.bot { align-self: flex-start; }
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin: 0 8px;
      object-fit: cover;
    }
    .text {
      padding: 10px 14px;
      border-radius: 6px;
      background: #d1e7dd;
    }
    .message.bot .text { background: #f8d7da; }
    .right-arrow {
      width: 0;
      height: 0;
      margin-top: 18px;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-right: 10px solid #f8d7da;
    }
    .left-arrow {
      width: 0;
      height: 0;
      margin-top: 9px;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-left: 10px solid #d1e7dd;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  // Inject HTML
  const html = `
    <div class="chat-button" id="chatButton"></div>
    <div id="chatbot">
        <header>
            <div class="logo-title">
                <img src="https://raw.githubusercontent.com/RatheeshGitHub123/thirukural-bot/main/images/logo.png" alt="Bot Logo" class="logo">
                <span class="title">Thirukkural Bot</span>
            </div>
            <div style="display: flex;gap:3px;">
                <span id="toggle-size" style="color:white;cursor: pointer;" title="Toggle Chat Size">🗖</span>
                <span class="close-btn">&times;</span>
            </div>
        </header>
        <div id="chatbox" class="chatbox-container"></div>
        <div id="input-area">
            <input id="user-input" placeholder="Enter kural number or keyword…">
            <button id="send-button">&#10148;</button>
            <span id="loading-dots" style="display: none;">&#8230;</span>
        </div>
    </div>
  `;
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  // Widget Logic
  const chatBtn = document.getElementById('chatButton');
  const chatWindow = document.getElementById('chatbot');
  const toggleBtn = document.getElementById("toggle-size");

  chatWindow.style.display = 'none';

  chatBtn.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
  });

  toggleBtn.addEventListener("click", () => {
    chatWindow.classList.toggle("maximized");
    toggleBtn.textContent = chatWindow.classList.contains("maximized") ? "🗕" : "🗖";
  });

  const botAvatar = 'https://raw.githubusercontent.com/RatheeshGitHub123/thirukural-bot/main/images/logo.png';
  const userAvatar = 'https://raw.githubusercontent.com/RatheeshGitHub123/thirukural-bot/main/images/user-avatar.png';

  document.querySelector('.close-btn').onclick = () => {
    chatWindow.style.display = 'none';
  };

  document.getElementById('send-button').onclick = sendMessage;
  document.getElementById('user-input').addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
  });

  function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;

    const sendIcon = document.getElementById('send-button');
    const loadingDots = document.getElementById('loading-dots');
    sendIcon.style.display = 'none';
    loadingDots.style.display = 'inline';

    appendMessage(text, 'user', userAvatar);
    input.value = '';

    const url = `https://thirukural-bot-backend-production.up.railway.app/api/thirukkurals/search?word=${encodeURIComponent(text)}`;
    fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.length) {
          const { id, Kural, Vilakam } = data[0];
          let extraExplanations = `Did you understand or want more explanations? <div id="more-questions"><button onclick="window.showMoreExplanations(${id})">Yes</button> <button>No</button></div>`;
          const content = `${decodeHtmlEntities(Kural)}<br><br>${decodeHtmlEntities(Vilakam)}<br><br>${extraExplanations}`;
          appendMessage(content, 'bot', botAvatar);
        } else {
          appendMessage('No matching Kural found.', 'bot', botAvatar);
        }
      })
      .catch(() => {
        appendMessage('Error: try again later.', 'bot', botAvatar);
      })
      .finally(() => {
        sendIcon.style.display = 'inline';
        loadingDots.style.display = 'none';
      });
  }

  function decodeHtmlEntities(str) {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.documentElement.textContent;
  }

  function appendMessage(message, sender, avatarUrl) {
    const chatbox = document.getElementById('chatbox');
    const el = document.createElement('div');
    el.className = `message ${sender}`;
    el.innerHTML = `
      <img src="${avatarUrl}" class="avatar">
      <div class="${sender === 'user' ? 'left-arrow' : 'right-arrow'}"></div>
      <div class="text">${message}</div>
    `;
    chatbox.appendChild(el);
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  // Make showMoreExplanations accessible globally
  window.showMoreExplanations = function (id) {
    const url = `https://thirukural-bot-backend-production.up.railway.app/api/thirukkurals/${id}`;
    fetch(url,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })
      .then(res => res.json())
      .then(data => {
        const { Parimezhalagar_Urai, M_Varadharajanar, Solomon_Pappaiya } = data;
        const content = `
          <h3>Parimezhalagar Urai</h3><br>${decodeHtmlEntities(Parimezhalagar_Urai)}
          <br><h3>Varadharajanar Urai</h3><br>${decodeHtmlEntities(M_Varadharajanar)}
          <br><h3>Solomon Pappaiya Urai</h3><br>${decodeHtmlEntities(Solomon_Pappaiya)}
        `;
        appendMessage(content, 'bot', botAvatar);
      })
      .catch(() => {
        appendMessage('Error loading more explanations.', 'bot', botAvatar);
      });
  };
})();
