import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-e5202-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const messagesListInDB = ref(database, "messages")


const textareaEl = document.getElementById("endor-textarea")
const buttonEl = document.getElementById("publsh-btn")
const messagesEl = document.getElementById("endorsements")

buttonEl.addEventListener("click", function(){
    let comment = textareaEl.value

    // addCommentToEndorsList(comment) --> locally!!
    push(messagesListInDB, comment)
    
    clearTextArea()
})

// On change in Firebase Database
onValue(messagesListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let messagesArray = Object.entries(snapshot.val())
        
        clearMessagesList()
        // messagesEl.innerHTML = ""

        for(let i = 0; i < messagesArray.length; i++) {
            let currentMessage = messagesArray[i]
            // let currentMessageID = currentMessage[0]
            // let currentMessageValue = currentMessage[1]

            appendMessageToMessagesListEl(currentMessage)
        }
    } else {
        messagesEl.innerHTML = "<span style='color:#F59E0B'>No items here yet...</span>"
    }
}) 


function addCommentToEndorsList(value) {
    let newEl = document.createElement("li")
    newEl.textContent = value
    messagesEl.append(newEl)
}

function clearTextArea() {
    textareaEl.value = ""
}

function clearMessagesList() {
    messagesEl.innerHTML = ""
}

function appendMessageToMessagesListEl(currentMessage) {
    let currentMessageID = currentMessage[0]
    let currentMessageValue = currentMessage[1]

    let newEl = document.createElement("li")

    newEl.textContent = currentMessageValue

    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `messages/${currentMessageID}`)
        
        remove(exactLocationOfItemInDB)
    })

    messagesEl.append(newEl)
}