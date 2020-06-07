import React from 'react'
import Head from 'next/head'

export default class Landpage extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            radio: 'dog',
            imageList: {
                cats: [
                    'large/貓貓1.png',
                    'large/貓貓2.png',
                    'large/貓貓3.png',
                    'large/貓貓4.png',
                ],
                dogs: [
                    'large/狗狗1.png',
                    'large/狗狗2.png',
                    'large/狗狗3.png',
                    'large/狗狗4.png',
                ],
            },
            imageBtns: [],
            selected: 'large/狗狗1.png',
            username: ''
        }
    }
    setImages(key){
        this.setState({imageBtns: this.state.imageList[key]})
    }
    setAvatar(src){
        this.setState({selected: src})
        let avatar = src.replace('large','small')
        window.localStorage.setItem('chatroom-avatar',avatar)
    }
    gotoLobby(){
        if(!this.state.username)
            this.setState({username:'我是訪客'})
        localStorage.setItem('chatroom-username',this.state.username)
        let a = document.createElement('a')
        a.href = '/lobby'
        document.body.appendChild(a)
        a.click()
    }
    componentDidMount(){
        this.setState({imageBtns: this.state.imageList['dogs']})
    }
    render(){
        return pug`
            .container.flex-center
                Head
                    link(rel="icon" href="favicon.ico")
                    link(rel="stylesheet" href="css/landpage.css")
                    meta(name="description" content="chatroom")
                    title Landing Page
                .card.bg-primary.flex-around
                    .flex-column
                        .btn.btn-round.ma-3(onClick=e=>{this.setImages('dogs')}) 狗狗
                        .btn.btn-round.ma-3(onClick=e=>{this.setImages('cats')}) 貓貓
                    .flex-column
                        h1.text-light WELCOME
                        h3.text-light 阿貓阿狗聊天室
                        img.ma-3(src=this.state.selected alt="")
                        input.text-input.ma-3(type="text" placeholder="你的名字" onInput=e=>this.setState({username:e.target.value}))
                        button.btn.btn-chip.ma-3(onClick=()=>{this.gotoLobby()}) 進入大廳
                    .flex-column
                        each image, index in this.state.imageBtns
                            .btn.btn-round.ma-3(key=image onClick=e=>{this.setAvatar(image)})
                                img(src=image alt="")
        `
    }
}

