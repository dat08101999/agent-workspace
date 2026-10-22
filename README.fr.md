[English](README.md) · [Tiếng Việt](README.vi.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

# Agent Workspace

Agent Workspace est une app macOS qui réunit Claude Code, Codex et Antigravity dans une même fenêtre, pour voir quels agents travaillent et lesquels vous attendent.

<img src="images/app-icon.png" width="128" alt="Agent Workspace">

Téléchargez la dernière version : [Agent-Workspace-arm64-notarized.zip](https://github.com/dat08101999/agent-workspace/releases/latest/download/Agent-Workspace-arm64-notarized.zip) (les autres versions se trouvent sur la page [Releases](https://github.com/dat08101999/agent-workspace/releases)).

Page de présentation avec une démo interactive et un film : https://dat08101999.github.io/agent-workspace/

Ce dépôt contient uniquement de la documentation, la page de présentation (branche `gh-pages`) et les installateurs. Le code source de l’app ne s’y trouve pas.

## Ce que fait l’app

Vous ouvrez plusieurs agents à la fois, chacun travaillant dans un dossier différent. L’un d’eux s’arrête pour demander s’il peut modifier un fichier. Vous êtes dans une autre fenêtre et ne le remarquez pas. L’agent continue d’attendre.

Agent Workspace rassemble vos discussions dans une barre latérale. Vous voyez quelles discussions sont en cours et lesquelles vous attendent. Quand un agent a besoin de vous, l’app affiche une notification macOS et un compteur sur l’icône du Dock. Répondez dans l’app.

L’app utilise Claude Code, Codex et Antigravity déjà installés et connectés sur votre machine. Elle n’a pas de compte propre.

## Prérequis

- Un Mac avec une puce Apple silicon.
- `python3` sur votre machine. La version fournie avec Xcode Command Line Tools suffit ; si vous ne l’avez pas, exécutez `xcode-select --install` dans Terminal.
- Au moins l’un de ces trois outils : Claude Code, Codex, Antigravity. Il doit être installé et connecté.

Vous n’avez pas besoin d’installer .NET ni Node. Le serveur est fourni avec l’app.

## Installation

1. **Téléchargez le ZIP.** Cliquez sur « Télécharger pour Mac » pour obtenir `Agent-Workspace-arm64-notarized.zip`.
2. **Déplacez l’app dans Applications.** Décompressez le fichier, puis glissez `Agent Workspace.app` dans Applications.
3. **Ouvrez l’app.** Ouvrez Agent Workspace depuis Applications. Si macOS demande d’ouvrir une app téléchargée sur Internet, cliquez sur Ouvrir.

Le téléchargement actuel possède une signature Developer ID valide et un ticket de notarisation Apple joint. Gatekeeper a accepté l’app après extraction.

## Premier lancement

L’app détecte automatiquement Claude Code, Codex et Antigravity sur votre machine et s’y connecte ; vous n’avez rien à cliquer. Consultez le résultat dans Réglages → Fournisseur.

1. Ajoutez un dossier. Utilisez « Ajouter un dossier » en bas de la liste des dossiers dans la barre latérale. Un dossier sur le disque sert d’espace de travail à l’app.
2. Ouvrez une discussion dans ce dossier avec le « + » à côté de son nom.
3. Choisissez où la discussion s’exécute (Claude Code, Codex ou Antigravity), puis sélectionnez un modèle et un niveau d’effort.
4. Saisissez et envoyez votre premier message.

Une nouvelle discussion est un brouillon. L’app ne crée aucune conversation chez le fournisseur avant l’envoi du premier message.

![Premier lancement : aucun dossier pour le moment](images/lan-mo-dau.png)

## Fonctionnement

L’app est une fenêtre native qui contient une page web exécutée sur votre machine. Un petit serveur fournit cette page. L’app démarre elle-même ce serveur. Le serveur écoute uniquement sur `127.0.0.1` (port 5188). Il communique avec Claude Code, Codex et Antigravity sur votre machine. Les scripts auxiliaires utilisent le `python3` de votre machine.

```
Fenêtre de l’app  <->  serveur local 127.0.0.1:5188  <->  Claude Code / Codex / Antigravity
                                                        (sur votre Mac)
```

L’app n’appelle aucune API de modèle. Chaque tour passe par les outils du fournisseur.

## Fonctionnalités

### Voir

- La barre latérale indique quelles discussions sont en cours et lesquelles vous attendent (le signe « ! »). Le compteur `N ont besoin de vous` indique combien de discussions attendent votre intervention.
- Quand la fenêtre est en arrière-plan et qu’un agent vous sollicite, macOS affiche une notification et l’icône du Dock indique le nombre de discussions en attente.
- À la fin d’un tour, macOS affiche une notification « terminé ». Vous pouvez la désactiver dans le menu de l’app, sous « Notifier quand Agent a terminé ». Les notifications de question restent activées.
- Après chaque tour, un bloc répertorie les fichiers modifiés. Cliquez sur un fichier pour l’ouvrir dans la colonne de droite.
- L’écran des limites d’utilisation affiche celles communiquées par chaque fournisseur.
- Développez chaque étape de travail (exécution d’une commande, modification d’un fichier) pour voir la sortie de la commande ou le diff du fichier.
- Les plans sous forme de checklist et le raisonnement communiqué par le fournisseur apparaissent dans la discussion.
- L’interface est disponible en anglais, vietnamien, espagnol, portugais (Brésil), français et allemand. Elle suit la langue de votre Mac ; changez-la dans Réglages → Langue.
- « Bureau des agents » est un bureau en pixel art. Chaque agent est un personnage dont la pose reflète son état réel : au travail à son bureau, faisant signe quand il a besoin de vous, avec une coche quand il vient de finir, ou représenté par un petit robot s’il s’agit d’un sous-agent.

### Approuver

- Les demandes d’autorisation de Claude Code, Codex et Antigravity apparaissent sous forme de cartes. Pour les modifications de fichiers, la carte montre les lignes supprimées et ajoutées. Sur une carte Antigravity, « Autoriser dans cette discussion » autorise aussi ensuite le même type de commande dans ce chat.
- Les questions et les plans de Claude Code y apparaissent aussi. Pour Codex, les cartes incluent également les demandes d’exécution d’outils MCP, les formulaires et les pages à ouvrir.
- Les questions d’un sous-agent Claude exécuté en arrière-plan apparaissent également pour que vous puissiez y répondre.

![Carte d’approbation pour une modification de Claude Code](images/duyet.png)

### Arrêter

- Vous pouvez arrêter un tour en cours.
- Un tour arrêté porte la mention « Ce tour a été arrêté. »
- Un tour en échec affiche la raison communiquée par le fournisseur.

### Continuer

- Envoyez un autre message pendant qu’un tour est en cours.
- Rechargez la page sans perdre le tour en cours.
- Chaque discussion a ses propres choix de runtime (Claude Code, Codex ou Antigravity), de modèle et d’effort.
- Une discussion brouillon ne crée rien chez le fournisseur avant le premier message.
- Joignez des images, des PDF et des fichiers texte avec les trois fournisseurs.
- Modifiez un message envoyé : la conversation revient à ce message pour que vous puissiez le renvoyer. Avec Claude Code, vous pouvez aussi choisir de restaurer les fichiers modifiés après ce message.
- Créez une branche à partir d’un message pour explorer une autre piste dans une nouvelle discussion.
- Choisissez le mode d’autorisation dans le champ de saisie : par chat pour Claude Code et Codex ; par dossier pour Antigravity (Request Review, Default ou Turbo, enregistré dans les réglages d’Antigravity pour ce projet).
- Avec Codex : envoi différé (un message attend la fin du tour en cours), mode Plan, revue et objectifs.
- Tâches en arrière-plan de Claude Code et Antigravity : consultez la sortie et arrêtez chaque tâche séparément.

### Connecteurs (serveurs MCP)

- Dans le champ de saisie, « + » → Connecteur affiche les serveurs MCP du fournisseur utilisé par la discussion.
- Activez ou désactivez chaque serveur, reconnectez un serveur en échec et connectez-vous aux serveurs qui le demandent (Codex, Antigravity).
- Avec Codex et Antigravity, les changements s’appliquent à toutes les discussions de ce fournisseur sur votre machine, y compris dans son app native. Avec Claude Code, ils ne s’appliquent qu’à ce dossier.
- Avant de désactiver le serveur `pet_task_manager` de l’app, celle-ci vous le demande à nouveau, car la délégation en dépend.

### Déléguer à un autre agent

- Dans n’importe quelle discussion (Claude Code, Codex ou Antigravity), demandez à un agent d’un autre fournisseur d’effectuer une tâche, par exemple « demande à Codex de vérifier ce fichier ». L’app ouvre une véritable discussion chez ce fournisseur et lui envoie la tâche, puis renvoie sa réponse à la discussion d’origine.
- Une discussion déléguée apparaît sous celle qui l’a demandée, derrière le bouton « N enfants » dans la barre latérale, avec l’étiquette « déléguée ». Vous pouvez l’ouvrir et lui écrire directement.
- Demandez un modèle par son nom usuel, par exemple « Codex sol 6.1 ». Si ce nom correspond à plusieurs modèles, l’agent reçoit une liste de choix ou vous pose la question.
- Chaque discussion peut avoir au maximum 3 sous-agents en cours, et les sous-agents ne peuvent pas en créer d’autres.
- Cette fonctionnalité est désactivée par défaut. Activez-la dans Réglages → Fournisseur → « Sous-agents d’autres fournisseurs ».

## Données et confidentialité

- L’app n’a pas de compte propre et n’appelle aucune API de modèle.
- Ce sont vos outils Claude Code, Codex ou Antigravity qui envoient le contenu des discussions, pas l’app.
- Le serveur local écoute uniquement sur `127.0.0.1`.
- Les données propres à l’app (un jeton local, une base de données et des logs) se trouvent dans `~/Library/Application Support/Agent Workspace`.
- Supprimer une discussion ou un dossier dans l’app ne supprime rien chez le fournisseur.
- À chaque lancement, l’app ajoute une entrée MCP nommée `pet_task_manager` à la configuration de chaque outil installé : `~/.claude.json` (Claude Code), `~/.codex/config.toml` (Codex), `~/.gemini/config/mcp_config.json` (Antigravity). Les discussions peuvent ainsi utiliser les outils de l’app, par exemple pour déléguer à un autre agent. Avant d’écrire, l’app sauvegarde l’ancien fichier à côté de l’original, laisse intacte toute entrée `pet_task_manager` ajoutée par quelqu’un d’autre et ne la rajoute pas si vous la supprimez vous-même.
- Pour le reste, l’app n’écrit en dehors de son dossier de données que lorsque vous le demandez. Par exemple, en cliquant sur « Installer le hook » sous « Source d’état », elle ajoute un hook d’observation à `~/.claude/settings.json` (Claude Code) ou `~/.gemini/config/hooks.json` (Antigravity). « Supprimer le hook » au même endroit le retire.

## Limites actuelles

- Les sous-agents exécutés dans Antigravity ne reçoivent pas les limites d’autorisation de l’app : ils suivent le mode Antigravity de leur dossier, modifiable avec le bouton Mode du chat. Les sous-agents Codex sont en lecture seule par défaut.
- En mode d’autorisation Manuel, une carte d’approbation apparaît chaque fois que Claude utilise l’outil de sous-agent.
- Il n’est pas encore possible de se connecter aux serveurs MCP de Claude Code dans l’app ; utilisez `/mcp` dans Claude Code.
- Disponible uniquement sur macOS avec Apple silicon.
- L’app Mac nécessite macOS 12 ou version ultérieure. Les versions antérieures ne sont pas prises en charge.
- L’app n’a été testée que sur quelques machines. Si elle ne s’ouvre pas, signalez-le dans Issues.

## Désinstallation

1. Si vous avez cliqué sur « Installer le hook » dans l’app, cliquez d’abord sur « Supprimer le hook ». La commande du hook pointe vers l’emplacement de l’app et cessera de fonctionner si vous supprimez ou déplacez l’app.
2. Quittez `Agent Workspace`.
3. Faites glisser `Agent Workspace` d’Applications vers la Corbeille.
4. Supprimez l’entrée `pet_task_manager` de `~/.claude.json`, `~/.codex/config.toml` et `~/.gemini/config/mcp_config.json`. Cette entrée pointe vers l’app et cessera de fonctionner si vous la supprimez.
5. Pour supprimer également les données de l’app, effacez `~/Library/Application Support/Agent Workspace`.

## Questions et signalement de bogues

Ouvrez un ticket à l’adresse https://github.com/dat08101999/agent-workspace/issues.

Pour signaler un bogue, indiquez la version de l’app, la version de macOS, le fournisseur de la discussion, les étapes suivies et ce que vous avez observé. Ne collez pas de jetons ni de contenu sensible d’une discussion dans un ticket.
