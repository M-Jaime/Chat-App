// SESSÃO DE LOGIN
// login elements
const Login = document.querySelector('.login')
const loginForm = Login.querySelector('.login__form')
const loginTitle = Login.querySelector('.login h2')
const loginInput = Login.querySelector('.login-input')


// SESSÃO DE CHAT
// chat elements
const Chat = document.querySelector('.chat')
const chatMessages = Chat.querySelector('.chat__messages')
const chatForm = Chat.querySelector('.chat__form')
const chatInput = Chat.querySelector('.chat-input')
const chatBtn = Chat.querySelector('.chat-btn')


// PARA FUNÇÃO DE COR NO CHAT
const colors = [
    "red",
    "greenyellow",
    "pink",
    "gold",
    "blue",
    "green",
    "dodgerblue"
]

const user = {id: "", name: "", color:""}


let websocket; 

const getRandomColor = ()=>{
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const createLocalMessage = (content)=>{
    const div = document.createElement('div')
    div.classList.add('local-msg')
    div.innerHTML = content
    return div
}
const createRemoteMessage = (content, remoteSender, senderColor)=>{
    const span = document.createElement('span');
    const div = document.createElement('div')
    div.classList.add('remote-msg')
    span.classList.add('remote-sender')
    span.style.color = senderColor
    span.innerHTML = remoteSender
    div.appendChild(span)
    div.innerHTML += content


    return div
}

const scrollScreen = ()=>{
    window.scrollTo(
        {
            top : document.body.scrollHeight,
            behavior: 'smooth' 
        }
    )
};


const processMessage = ({data})=>{
    const {userId, userName, userColor , content} = JSON.parse(data);
    
    
    let message = 
    userId == user.id ? 
    createLocalMessage(content) : 
    createRemoteMessage(content, userName, userColor)  

    chatMessages.appendChild(message)
    scrollScreen()
}

const handleLogin = (event)=>{
    event.preventDefault()
    
    user.name = loginInput.value;
    user.id = crypto.randomUUID();
    user.color = getRandomColor()
    
    Login.style.display = `none`
    Chat.style.display = `flex`
    
    

    websocket = new WebSocket('ws://localhost:8080')
    websocket.onmessage = processMessage

    
}
const sendMessage = (event)=>{
    event.preventDefault()

    const message = {
        userId : user.id,
        userName : user.name,
        userColor : user.color,
        content : chatInput.value
    }

    websocket.send(JSON.stringify(message))
    chatInput.value = ""
}

loginForm.addEventListener('submit', handleLogin)
chatForm.addEventListener('submit', sendMessage)



