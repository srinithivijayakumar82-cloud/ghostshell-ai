# GhostShell 👻

**The terminal that talks back.**

GhostShell is a spooky, AI-powered developer companion that brings a little supernatural personality to learning terminal commands, exploring programming concepts, and creating eerie stories. Built with HTML, CSS, and JavaScript, GhostShell combines a dark, interactive terminal-inspired interface with real AI-generated responses.

🌐 **Live Website:** https://srinithivijayakumar82-cloud.github.io/ghostshell-ai/  
📦 **GitHub Repository:** https://github.com/srinithivijayakumar82-cloud/ghostshell-ai

## ✨ Features

- **🔮 Command Oracle:** Ask questions about terminal commands and receive clear explanations, practical examples, and safety warnings for potentially destructive commands.
- **💻 Code Séance:** Explore programming concepts, understand code examples, and get beginner-friendly coding guidance.
- **👻 Haunted Storyteller:** Summon original, eerie stories about haunted computers, mysterious code, and supernatural technology.
- **🤖 Real AI Integration:** Generates responses using Groq's hosted AI inference service through a server-side Cloudflare Worker.
- **📝 Markdown Rendering:** Displays AI responses with formatted headings, bold text, lists, code blocks, and other Markdown elements.
- **📱 Responsive Interface:** A dark, terminal-inspired design for an immersive experience across desktop and mobile devices.
- **🔐 Safer API Key Handling:** The Groq API key is stored as a Cloudflare Worker secret instead of being exposed in browser-side JavaScript.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling, animations, and responsive layout |
| JavaScript | User interactions and API requests |
| Groq API | Hosted AI inference |
| Cloudflare Workers | Backend API proxy and request handling |
| GitHub Pages | Static website hosting |
| Marked.js | Markdown parsing |
| DOMPurify | Sanitizing rendered HTML |

## 🚀 Try GhostShell

1. Visit the [live GhostShell website](https://srinithivijayakumar82-cloud.github.io/ghostshell-ai/).
2. Choose an available mode.
3. Enter a question or prompt.
4. Summon GhostShell and explore the AI-generated response.

### Example prompts

**Command Oracle**
- What does `pwd` do?
- Explain the difference between `cd` and `ls`.
- What does the `mkdir` command do?

**Code Séance**
- Explain a Python `for` loop with an example.
- Help me understand a JavaScript function.
- Explain what a variable is to a beginner.

**Haunted Storyteller**
- Tell me a short story about a haunted computer.
- Write a creepy story about a programmer receiving messages from the future.

## 💻 Run Locally

### Prerequisites

- A modern web browser.
- A code editor such as Visual Studio Code.
- Internet access for the hosted AI service and JavaScript libraries.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/srinithivijayakumar82-cloud/ghostshell-ai.git
   ```

2. Open the project folder:

   ```bash
   cd ghostshell-ai
   ```

3. Start a local development server, for example with the Live Server extension in Visual Studio Code.

4. Open the local website through the development server.

The frontend uses plain HTML, CSS, and JavaScript. AI responses require the configured Cloudflare Worker and a valid Groq API key stored securely on the server side.

## 🏗️ Architecture

GhostShell separates the user interface from the AI service:

1. The user enters a prompt in the browser.
2. The frontend sends the selected mode and prompt to the Cloudflare Worker.
3. The Worker validates the request and forwards it to the Groq API.
4. The AI-generated response is returned to the frontend.
5. Markdown is rendered into readable content, with HTML sanitization applied before display.

**Request flow:**

`Browser → Cloudflare Worker → Groq API → Cloudflare Worker → Browser`

## 🔐 Security

- Never place your Groq API key in `script.js`, HTML, CSS, or other public frontend files.
- Store the API key as a Cloudflare Worker secret named `GROQ_API_KEY`.
- Configure `ALLOWED_ORIGIN` to match the trusted website origin.
- Keep request validation and appropriate CORS handling in the Worker.
- Remember that CORS is a browser security mechanism, not authentication. For a public deployment, consider rate limiting and other abuse-prevention measures.

GhostShell does not execute user-entered shell commands. It explains commands and programming concepts through AI-generated responses.

## 🌍 Deployment

GhostShell's frontend is hosted on GitHub Pages, while its AI requests are handled by Cloudflare Workers.

- **Frontend:** [GitHub Pages](https://srinithivijayakumar82-cloud.github.io/ghostshell-ai/)
- **Backend:** Cloudflare Workers
- **AI inference:** Groq API

To deploy your own version, publish the frontend files through GitHub Pages and configure a backend Worker with your own provider credentials, appropriate CORS settings, and request validation. Do not commit private API keys to the repository.

## 🎃 Hacktoberfest Week 4

**Theme: Ghost in the Machine**

GhostShell explores the intersection of AI, developer tools, and spooky interactive design. It aims to make learning terminal commands and programming concepts more approachable through a playful, AI-powered experience.

## 🤝 Contributing

Contributions and ideas are welcome! Potential improvements include:

- Additional learning modes and programming languages.
- Better terminal-command examples and safety guidance.
- Improved accessibility and mobile usability.
- Conversation history and customizable AI personalities.
- Stronger backend abuse prevention and error handling.

## 📄 License

GhostShell is licensed under the **MIT License**. You are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the software, subject to the terms of the license.

See the [`LICENSE`](LICENSE) file for the complete license terms and conditions.

Copyright (c) 2026 srinithivijayakumar82-cloud
