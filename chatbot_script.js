const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const chatMessages = document.getElementById("chatMessages");
const typingIndicator = document.getElementById("typingIndicator");
const menuButtonsContainer = document.getElementById("menuButtonsContainer");

let lastBotSections = {};
let fullResponseShown = false;
let waitingForDietPreference = false;
let storedSymptomForDiet = "";

const sectionData = {
    "Cause": "What are the possible causes of this?",
    "Condition": "What can be the likely conditions?",
    "Treatment": "What are the suggested treatments or precautions?",
    "Doctor Visit": "When should I consider seeing a doctor?",
    "Diet": "What diet should I follow?"
};

const baseUrl = "https://medibot-backend-nebf.onrender.com";

// Add message to chat window
function addMessage(message, isUser = false) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", isUser ? "user-message" : "bot-message");

    if (isUser) {
        messageElement.textContent = message;
    } else {
        messageElement.innerHTML = message;
    }

    chatMessages.appendChild(messageElement);

    if (!isUser) {
        setTimeout(() => {
            messageElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    } else {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function showTyping() {
    typingIndicator.style.display = "flex";
}
function hideTyping() {
    typingIndicator.style.display = "none";
}

function showMenuButtons() {
    menuButtonsContainer.innerHTML = '';
    for (const [label, msg] of Object.entries(sectionData)) {
        const button = document.createElement("button");
        button.textContent = label;
        button.className = "chat-button";
        button.onclick = () => handleSectionClick(label);
        menuButtonsContainer.appendChild(button);
    }
    const exitButton = document.createElement("button");
    exitButton.textContent = "❌ Exit";
    exitButton.className = "chat-button exit-button";
    exitButton.onclick = () => {
        waitingForDietPreference = false;
        menuButtonsContainer.innerHTML = '';
        addMessage("🩺 Take care and stay healthy! I'm here whenever you need me.");
    };
    menuButtonsContainer.appendChild(exitButton);
}

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    messageInput.value = '';
    sendBtn.disabled = true;
    showTyping();

    try {
        if (waitingForDietPreference) {
            let dietPref;
            const lowerMessage = message.toLowerCase();
            if (/\bnon[\s-]?veg\b/.test(lowerMessage)) {
                dietPref = "nonveg";
            } else if (/\bveg\b/.test(lowerMessage)) {
                dietPref = "veg";
            } else {
                dietPref = "veg"; // default
            }

            const response = await fetch(`${baseUrl}/diet`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    symptom: storedSymptomForDiet,
                    diet_type: dietPref
                })
            });

            const data = await response.json();
            console.log("Diet API response:", data);

            let formattedDiet = "";
            if (data.items && Array.isArray(data.items)) {
                data.items.forEach(item => {
                    formattedDiet += `🍲 ${item.food}: ${item.reason}<br>`;
                });
            }

            if (data.hydration) {
                formattedDiet += `<br>💧 Hydration: ${data.hydration}`;
            }

            hideTyping();

            if (formattedDiet.trim()) {
                addMessage(formattedDiet);
            } else {
                addMessage("❌ Couldn’t find a proper diet recommendation.");
            }

            // ✅ Show the menu buttons again after showing the diet
            showMenuButtons();

            waitingForDietPreference = false;
            return;
        }

        const response = await fetch(`${baseUrl}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        console.log("Backend response:", data);

        const ackMessage = data.response || "✅ I've understood your symptom. Please select what you'd like to know.";

        hideTyping();
        addMessage(ackMessage);

        lastBotSections = {
            cause: data.causes || "",
            condition: data.conditions || "",
            treatment: data.treatment || "",
            diet_veg: data.diet_veg || "",
            diet_nonveg: data.diet_nonveg || "",
            doctor: data.doctor || ""
        };

        if (!waitingForDietPreference) {
            storedSymptomForDiet = message;
        }

        showMenuButtons();

    } catch (error) {
        console.error("Error:", error);
        hideTyping();
        addMessage("❌ MediBot could not connect to the backend. Please try again later.");
    } finally {
        sendBtn.disabled = false;
        messageInput.focus();
    }
}

function handleSectionClick(label) {
    const key = label.toLowerCase();

    if (key.includes("diet")) {
        if (!storedSymptomForDiet) {
            addMessage("❗ Please enter a symptom first so I can suggest a diet.");
            return;
        }

        addMessage(sectionData[label], true);
        addMessage("Are you vegetarian or non-vegetarian?");

        const vegBtn = document.createElement("button");
        vegBtn.textContent = "Vegetarian";
        vegBtn.className = "chat-button";
        vegBtn.onclick = () => {
            messageInput.value = "veg";
            sendMessage();
        };

        const nonVegBtn = document.createElement("button");
        nonVegBtn.textContent = "Non-Vegetarian";
        nonVegBtn.className = "chat-button";
        nonVegBtn.onclick = () => {
            messageInput.value = "nonveg";
            sendMessage();
        };

        menuButtonsContainer.innerHTML = '';
        menuButtonsContainer.appendChild(vegBtn);
        menuButtonsContainer.appendChild(nonVegBtn);
        const exitButton = document.createElement("button");
        exitButton.textContent = "❌ Exit";
        exitButton.className = "chat-button exit-button";
        exitButton.onclick = () => {
            waitingForDietPreference = false;
            menuButtonsContainer.innerHTML = '';
            addMessage("🌿 Stay well and feel free to ask me anything else later!");
        };
        menuButtonsContainer.appendChild(exitButton);


        waitingForDietPreference = true;
        return;
    }

    const mappedKey = key.includes("cause") ? "cause"
        : key.includes("condition") ? "condition"
        : key.includes("treatment") ? "treatment"
        : "doctor";

    if (lastBotSections[mappedKey]) {
        addMessage(sectionData[label], true);
        addMessage(lastBotSections[mappedKey]);
    } else {
        addMessage(sectionData[label], true);
        addMessage("Sorry, I couldn't find information for that section.");
    }
}

messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener("click", sendMessage);
