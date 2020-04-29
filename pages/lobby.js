import Head from 'next/head'
import React from 'react'
import Emoji from '../components/emoji'
import Navbar from '../components/navbar'
import Finder from '../components/finder'
import io from 'socket.io-client'

class EventInfo extends React.Component{
    constructor(props){
        super(props)
    }
    getFormatTime(dateStr){
        let date = new Date(dateStr),
            now = new Date(),
            diff = now-date
        if(!(diff instanceof Date)) return '某時'
        diff/= 1000
        if(diff<60) return Math.round(diff)+'秒前'
        diff/=60
        if(diff<60) return Math.round(diff)+'分前'
        diff/=60
        if(diff<24) return Math.round(diff)+'小時前'
        return date.toLocaleString()
    }
    render(){
        let {username,event,date} = this.props.dialog
        let formatTime = this.getFormatTime(date)
        return(
            <React.Fragment>
                <span className="text-light ma-1">{username}</span>
                <span className="text-muted ma-1">{event}</span>
                <span className="text-muted text-small ma-1">{formatTime}</span>
            </React.Fragment>
        )
    }
}
export default class Lobby extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            dialogs: [
                {username:'煞氣a仔仔',avatar:'/small/狗狗1.png',text:'安安，萬華彭于晏～哪裡人？萬華彭于晏是真的嗎？'},
                {username:'小貓咪',avatar:'/small/狗狗1.png',text:'美中貿易戰再升級，中國大陸23日宣布對750億美元 進口美國商品分批加徵關稅後，美國總統川普隨即 「命令」美企撤出中國大陸，並將大陸國家主席習 近平稱為「敵人」，更表示要將總值約5,500億美元 大陸輸美商品加徵關稅的稅率，分批提升5個百分點'},
                {username:'萬華彭于晏',event:'加入聊天室',time:'今天20:32'}
            ],
            showFinder: false,
            file: null,
            imgSrc: null,
            text: '',
            username: '',
            avatar: '',
            oooDialog: false, //one on one dialog
            oooName: '',
            shouldScrollToBottom: true
        }
        this.socket = io()
        this.fileRef = React.createRef()
        this.ulRef = React.createRef()
        this.liRef = React.createRef()
    }
    toggleFinder(){
        this.setState(state=>({showFinder:!state.showFinder}))
    }
    sendMsg(event){
        let username = this.state.username,
            avatar = this.state.avatar,
            text = this.state.text,
            file = this.state.file,
            date = new Date().toString()
        if(this.state.text!=''||this.state.file!=null){
            let newChat = {username,avatar,text,file,date,event}
            this.setState(state=>({
                username,
                dialogs: [...state.dialogs, newChat],
                text: '',
                file: null,
                imgSrc: null,
                shouldScrollToBottom: true
            }))
            localStorage.setItem('chatroom-username', username)
            this.socket.emit('chat', newChat)
        }
    }
    handlePaste(event){
        if(!event.clipboardData) return
        if(!event.clipboardData.items) return
        for(let item of event.clipboardData.items){
            if(item.type.includes('image')){
                let blob = item.getAsFile()
                let img = new Image()
                img.src = URL.createObjectURL(blob)
            }
        }
    }
    handleFile(event){
        if(event.target.files){
            let file = event.target.files[0]
            const reader = new FileReader()
            if(file.size>1024*1024){
                return alert('檔案太大啦，別超過1MB')
            }
            reader.onload = e=>{
                this.setState({file: e.target.result})
                if(file.type.includes('image')){
                    this.setState({imgSrc: e.target.result})
                }
            }
            reader.readAsDataURL(file)
        }
    }
    handleKeyUp(event){
        if(event.key=='Enter'){
            this.sendMsg()
        }
        if(event.key=='Backspace'&&this.state.imgSrc){
            this.setState({imgSrc:null})
        }
    }
    componentDidUpdate(){
        if(this.state.shouldScrollToBottom){
            this.liRef.current.scrollIntoView({ behavior:'smooth'})
            this.setState({shouldScrollToBottom:false})
        }
    }
    componentDidMount(){
        let username = localStorage.getItem('chatroom-username')
        let avatar = localStorage.getItem('chatroom-avatar')
        if(username!=undefined&&avatar!=undefined){
            this.setState({username, avatar})
        }else{
            window.location = '/landpage'
        }
        this.socket.on('chat', msg=>{
            if(msg.username!=this.state.username){
                this.setState(state=>({dialogs:[...state.dialogs,msg]}))
            }
        })
        this.socket.on('loadMsg', rows=>{
            this.setState({dialogs:rows})
            if(this.ulRef.current){
                this.ulRef.current.scrollTop = this.ulRef.current.scrollHeight
            }
        })
    }
    render(){
        return pug`
            .container
                Head
                    link(rel="icon" href="/favicon.ico")
                    link(rel="stylesheet" href="/css/lobby.css")
                    link(rel="stylesheet" href="/css/navbar.css")
                    link(rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons")
                    meta(name="description" content="chatroom")
                    title Lobby
                Navbar(username=this.state.username href="/landpage")
                if this.state.showFinder
                    Finder(dialogs=this.state.dialogs toggle=e=>{this.toggleFinder()})
                ul.list(ref=this.ulRef)
                    each dialog, index in this.state.dialogs
                        if dialog.username==this.state.username
                            li.flex-end(key=index ref=this.liRef)
                                if dialog.event
                                    EventInfo(dialog=dialog)
                                else
                                    .dialog.dialog-right.flex-center
                                        div #{dialog.text}
                                        if dialog.file
                                            img.size-limited.pa-1(src=dialog.file alt="")
                                    .avatar.flex-column
                                        img(src=dialog.avatar alt="")
                                        .text-light.text-small #{dialog.username}
                        else
                            li(key=index ref=this.liRef)
                                if dialog.event
                                    EventInfo(dialog=dialog)
                                else
                                    .avatar.flex-column
                                        img(src=dialog.avatar alt="")
                                        .text-light.text-small #{dialog.username}
                                    .dialog.flex-center
                                        div #{dialog.text}
                                        if dialog.file
                                            img.size-limited.pa-1(src=dialog.file alt="")
                .bottom
                    input(type="file" ref=this.fileRef onChange=e=>this.handleFile(e) accept="image/*")
                    i.material-icons(onClick=e=>this.handleFile(e)) sentiment_satisfied_alt
                    i.material-icons(onClick=e=>this.fileRef.current.click()) insert_photo
                    i.material-icons(onClick=e=>this.toggleFinder()) attach_file
                    .divider
                    if this.state.imgSrc
                        img.size-limited(src=this.state.imgSrc alt="")
                    input#text(type="text" onChange=e=>this.setState({text:e.target.value})
                        value=this.state.text
                        onKeyUp=e=>this.handleKeyUp(e)
                    )
                    i#send.material-icons(onClick=e=>this.sendMsg()) send
                if this.state.oooDialog
                    #dialog.bg-secondary.flex-column
                        .text-light.d-flex
                            h4 確定要跟&nbsp;
                            h3 #{this.state.oooName}
                            h4 &nbsp;開啟一對一聊天？
                        img(src=this.state.oooName alt="")
                        div
                            button.btn.btn-chip.active.ma-3 進入聊天
                            button.btn.btn-chip.bg-primary.ma-3(onClick=this.setState({oooDialog:false})) 按錯離開
        `
    }
}
// var obj = [...document.querySelectorAll('td.chars')].map(td=>td.textContent)
// var text = JSON.stringify(obj)
// var a = document.createElement('a')
// a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
// a.download = 'emoji.json'
// a.click()
