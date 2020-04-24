import Head from 'next/head'
import React from 'react'
import Emoji from '../components/emoji'
import Navbar from '../components/navbar'
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
            file: null,
            text: '',
            username: '',
            avatar: '',
            oooDialog: false, //one on one dialog
            oooName: '',
            scrollToBottom: false
        }
        this.socket = io()
        this.fileRef = React.createRef()
    }
    sendMsg(event){
        let username = this.state.username,
            avatar = this.state.avatar,
            text = this.state.text,
            file = this.state.file,
            date = new Date().toString()
        if(this.state.text!=''||this.state.file!=null){
            let newChat = {username,avatar,text,file,date,event}
            this.setState(state=>{
                let dialogs = state.dialogs
                dialogs.push(newChat)
                return {
                    username,
                    dialogs,
                    text: '',
                    file: null,
                    scrollToBottom: true
                }
            })
            localStorage.setItem('chatroom-username', username)
            this.socket.emit('chat', newChat)
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
            }
            reader.readAsDataURL(file)
        }else if(this.state.file){

        }
    }
    handleKeyup(event){
        if(event.key=='enter'){
            this.sendMsg()
        }
    }
    componentDidUpdate(){

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
            if(msg.name!=this.state.name){
                this.scrollToBottom = true
                this.setState(state=>({dialogs:[...state.dialogs,msg]}))
            }
        })
        this.socket.on('loadMsg', rows=>{
            this.setState({dialogs:rows})
        })
    }
    render(){
        let oneOnOneDialog = (
            <div id="dialog" className="bg-secondary flex-column">
                <div className="text-light d-flex">
                    <h4>確定要跟&nbsp;</h4>
                    <h3>{this.state.oooName}</h3>
                    <h4>&nbsp;開啟一對一聊天？</h4>
                </div>
                <img src={this.state.oooName} alt=""/>
                <div>
                    <button className="btn btn-chip active ma-3">進入聊天</button>
                    <button className="btn btn-chip bg-primary ma-3" onClick={e=>{ this.setState({oooDialog:false}) }}>按錯離開</button>
                </div>
            </div>
        )
        return pug`
            .container
                Head
                    link(rel="icon" href="/favicon.ico")
                    link(rel="stylesheet" href="/css/lobby.css")
                    link(rel="stylesheet" href="/css/navbar.css")
                    link(rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons")
                    meta(name="description" content="chatroom")
                    title Lobby
                ul.list
                    each dialog, index in this.state.dialogs
                        if dialog.username==this.state.username
                            li.flex-end(key=index)
                                if dialog.event
                                    EventInfo(dialog=dialog)
                                else
                                    .dialog.dialog-right.flex-center
                                        div #{dialog.text}
                                        if dialog.file
                                            img.pa-3(src=dialog.file alt="")
                                    .avatar.flex-column
                                        img(src=dialog.avatar alt="")
                                        .text-light.text-small #{dialog.username}
                        else
                            li(key=index)
                                if dialog.event
                                    EventInfo(dialog=dialog)
                                else
                                    .avatar.flex-column
                                        img(src=dialog.avatar alt="")
                                        .text-light.text-small #{dialog.username}
                                    .dialog.dialog-right.flex-center
                                        div #{dialog.text}
                                        if dialog.file
                                            img.pa-3(src=dialog.file alt="")
                .bottom
                    input(type="file" ref=this.fileRef onChange=e=>this.handleFile(e) accept="image/*")
                    i.material-icons(onClick=e=>this.handleFile(e)) sentiment_satisfied_alt
                    i.material-icons(onClick=e=>this.handleFile(e)) insert_photo
                    i.material-icons(onClick=e=>this.handleFile(e)) attach_file
                    .divider
                    input#text(type="text" onChange=e=>this.setState({text:e.target.value}) value=this.state.text)
                    i#send.material-icons(onClick=e=>this.sendMsg()) send
                Navbar(username=this.state.username href="/landpage")
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
