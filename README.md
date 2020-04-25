# Chatroom
### a simple fullstack chat app with React, Next.js and Socket.io

### Get Started
```
git clone https://github.com/billju/chatroom-react
cd chatroom-react
npm install
node server.js
```
### Dependencies
```
"next": "9.3.5",
"react": "16.13.1",
"react-dom": "16.13.1",
"socket.io": "^2.3.0",
"socket.io-client": "^2.3.0",
"sqlite3": "^4.1.1"
"babel-plugin-transform-react-pug": "^7.0.1"
```
### How to import css in Next.js
```
global css(create _app.js in /pages)
import '../public/css/global.css'
export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />
}

local css
// by default, all static files should be stored in public folder
// we can take css as static file and import css with <link rel="stylesheet"> tag
import Head 
export default props=>pug`
    Head
        link(rel="stylesheet" href="/css/bootstrap.css")
`

threat css as a module
.d-flex{
    display: flex
}
import styles from '../styles/mystyle.module.css'
export default props=>pug`
    div(style=styles.d-flex)
`
caveat: every css file extension should named with "module.css"

threat css as an object
export default props=>pug`
    div(style={display:"flex", alignItems:"center, justifyContent:"center"})
`
```
### How to implement "scroll to bottom"?
```
// for parent node
parentNode.scrollTop = parentNode.scrollHeight
// for child nodes
childNode.scrollIntoView({ behavior:'smooth'})
```