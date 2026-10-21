[English](README.md) · [Tiếng Việt](README.vi.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

# Agent Workspace

Agent Workspace is a macOS app that puts Claude Code, Codex and Antigravity in one window, so you can see which agents are running and which are waiting for you.

<img src="images/app-icon.png" width="128" alt="Agent Workspace">

Download the latest version: [Agent-Workspace-arm64.dmg](https://github.com/dat08101999/agent-workspace/releases/latest/download/Agent-Workspace-arm64.dmg) (other versions are on the [Releases](https://github.com/dat08101999/agent-workspace/releases) page).

Landing page, with an interactive demo and a film: https://dat08101999.github.io/agent-workspace/

This repo contains only documentation, the landing page (the `gh-pages` branch) and installers. The app's source code is not here.

## What the app does

You open several agents at once, each working in a different folder. One stops to ask whether it may edit a file. You're in another window and don't notice. The agent keeps waiting.

Agent Workspace brings your chats into one sidebar. You can see which chats are running and which are waiting for you. When you are needed, the app shows a macOS notification and a count on the Dock icon. Reply in the app.

The app uses Claude Code, Codex and Antigravity already installed and signed in on your machine. It has no account of its own.

## What you need

- A Mac with Apple silicon.
- `python3` on your machine. The version from Xcode Command Line Tools is enough; if you don't have it, run `xcode-select --install` in Terminal.
- At least one of the three tools: Claude Code, Codex, Antigravity. It must be installed and signed in.

You don't need to install .NET or Node. The server comes with the app.

## Install

1. Click the link above, or go to Releases and download `Agent-Workspace-arm64.dmg`.
2. Open the DMG and drag `Agent Workspace` into Applications.
3. Open `Agent Workspace` from Applications. macOS will block it the first time and say it cannot verify the app.

The app is not signed with an Apple Developer ID or notarized by Apple, so macOS blocks it the first time. To allow it:

1. Dismiss the macOS warning.
2. Open System Settings → Privacy & Security.
3. Scroll down to Security. You'll see a message saying `Agent Workspace` was blocked.
4. Click "Open Anyway". In Vietnamese: Cài đặt hệ thống → Quyền riêng tư & Bảo mật → "Vẫn mở".
5. Confirm with your Mac password or Touch ID when macOS asks, then open the app again.

After that, open the app normally.

## First launch

The app finds Claude Code, Codex and Antigravity on your machine and connects to them automatically; you don't need to click anything. See the results in Settings → Provider.

1. Add a folder. Use "Add folder" at the bottom of the folder list in the sidebar. A folder on disk is a workspace for the app.
2. Open a chat in that folder with the "+" next to the folder's name.
3. Choose where the chat runs (Claude Code, Codex or Antigravity), then choose a model and effort level.
4. Type and send your first message.

A new chat is a draft. The app creates no conversation at the provider until you send the first message.

![First launch: no folders yet](images/lan-mo-dau.png)

## How it works

The app is a native window containing a web page running on your machine. A small server serves that page. The app starts this server itself. The server listens only on `127.0.0.1` (port 5188). It talks to Claude Code, Codex and Antigravity on your machine. Helper scripts run with your machine's `python3`.

```
App window  <->  local server 127.0.0.1:5188  <->  Claude Code / Codex / Antigravity
                                                  (on your Mac)
```

The app calls no model API. Every turn runs through the provider's tools.

## Features

### See

- The sidebar shows which chats are running and which are waiting for you (the "!" mark). The `N need you` counter shows how many chats need you.
- When the window is in the background and an agent asks you something, macOS shows a notification and the Dock icon shows the number of waiting chats.
- When a turn finishes, macOS shows a "done" notification. You can turn this off in the app menu under "Notify when Agent finishes". Question notifications stay on.
- After each turn, a block lists the edited files. Click a file to open it in the right column.
- The usage limits screen shows the limits each provider reports.
- Expand each work step (running a command, editing a file) to see the command's output or the file's diff.
- Checklist plans and the thinking the provider makes available appear in the chat.
- The interface is available in English, Vietnamese, Spanish, Portuguese (Brazil), French and German. It follows your Mac's language; change it in Settings → Language.
- "Agent Office" is a pixel-art office. Each agent is a character whose pose reflects its real status: working at a desk, waving when it needs you, a check mark when just finished, and a small robot for a child agent.

### Approve

- Permission requests from Claude Code, Codex and Antigravity appear as cards. For file edits, the card shows removed and added lines. On an Antigravity card, "Allow in this chat" also allows the same kind of command later in that chat.
- Claude Code's questions and plans appear there too. For Codex, cards also include requests to run MCP tools, forms and pages to open.
- Questions from a Claude child agent running in the background appear for you to answer too.

![An approval card for a Claude Code change](images/duyet.png)

### Stop

- You can stop a running turn.
- A stopped turn is marked "This turn was stopped."
- A failed turn shows the reason reported by the provider.

### Continue

- Send another message while a turn is running.
- Reload the page without losing the running turn.
- Each chat has its own choice of runtime (Claude Code, Codex or Antigravity), model and effort.
- A draft chat creates nothing at the provider until the first message.
- Attach images, PDFs and text files with all three providers.
- Edit a sent message: the conversation returns to that message so you can send it again. With Claude Code, you can also choose to restore files edited after that message.
- Branch from a message to try another direction in a new chat.
- Choose the permission mode in the composer: per chat for Claude Code and Codex; per folder for Antigravity (Request Review, Default or Turbo, saved in Antigravity's settings for that project).
- With Codex: send later (a message waits until the running turn finishes), Plan mode, review and goals.
- Background tasks from Claude Code and Antigravity: view output and stop individual tasks.

### Connectors (MCP servers)

- In the composer, "+" → Connector lists the MCP servers of the provider the chat uses.
- Turn each server on or off, reconnect a failed server, and sign in to servers that require it (Codex, Antigravity).
- With Codex and Antigravity, changes apply to every chat from that provider on your machine, including in its native app. With Claude Code, changes apply only to that folder.
- Before turning off the app's `pet_task_manager` server, the app asks again, because delegation needs it.

### Delegate to another agent

- In any chat (Claude Code, Codex or Antigravity), ask an agent from another provider to do something, for example "ask Codex to review this file". The app opens a real chat at that provider and sends the task, then returns the answer to the chat that asked.
- A delegated chat sits under the chat that asked, behind the "N children" button in the sidebar, with a "delegated" label. You can open it and message it directly.
- Ask for a model by its familiar name, for example "Codex sol 6.1". If that matches several models, the agent gets a list to choose from or asks you.
- Each chat can have at most 3 child agents running at once, and child agents cannot create more child agents.
- This feature is off by default. Enable it in Settings → Provider → "Child agents from other providers".

## Data and privacy

- The app has no account of its own and calls no model API.
- Your own Claude Code, Codex or Antigravity tools send chat content, not the app.
- The local server listens only on `127.0.0.1`.
- The app's own data (a local token, database and logs) is in `~/Library/Application Support/Agent Workspace`.
- Removing a chat or folder in the app deletes nothing at the provider.
- On each launch, the app adds an MCP entry named `pet_task_manager` to each installed tool's configuration: `~/.claude.json` (Claude Code), `~/.codex/config.toml` (Codex), `~/.gemini/config/mcp_config.json` (Antigravity). This lets chats use the app's tools, such as delegating to another agent. Before writing, the app backs up the old file beside the original, leaves any `pet_task_manager` entry placed by someone else alone, and does not add it again if you remove it yourself.
- Otherwise, the app writes outside its data folder only when you ask. For example, clicking "Install hook" under "Status source" adds an observation hook to `~/.claude/settings.json` (Claude Code) or `~/.gemini/config/hooks.json` (Antigravity). "Remove hook" in the same place removes it.

## Current limitations

- Child agents running in Antigravity do not receive permission limits from the app: they follow the Antigravity mode of their folder, which you can change from the chat's Mode button. Codex child agents are read-only by default.
- In Manual permission mode, each time Claude uses the child-agent tool, an approval card appears.
- Signing in to Claude Code's MCP servers is not available in the app yet; use `/mcp` in Claude Code.
- Only available for macOS on Apple silicon.
- The app is not signed with an Apple Developer ID or notarized by Apple, so you need the "Open Anyway" steps the first time.
- The app has only been tested on a few machines. If it won't open, report it in Issues.

## Uninstall

1. If you clicked "Install hook" in the app, click "Remove hook" first. The hook command points to the app's location and will break if the app is deleted or moved.
2. Quit `Agent Workspace`.
3. Drag `Agent Workspace` from Applications to the Trash.
4. Remove the `pet_task_manager` entry from `~/.claude.json`, `~/.codex/config.toml` and `~/.gemini/config/mcp_config.json`. This entry points to the app and will break when the app is deleted.
5. To remove the app's data too, delete `~/Library/Application Support/Agent Workspace`.

## Questions and bug reports

Open an issue at https://github.com/dat08101999/agent-workspace/issues.

When reporting a bug, include the app version, macOS version, the chat's provider, the steps you took and what you saw. Don't paste tokens or sensitive chat content into an issue.
