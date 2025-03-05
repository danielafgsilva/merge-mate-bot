# MergeMate - Slack & GitHub Integration

MergeMate is a Slack bot that integrates with GitHub to help teams manage pull requests, merges, and repository updates directly from Slack.

## 🚀 Features
- Connect your GitHub account to Slack
- Receive notifications on pull request updates
- Merge pull requests using Slack commands
- Check repository status and assigned reviews

## 📌 Prerequisites
Before running this project, ensure you have:
- **Node.js** installed (>=14.x recommended)
- **ngrok** for exposing the local server
- A **GitHub personal access token** with necessary scopes
- A **Slack App** with `commands` and `chat:write` permissions

## 🛠 Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/mergemate.git
   cd mergemate
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file with the following:
   ```ini
   CLIENT_ID=your_slack_client_id
   CLIENT_SECRET=your_slack_client_secret
   GITHUB_ACCESS_TOKEN=your_github_token
   PORT=3000
   ```

4. Start the server:
   ```sh
   node app.js
   ```

5. Expose the server using ngrok:
   ```sh
   ngrok http 3000
   ```
   Copy the generated URL and update Slack's **Request URL** settings.

## 🔥 Usage
Use the following Slack commands:
- `/mergemate connect github` → Connect your GitHub account
- `/mergemate status` → Check the status of your repositories
- `/mergemate merge` → Merge an open pull request

## 🛠 API Endpoints
- `POST /slack/events` → Handles Slack events and commands
- `POST /slack/command` → Processes custom Slack slash commands

## 🐛 Troubleshooting
- **Command not recognized?** Check if the Slack bot is correctly installed.
- **Ngrok not working?** Restart `ngrok http 3000` and update the Slack **Request URL**.
- **GitHub authentication issues?** Ensure the `GITHUB_ACCESS_TOKEN` has the necessary scopes.

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📫 Contact
For any questions or issues, feel free to open an issue or reach out at [danielafgsilva@ua.pt](mailto:danielafgsilva@ua.pt).


