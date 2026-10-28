# GhostShell 👻

**The terminal that talks back.** GhostShell is a spooky, beginner-friendly interactive web demo for exploring terminal commands, learning a little coding, and summoning short Halloween stories.

> Current status: **front-end prototype with simulated, prewritten responses.** It does not connect to an AI model and does not execute shell commands.

## Features

- **Command Oracle:** explanations for a handful of common commands, including a warning for `rm -rf /`.
- **Code Séance:** a few curated programming explanations.
- **Haunted Story:** a short spooky tale selected from local templates.
- Responsive dark interface for desktop and mobile.
- No dependencies, build step, API key, or backend required.

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser.

That's it. The site uses plain HTML, CSS, and JavaScript.

## Deploy with GitHub Pages

1. Create a public GitHub repository named `ghostshell` (or another name you prefer).
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose the `main` branch and `/(root)` folder, then save.
6. Wait for GitHub Pages to publish the site. The URL will appear in the Pages settings.

## Open-weight AI integration — planned

The next milestone is to connect an actual open-weight model through a suitable inference provider or a small backend. Before submitting this as an open-source AI challenge project, that integration must be implemented and tested. The model name, model license, provider, and any limitations should be documented accurately.

**Security note:** never put private API keys in browser JavaScript or commit them to a public repository. If using a hosted inference API, route requests through a backend or a provider-supported secure mechanism.

## Safety

GhostShell is a learning demo, not a real terminal. It never runs user-entered shell commands. Its responses are simulated and limited to a small set of examples.

## Hacktoberfest Week 4

Theme: **Ghost in the Machine**.

The project explores a spooky developer companion while leaving room for a future open-weight AI integration. See the DEV Community challenge instructions for submission requirements and required tags.
