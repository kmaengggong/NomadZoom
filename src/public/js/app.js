const socket = io();
const welcome = document.getElementById("welcome");
const nickForm = welcome.querySelector("#nickname");
const roomForm = welcome.querySelector("#create-room");
const room = document.getElementById("room");
const msgForm = room.querySelector("#message");

room.hidden = true;

let roomName;
let nickname = "Nameless";

function addMessage(msg, option) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    li.style.listStyle = "none";
    if(option !== undefined){
        li.style.color = "blue";
        // li.innerHTML = `<p>${msg}</p>`;
    }
    // else{
        // li.innerText = 
        // li.innerHTML = `<p style="color: blue;">${msg}</p>`
    // }
    // 
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#message input");
    const value = input.value;
    socket.emit("new_message", value, roomName, () => {
        addMessage(`You: ${value}`, "You");
    });
    input.value = "";
}

function showRoom(memberCount) {
    welcome.hidden = true;
    room.hidden = false;
    const h2 = room.querySelector("h2");
    h2.innerText = `Hi! ${nickname}🎃\nWelcome to "${roomName}" (🤸‍♂️${memberCount})`;
    // const nicknameForm = room.querySelector("#nickname");
    msgForm.addEventListener("submit", handleMessageSubmit);
    // nicknameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = roomForm.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}
roomForm.addEventListener("submit", handleRoomSubmit);

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    const value = input.value;
    socket.emit("nickname", value);
    nickname = value;
    
    const h2 = welcome.querySelector("h2");
    h2.innerText = `Hi! ${value}🎃`;
    input.value = "";
}
nickForm.addEventListener("submit", handleNicknameSubmit);


socket.on("welcome", (nick, memberCount) => {
    const h2 = room.querySelector("h2");
    h2.innerText = `Room: ${roomName} (🤸‍♂️${memberCount})`;
    addMessage(`${nick} joined the room!!!`);
});

socket.on("bye", (nick, memberCount) => {
    const h2 = room.querySelector("h2");
    h2.innerText = `Room: ${roomName} (🤸‍♂️${memberCount})`;
    addMessage(`${nick} left the room...`);
});

socket.on("new_message", (msg) => {
    addMessage(msg);
});

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length === 0){
        const li = document.createElement("li");
        li.innerHTML = "No Rooms yet 😅";
        li.style.listStyle = "none";
        roomList.append(li);
        return;
    }
    rooms.forEach((room) => {
        const li = document.createElement("li");
        li.style.listStyle = "none";
        li.innerHTML = `
            <a id=${room} style="text-decoration: none;">${room[0]} (${room[1]})</a>
        `;
        roomList.append(li);
        li.addEventListener("click", (event) => {
            socket.emit("enter_room", room[0], showRoom);
            roomName = room[0];
        });
    });
});

const backBtn = room.querySelector("#back");
backBtn.addEventListener("click", (event) => {
    event.preventDefault();
    welcome.hidden = false;
    room.hidden = true;
});