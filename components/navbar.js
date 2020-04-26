import React from 'react'
import Link from 'next/link'

export default class Navbar extends React.Component{
    constructor(props){
        super(props) 
    }
    render(){
        return pug`
            .navbar
                .navbar-container
                    a.navbar-brand Chatroom
                    input.navbar-toggler(type="checkbox")
                    .hamburger
                        div
                    ul.navbar-menu
                        li
                            a #{this.props.username}
                        li
                            Link(href=this.props.href)
                                a 換個角色
                        li
                            a 大廳模式
                        li
                            a 系統配對
                        li
                            a 創建
        `
    }
}