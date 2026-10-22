[English](README.md) · [Tiếng Việt](README.vi.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

# Agent Workspace

Agent Workspace ist eine macOS-App, die Claude Code, Codex und Antigravity in einem Fenster zusammenführt. So siehst du, welche Agenten arbeiten und welche auf dich warten.

<img src="images/app-icon.png" width="128" alt="Agent Workspace">

Lade die neueste Version herunter: [Agent-Workspace-arm64-notarized.zip](https://github.com/dat08101999/agent-workspace/releases/latest/download/Agent-Workspace-arm64-notarized.zip) (weitere Versionen findest du auf der Seite [Releases](https://github.com/dat08101999/agent-workspace/releases)).

Die Projektseite mit interaktiver Demo und Film: https://dat08101999.github.io/agent-workspace/

Dieses Repo enthält nur Dokumentation, die Projektseite (im Branch `gh-pages`) und Installationsdateien. Der Quellcode der App ist hier nicht enthalten.

## Was die App macht

Du öffnest mehrere Agenten gleichzeitig, jeder arbeitet in einem anderen Ordner. Einer hält an, um zu fragen, ob er eine Datei bearbeiten darf. Du bist in einem anderen Fenster und bemerkst es nicht. Der Agent wartet weiter.

Agent Workspace sammelt deine Chats in einer Seitenleiste. Du siehst, welche Chats laufen und welche auf dich warten. Wenn du gebraucht wirst, zeigt die App eine macOS-Mitteilung und eine Zahl auf dem Dock-Symbol. Antworte in der App.

Die App verwendet Claude Code, Codex und Antigravity, die bereits auf deinem Mac installiert und angemeldet sind. Sie hat kein eigenes Konto.

## Was du brauchst

- Einen Mac mit Apple silicon.
- `python3` auf deinem Mac. Die Version aus den Xcode Command Line Tools reicht aus. Falls sie fehlt, führe `xcode-select --install` im Terminal aus.
- Mindestens eines der drei Tools: Claude Code, Codex oder Antigravity. Es muss installiert und angemeldet sein.

Du musst weder .NET noch Node installieren. Der Server ist in der App enthalten.

## Installation

1. **ZIP herunterladen.** Klicke auf „Für Mac laden“, um `Agent-Workspace-arm64-notarized.zip` herunterzuladen.
2. **In Programme verschieben.** Entpacke die Datei und ziehe `Agent Workspace.app` in den Ordner Programme.
3. **App öffnen.** Öffne Agent Workspace aus Programme. Falls macOS nach dem Öffnen einer aus dem Internet geladenen App fragt, klicke auf Öffnen.

Der aktuelle Download hat eine gültige Developer-ID-Signatur und ein angeheftetes Beglaubigungsticket von Apple. Gatekeeper hat die entpackte App akzeptiert.

## Beim ersten Start

Die App findet Claude Code, Codex und Antigravity auf deinem Mac und verbindet sich automatisch mit ihnen. Du musst nichts anklicken. Die Ergebnisse findest du unter Einstellungen → Anbieter.

1. Füge einen Ordner hinzu. Verwende „Ordner hinzufügen“ unten in der Ordnerliste der Seitenleiste. Ein Ordner auf dem Laufwerk ist ein Arbeitsbereich für die App.
2. Öffne in diesem Ordner einen Chat über das „+“ neben dem Ordnernamen.
3. Wähle, wo der Chat läuft (Claude Code, Codex oder Antigravity), und wähle dann ein Modell und den Aufwand.
4. Schreibe deine erste Nachricht und sende sie.

Ein neuer Chat ist ein Entwurf. Die App erstellt beim Anbieter erst dann eine Unterhaltung, wenn du die erste Nachricht sendest.

![Erster Start: noch keine Ordner](images/lan-mo-dau.png)

## So funktioniert es

Die App ist ein natives Fenster mit einer Webseite, die auf deinem Mac läuft. Ein kleiner Server stellt diese Seite bereit. Die App startet den Server selbst. Er lauscht nur auf `127.0.0.1` (Port 5188). Er kommuniziert mit Claude Code, Codex und Antigravity auf deinem Mac. Hilfsskripte laufen mit dem `python3` deines Macs.

```
App-Fenster  <->  lokaler Server 127.0.0.1:5188  <->  Claude Code / Codex / Antigravity
                                                       (auf deinem Mac)
```

Die App ruft keine Modell-API auf. Jeder Durchlauf wird mit den Tools des Anbieters ausgeführt.

## Funktionen

### Sehen

- Die Seitenleiste zeigt, welche Chats laufen und welche auf dich warten (mit dem Zeichen „!“). Der Zähler `N braucht dich` zeigt, wie viele Chats dich brauchen.
- Wenn das Fenster im Hintergrund ist und ein Agent dich etwas fragt, zeigt macOS eine Mitteilung und das Dock-Symbol die Zahl der wartenden Chats.
- Wenn ein Durchlauf endet, zeigt macOS eine Mitteilung „fertig“. Du kannst sie im App-Menü unter „Mitteilung bei fertigem Agent“ ausschalten. Mitteilungen zu Fragen bleiben aktiviert.
- Nach jedem Durchlauf listet ein Block die bearbeiteten Dateien auf. Klicke auf eine Datei, um sie in der rechten Spalte zu öffnen.
- Der Bildschirm für Nutzungslimits zeigt die Limits, die jeder Anbieter meldet.
- Klappe jeden Arbeitsschritt (einen Befehl ausführen, eine Datei bearbeiten) auf, um die Befehlsausgabe oder das Diff der Datei zu sehen.
- Checklisten-Pläne und das vom Anbieter bereitgestellte Nachdenken erscheinen im Chat.
- Die Benutzeroberfläche ist auf Englisch, Vietnamesisch, Spanisch, Portugiesisch (Brasilien), Französisch und Deutsch verfügbar. Sie folgt der Sprache deines Macs; ändere sie unter Einstellungen → Sprache.
- „Agenten-Büro“ ist ein Pixel-Art-Büro. Jeder Agent ist eine Figur, deren Haltung den tatsächlichen Status zeigt: Sie arbeitet am Schreibtisch, winkt, wenn sie dich braucht, zeigt nach dem Beenden ein Häkchen und ein kleiner Roboter stellt einen Kind-Agent dar.

### Genehmigen

- Anfragen zu Berechtigungen von Claude Code, Codex und Antigravity erscheinen als Karten. Bei Dateiänderungen zeigt die Karte entfernte und hinzugefügte Zeilen. Auf einer Antigravity-Karte erlaubt „In diesem Chat erlauben“ später auch dieselbe Art von Befehl in diesem Chat.
- Auch Fragen und Pläne von Claude Code erscheinen dort. Bei Codex enthalten die Karten außerdem Anfragen zum Ausführen von MCP-Tools, Formulare und zu öffnende Seiten.
- Fragen von einem im Hintergrund laufenden Claude-Kind-Agent erscheinen ebenfalls, damit du sie beantworten kannst.

![Eine Genehmigungskarte für eine Änderung in Claude Code](images/duyet.png)

### Stoppen

- Du kannst einen laufenden Durchlauf stoppen.
- Ein gestoppter Durchlauf ist mit „Dieser Durchlauf wurde gestoppt.“ gekennzeichnet.
- Bei einem fehlgeschlagenen Durchlauf wird der vom Anbieter gemeldete Grund angezeigt.

### Fortsetzen

- Sende eine weitere Nachricht, während ein Durchlauf läuft.
- Lade die Seite neu, ohne den laufenden Durchlauf zu verlieren.
- Für jeden Chat kannst du Runtime (Claude Code, Codex oder Antigravity), Modell und Aufwand separat wählen.
- Bei einem Entwurf-Chat wird beim Anbieter erst mit der ersten Nachricht etwas erstellt.
- Hänge Bilder, PDFs und Textdateien bei allen drei Anbietern an.
- Bearbeite eine gesendete Nachricht: Die Unterhaltung springt zu dieser Nachricht zurück, damit du sie erneut senden kannst. Bei Claude Code kannst du auch Dateien wiederherstellen, die nach dieser Nachricht bearbeitet wurden.
- Zweige von einer Nachricht ab, um in einem neuen Chat eine andere Richtung auszuprobieren.
- Wähle im Eingabefeld den Berechtigungsmodus: pro Chat für Claude Code und Codex; pro Ordner für Antigravity (Request Review, Default oder Turbo, gespeichert in den Antigravity-Einstellungen dieses Projekts).
- Mit Codex: später senden (eine Nachricht wartet, bis der laufende Durchlauf endet), Plan-Modus, Prüfung und Ziele.
- Hintergrundaufgaben von Claude Code und Antigravity: Ausgabe ansehen und einzelne Aufgaben stoppen.

### Connectors (MCP-Server)

- Im Eingabefeld listet „+“ → Connector die MCP-Server des Anbieters auf, den der Chat verwendet.
- Schalte einzelne Server ein oder aus, verbinde einen ausgefallenen Server erneut und melde dich bei Servern an, die eine Anmeldung erfordern (Codex, Antigravity).
- Bei Codex und Antigravity gelten Änderungen für alle Chats dieses Anbieters auf deinem Mac, auch in der nativen App. Bei Claude Code gelten sie nur für diesen Ordner.
- Bevor du den `pet_task_manager`-Server der App ausschaltest, fragt die App noch einmal nach, weil die Delegierung ihn benötigt.

### An einen anderen Agenten delegieren

- Bitte in einem beliebigen Chat (Claude Code, Codex oder Antigravity) einen Agenten eines anderen Anbieters um eine Aufgabe, zum Beispiel „Bitte Codex, diese Datei zu prüfen“. Die App öffnet einen echten Chat bei diesem Anbieter, sendet die Aufgabe und übermittelt die Antwort anschließend an den Chat zurück, der gefragt hat.
- Ein delegierter Chat steht unter dem Chat, von dem die Anfrage kam. Er befindet sich hinter der Schaltfläche „N untergeordnete Chats“ in der Seitenleiste und ist mit „delegiert“ markiert. Du kannst ihn öffnen und direkt darin schreiben.
- Bitte um ein Modell mit seinem bekannten Namen, zum Beispiel „Codex sol 6.1“. Wenn mehrere Modelle passen, erhält der Agent eine Auswahlliste oder fragt dich.
- Pro Chat können höchstens 3 Kind-Agenten gleichzeitig laufen. Kind-Agenten können keine weiteren Kind-Agenten erstellen.
- Diese Funktion ist standardmäßig ausgeschaltet. Aktiviere sie unter Einstellungen → Anbieter → „Kind-Agenten anderer Anbieter“.

## Daten und Datenschutz

- Die App hat kein eigenes Konto und ruft keine Modell-API auf.
- Deine eigenen Tools Claude Code, Codex oder Antigravity senden Chat-Inhalte, nicht die App.
- Der lokale Server lauscht nur auf `127.0.0.1`.
- Die eigenen Daten der App (ein lokaler Token, eine Datenbank und Logs) liegen in `~/Library/Application Support/Agent Workspace`.
- Wenn du einen Chat oder Ordner in der App entfernst, wird beim Anbieter nichts gelöscht.
- Bei jedem Start fügt die App den MCP-Eintrag `pet_task_manager` zur Konfiguration jedes installierten Tools hinzu: `~/.claude.json` (Claude Code), `~/.codex/config.toml` (Codex), `~/.gemini/config/mcp_config.json` (Antigravity). So können Chats die Tools der App verwenden, zum Beispiel zum Delegieren an einen anderen Agenten. Vor dem Schreiben sichert die App die alte Datei daneben, lässt einen von jemand anderem angelegten `pet_task_manager`-Eintrag unverändert und fügt den Eintrag nicht erneut hinzu, wenn du ihn selbst entfernst.
- Ansonsten schreibt die App nur dann außerhalb ihres Datenordners, wenn du sie dazu aufforderst. Wenn du zum Beispiel unter „Statusquelle“ auf „Hook installieren“ klickst, fügt sie einen Beobachtungs-Hook zu `~/.claude/settings.json` (Claude Code) oder `~/.gemini/config/hooks.json` (Antigravity) hinzu. „Hook entfernen“ an derselben Stelle entfernt ihn.

## Aktuelle Einschränkungen

- Kind-Agenten in Antigravity erhalten von der App keine Berechtigungslimits: Sie folgen dem Antigravity-Modus ihres Ordners, den du über die Schaltfläche „Modus“ im Chat ändern kannst. Codex-Kind-Agenten sind standardmäßig schreibgeschützt.
- Im manuellen Berechtigungsmodus erscheint jedes Mal eine Genehmigungskarte, wenn Claude das Kind-Agent-Tool verwendet.
- Die Anmeldung bei MCP-Servern von Claude Code ist in der App noch nicht verfügbar. Verwende `/mcp` in Claude Code.
- Nur für macOS auf Apple silicon verfügbar.
- Die Mac-App benötigt macOS 12 oder neuer. Ältere macOS-Versionen werden nicht unterstützt.
- Die App wurde nur auf einigen wenigen Macs getestet. Wenn sie sich nicht öffnen lässt, melde es unter Issues.

## Deinstallation

1. Wenn du in der App auf „Hook installieren“ geklickt hast, klicke zuerst auf „Hook entfernen“. Der Hook-Befehl verweist auf den Speicherort der App und funktioniert nicht mehr, wenn du die App löschst oder verschiebst.
2. Beende `Agent Workspace`.
3. Ziehe `Agent Workspace` aus Applications in den Papierkorb.
4. Entferne den Eintrag `pet_task_manager` aus `~/.claude.json`, `~/.codex/config.toml` und `~/.gemini/config/mcp_config.json`. Dieser Eintrag verweist auf die App und funktioniert nach dem Löschen der App nicht mehr.
5. Um auch die Daten der App zu entfernen, lösche `~/Library/Application Support/Agent Workspace`.

## Fragen und Fehlerberichte

Erstelle ein Issue unter https://github.com/dat08101999/agent-workspace/issues.

Wenn du einen Fehler meldest, gib die App-Version, die macOS-Version, den Anbieter des Chats, deine Schritte und das beobachtete Ergebnis an. Füge keine Tokens oder vertraulichen Chat-Inhalte in ein Issue ein.
