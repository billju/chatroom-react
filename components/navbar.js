import React from 'react'
import Link from 'next/link'

export default class Navbar extends React.Component{
    constructor(props){
        super(props) 
    }
    render(){
        return (
            <nav className="navbar">
                <div className="navbar-container">
                    <a className="navbar-brand">Chatroom</a>
                    <input className="navbar-toggler" type="checkbox"/>
                    <div className="hamburger">
                        <div></div>
                    </div>
                    <ul className="navbar-menu">
                        <li><a>{this.props.username}</a></li>
                        <li><Link href={this.props.href}><a>換個角色</a></Link></li>
                        <li><a>大廳模式</a></li>
                        <li><a>系統配對</a></li>
                        <li><a>創建</a></li>
                    </ul>
                </div>
            </nav>
        )
    }
}