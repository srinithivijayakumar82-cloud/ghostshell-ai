const AI_ENDPOINT = "https://ghostshell-ai.srinithi4401.workers.dev";
const input = document.getElementById("user-input");
const summonButton = document.getElementById("summon-btn");
const responseBox = document.getElementById("response-box");
const responseState = document.getElementById("response-state");
const responseSubtitle = document.getElementById("response-subtitle");
const modeKicker = document.getElementById("mode-kicker");
const inputLabel = document.getElementById("input-label");
const suggestions = document.getElementById("suggestions");
let currentMode = "explain";

const modeConfig = {
  explain: {
    kicker: "COMMAND ORACLE",
    label: "Enter a command to investigate",
    placeholder: "e.g. git status",
    suggestions: ["git status", "pwd", "rm -rf /"]
  },
  code: {
    kicker: "CODE SÉANCE",
    label: "Paste a small code snippet or ask a coding question",
    placeholder: "e.g. Explain a Python for-loop",
    suggestions: ["Explain a Python for-loop", "What is a Git branch?", "Why use a try/except?"]
  },
  story: {
    kicker: "HAUNTED STORY",
    label: "Give the ghost a prompt for a tiny spooky story",
    placeholder: "e.g. A developer hears typing at 3 AM",
    suggestions: ["A developer hears typing at 3 AM", "The last commit", "A bug that only appears at midnight"]
  }
};

const commandResponses = {
  "git status": {
    title: "Your repository whispers...",
    text: "`git status` shows the current state of your Git working tree: changed files, staged changes, and untracked files. It helps you see what may be included in your next commit.",
    tip: "Ghost tip: this command only reports information. It does not change your files."
  },
  "pwd": {
    title: "You are standing here.",
    text: "`pwd` means “print working directory.” In a Unix-like terminal, it prints the full path of the directory you're currently in.",
    tip: "Ghost tip: when you feel lost in the filesystem, ask `pwd` where you are."
  },
  "rm -rf /": {
    title: "⚠ A dangerous spell detected!",
    text: "`rm` removes files, `-r` means recursive, and `-f` forces removal without prompting. Combined with a root path, this can attempt catastrophic deletion on systems where protections do not stop it.",
    tip: "Safety first: never run destructive commands you don't understand. GhostShell never executes any command."
  },
  "ls": {
    title: "The directory reveals its secrets.",
    text: "`ls` lists files and directories in your current location. Options such as `ls -la` can show hidden entries and additional details.",
    tip: "Ghost tip: listing files is a safe first step when exploring a new project."
  },
  "mkdir": {
    title: "A new chamber appears.",
    text: "`mkdir` creates a directory. For example, `mkdir spooky-project` creates a folder called `spooky-project` in your current directory.",
    tip: "Ghost tip: check your current directory before creating files or folders."
  }
};


function safeText(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[ch]);
}


function formatMarkdown(markdown) {
  const escapeHTML = (text) =>
    text.replace(/[&<>"']/g, ch => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[ch]);

  function inline(text) {
    let result = escapeHTML(text);
    const codeSpans = [];

    // Preserve inline code before formatting other text.
    result = result.replace(/`([^`]+)`/g, (_, code) => {
      const token = `%%CODESPAN${codeSpans.length}%%`;
      codeSpans.push(`<code>${code}</code>`);
      return token;
    });

    result = result
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.+?)__/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/_([^_]+)_/g, "<em>$1</em>");

    codeSpans.forEach((code, i) => {
      result = result.replace(`%%CODESPAN${i}%%`, code);
    });

    return result;
  }

  const lines = String(markdown).replace(/\r/g, "").split("\n");
  const output = [];
  let paragraph = [];
  let listType = null;
  let inCode = false;
  let codeLines = [];

  function flushParagraph() {
    if (paragraph.length) {
      output.push(`<p>${paragraph.map(inline).join("<br>")}</p>`);
      paragraph = [];
    }
  }

  function closeList() {
    if (listType) {
      output.push(`</${listType}>`);
      listType = null;
    }
  }

  function closeBlocks() {
    flushParagraph();
    closeList();
  }

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (!inCode) {
        closeBlocks();
        inCode = true;
        codeLines = [];
      } else {
        output.push(
          `<pre><code>${escapeHTML(codeLines.join("\n"))}</code></pre>`
        );
        inCode = false;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    const trimmed = line.trim();

    if (!trimmed) {
      closeBlocks();
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      closeBlocks();
      const level = heading[1].length;
      output.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      closeBlocks();
      output.push("<hr>");
      continue;
    }

    const bullet = trimmed.match(/^[-*+]\s+(.+)$/);
    const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/);

    if (bullet || numbered) {
      flushParagraph();
      const nextType = bullet ? "ul" : "ol";

      if (listType !== nextType) {
        closeList();
        listType = nextType;
        output.push(`<${listType}>`);
      }

      output.push(`<li>${inline((bullet || numbered)[1])}</li>`);
      continue;
    }

    const quote = trimmed.match(/^>\s?(.*)$/);
    if (quote) {
      closeBlocks();
      output.push(`<blockquote>${inline(quote[1])}</blockquote>`);
      continue;
    }

    closeList();
    paragraph.push(trimmed);
  }

  if (inCode) {
    output.push(
      `<pre><code>${escapeHTML(codeLines.join("\n"))}</code></pre>`
    );
  }

  closeBlocks();
  return output.join("\n");
}



function renderResponse(title, text, tip) {
  const formattedAnswer = DOMPurify.sanitize(
    marked.parse(String(text ?? ""))
  );

  responseBox.innerHTML = `
    <h3 class="answer-title">${safeText(title)}</h3>
    <div class="answer-text markdown-content">
      ${formattedAnswer}
    </div>
    <div class="answer-tip">${safeText(tip)}</div>
  `;

  responseState.textContent = "AWAKE";
  responseState.style.color = "var(--mint)";
  responseSubtitle.textContent = "A response from the ghost";
}


function explainCommand(query) {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, " ");
  if (commandResponses[normalized]) return commandResponses[normalized];
  if (normalized.startsWith("git ")) {
    return {
      title: "A Git spell has been summoned.",
      text: `You entered "${query}". Git commands help track changes to a project. The exact effect depends on the subcommand and its options. Look up the specific command before running it.`,
      tip: "Ghost tip: commands such as `git status` inspect state, while commands such as `git reset --hard` can discard work."
    };
  }
  if (!normalized) return {
    title: "The ghost hears only silence.",
    text: "Enter a command or choose one of the examples to get started.",
    tip: "Ghost tip: start with `pwd` or `git status`."
  };
  return {
    title: "The ghost squints at the runes...",
    text: `You entered "${query}". This prototype has a small built-in command library, so it can't reliably explain every command yet. Try git status, pwd, ls, mkdir, or rm -rf /.`,
    tip: "AI integration is planned for a later version. These replies are prewritten examples, not live AI output."
  };
}

function codeResponse(query) {
  const q = query.toLowerCase();
  if (q.includes("for-loop") || q.includes("for loop") || q.includes("python")) {
    return {
      title: "A loop through the mist.",
      text: "A Python `for` loop repeats a block of code for each item in a sequence. Example: `for name in [\"Ada\", \"Linus\"]: print(name)` prints each name on its own line.",
      tip: "Ghost tip: indentation defines the body of a Python loop. One misplaced space can summon a bug."
    };
  }
  if (q.includes("git branch")) {
    return {
      title: "A path not yet taken.",
      text: "A Git branch is a movable pointer to a line of development. Branches let you work on a feature or experiment without immediately changing the main line of work.",
      tip: "Ghost tip: branches are useful, but remember to commit your work and merge it intentionally."
    };
  }
  if (q.includes("try") || q.includes("except")) {
    return {
      title: "A shield against exceptions.",
      text: "In Python, `try` lets you run code that might raise an exception, and `except` handles a matching error so your program can respond instead of crashing unexpectedly.",
      tip: "Ghost tip: catch specific exceptions when possible; hiding every error can make bugs harder to find."
    };
  }
  return {
    title: "The code spirits are listening.",
    text: `Your prompt: "${query}". This demo currently includes a few curated coding explanations. When a real open-weight model is connected, this panel can answer a wider range of questions.`,
    tip: "Prototype notice: this is a fixed demo response, not output from a connected AI model."
  };
}

function storyResponse(query) {
  const prompt = query.trim() || "A developer hears typing at 3 AM";
  const stories = [
    `At 3:07 AM, ${prompt.toLowerCase()}. The monitor flickered. A new line appeared in the terminal: “I remember the code you deleted.” The developer checked the commit history. The last commit was dated tomorrow.`,
    `The office was empty when ${prompt.toLowerCase()}. Every screen woke at once. On each one was the same message: “You left one bug unfixed.” Then the tests began passing—one by one—without anyone touching the keyboard.`,
    `Nobody believed the legend until ${prompt.toLowerCase()}. A cursor blinked in the dark. One character appeared, then another: “Hello, world.” The machine had been unplugged for thirteen years.`
  ];
  const index = Array.from(prompt).reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % stories.length;
  return {
    title: "A story from the other side...",
    text: stories[index],
    tip: "Ghost tip: the tale is generated from a few local story templates. No AI service is connected in this demo."
  };
}


async function summon() {
  const query = input.value.trim();

  if (!query) {
    renderResponse(
      "The ghost needs a prompt.",
      "Type something in the input field, or choose an example.",
      "Try asking the Command Oracle about pwd."
    );
    input.focus();
    return;
  }

  responseState.textContent = "SUMMONING…";
  responseState.style.color = "var(--purple)";
  responseSubtitle.textContent = "Contacting the Ghost in the Machine";
  summonButton.disabled = true;

  const titles = {
    explain: "The Command Oracle responds...",
    code: "The Code Séance responds...",
    story: "A story from the other side..."
  };

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mode: currentMode,
        prompt: query
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "The AI service returned an error.");
    }

    if (!data.reply) {
      throw new Error("The AI returned an empty response.");
    }

    renderResponse(
      titles[currentMode] || "The ghost responds...",
      data.reply,
      "Ghost tip: AI-generated answers can be wrong. Check important commands before running them."
    );

    responseSubtitle.textContent = "A response from the Ghost in the Machine";
  } catch (error) {
    renderResponse(
      "The connection is haunted...",
      error.message || "Could not contact the AI service.",
      "Check that your Worker is deployed and its settings are configured correctly."
    );
    responseState.textContent = "CONNECTION FAILED";
    responseState.style.color = "var(--purple)";
    responseSubtitle.textContent = "The AI connection needs attention";
  } finally {
    summonButton.disabled = false;
  }
}


function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll(".mode-button").forEach(button => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const config = modeConfig[mode];
  modeKicker.textContent = config.kicker;
  inputLabel.textContent = config.label;
  input.placeholder = config.placeholder;
  suggestions.innerHTML = "";
  config.suggestions.forEach(value => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.value = value;
    button.textContent = value;
    suggestions.appendChild(button);
  });
  responseBox.innerHTML = '<div class="empty-ghost">☁</div><p class="empty-title">The veil is quiet.</p><p class="empty-copy">Type something above or choose a suggestion to wake the ghost.</p>';
  responseState.textContent = "DORMANT";
  responseState.style.color = "";
  responseSubtitle.textContent = "Waiting beyond the prompt";
  input.value = "";
  input.focus();
}

document.querySelectorAll(".mode-button").forEach(button => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});
suggestions.addEventListener("click", event => {
  const button = event.target.closest("button[data-value]");
  if (!button) return;
  input.value = button.dataset.value;
  summon();
});
summonButton.addEventListener("click", summon);
input.addEventListener("keydown", event => {
  if (event.key === "Enter") summon();
});
