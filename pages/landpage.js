import React from 'react'
import Head from 'next/head'

export default class Landpage extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            radio: 'dog',
            imageList: {
                cats: [
                    '/large/貓貓1.png',
                    '/large/貓貓2.png',
                    '/large/貓貓3.png',
                    '/large/貓貓4.png',
                ],
                dogs: [
                    '/large/狗狗1.png',
                    '/large/狗狗2.png',
                    '/large/狗狗3.png',
                    '/large/狗狗4.png',
                ],
            },
            imageBtns: [],
            selected: '/large/狗狗1.png',
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
        if(this.state.username){
            localStorage.setItem('chatroom-username',this.state.username)
            let a = document.createElement('a')
            a.href = '/lobby'
            document.body.appendChild(a)
            a.click()
        }else{
            this.setState({username:'我是訪客'})
        }
    }
    componentDidMount(){
        this.setState({imageBtns: this.state.imageList['dogs']})
    }
    render(){
        const imageBtns = this.state.imageBtns.map(image=>
            <div key={image} className="btn btn-round ma-3" onClick={e=>{this.setAvatar(image)}}>
                <img src={image} alt=""/>
            </div>
        )
        return(
            <div className="container flex-center">
                <Head>
                    <link rel="icon" href="/favicon.ico"/>
                    <link rel="stylesheet" href="/css/landpage.css"/>
                    <meta name="description" content="chatroom"/>
                    <title>Landing Page</title>
                </Head>
                <div className="card bg-primary flex-around">
                    <div className="flex-column">
                        <div className="btn btn-round ma-3" onClick={e=>{this.setImages('dogs')}}>狗狗</div>
                        <div className="btn btn-round ma-3" onClick={e=>{this.setImages('cats')}}>貓貓</div>
                    </div>
                    <div className="flex-column">
                        <h1 className="text-light">WELCOME</h1>
                        <h3 className="text-light">阿貓阿狗聊天室</h3>
                        <img className="ma-3" src={this.state.selected} alt=""/>
                        <input type="text" className="text-input ma-3" placeholder="你的名字" onInput={e=>this.setState({username:e.target.value})}/>
                        <button className="btn btn-chip ma-3" onClick={()=>{this.gotoLobby()}}>進入聊天</button>
                    </div>
                    <div className="flex-column">
                        {imageBtns}
                    </div>
                </div>
            </div>
        );
    }
}

