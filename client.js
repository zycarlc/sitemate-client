import fetch from "node-fetch"
import readline from "readline"

const baseUrl = "http://localhost:8080"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

// Create an issue by sending a JSON object to the server
async function createIssue(issueData) {
    let [title, description, ...rest] = issueData.split(" ")
    let newIssue = {
        title: title,
        description: description,
    }
    console.log(newIssue)
    try {
        const response = await fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newIssue),
        })
        const data = await response.json()
        console.log("Created Issue:", data)
    } catch (error) {
        console.error("Error creating issue:", error.message)
    }
}

// Read an issue by requesting a JSON object from the server
async function readIssue(issueId) {
    try {
        const response = await fetch(`${baseUrl}/${issueId}`)
        const data = await response.json()
        console.log("Read Issue:", data)
    } catch (error) {
        console.error("Error reading issue:", error.message)
    }
}

// Read all issues by requesting a JSON array from the server
async function readIssues() {
    try {
        const response = await fetch(baseUrl)
        const data = await response.json()
        console.log("Read Issue:", data)
    } catch (error) {
        console.error("Error reading issue:", error.message)
    }
}

// Update an issue by sending a JSON object to the server
async function updateIssue(issueId, updatedData) {
    let [title, description, ...rest] = updatedData.split(" ")
    let newIssue = {
        title: title,
        description: description,
    }
    try {
        const response = await fetch(`${baseUrl}/${issueId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newIssue),
        })

        const data = await response.json()
        console.log("Updated Issue:", data)
    } catch (error) {
        console.error("Error updating issue:", error.message)
    }
}

// Delete an issue by requesting the server to delete it
async function deleteIssue(issueId) {
    try {
        const response = await fetch(`${baseUrl}/${issueId}`, {
            method: "DELETE",
        })

        if (response.status === 200) {
            console.log("Deleted Issue:", issueId)
        } else {
            console.error("Error deleting issue. Status:", response.status)
        }
    } catch (error) {
        console.error("Error deleting issue:", error.message)
    }
}

function askForAction() {
    rl.question(
        "Choose an action (create, read all, read, update, delete, or exit): ",
        action => {
            switch (action.toLowerCase()) {
                case "create":
                    rl.question(
                        'Enter issue data (separate title and description with " "):',
                        data => {
                            createIssue(data)
                            askForAction()
                        }
                    )
                    break
                case "read":
                    rl.question("Enter issue ID: ", issueId => {
                        readIssue(issueId)
                        askForAction()
                    })
                    break
                case "read all":
                    readIssues()
                    askForAction()
                    break
                case "update":
                    rl.question("Enter issue ID: ", issueId => {
                        rl.question(
                            "Enter updated issue data (JSON format): ",
                            data => {
                                updateIssue(issueId, data)
                                askForAction()
                            }
                        )
                    })
                    break
                case "delete":
                    rl.question("Enter issue ID: ", issueId => {
                        deleteIssue(issueId)
                        askForAction()
                    })
                    break
                case "exit":
                    rl.close()
                    break
                default:
                    console.log(
                        "Invalid action. Please choose one of (create, read, update, delete, exit)."
                    )
                    askForAction()
                    break
            }
        }
    )
}

askForAction()
