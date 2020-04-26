import React from 'react'


export default class Finder extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            text: '',
            matches: [],
        }
    }
    handleChange(e){
        let text = e.target.value
        let matches = (!this.props.dialogs||text=='')?[]:
            this.props.dialogs.filter(dialog=>{
                let matches = Array.from(dialog.text.matchAll(text))
                if(matches.length){
                    dialog.matches = []
                    let idx = 0
                    for(let match of matches){
                        dialog.matches.push({
                            marked: false,
                            text: dialog.text.slice(idx,match.index)
                        })
                        idx = match.index+match.length
                        dialog.matches.push({
                            marked: true,
                            text: dialog.text.slice(match.index,idx)
                        })
                    }
                    if(idx<dialog.text.length){
                        dialog.matches.push({
                            marked: false,
                            text: dialog.text.slice(idx)
                        })
                    }
                    return true
                }else{
                    return false
                }
            }) 
        this.setState({text,matches})
    }
    render(){
        return pug`
            div
                .d-flex.align-items-center.bg-primary.pa-1
                    .btn.mt-1.mx-1
                        i.material-icons list
                    input.text-input(type="text" style={flex:1} placeholder="搜尋訊息"
                        onChange=e=>this.handleChange(e) value=this.state.text)
                    .btn.mt-1.mx-1
                        i.material-icons keyboard_arrow_down
                    .btn.mt-1.mx-1
                        i.material-icons keyboard_arrow_up
                    .btn.mt-1.mx-1
                        i.material-icons close
                ul
                    each dialog, index in this.state.matches
                        li(key=index)
                            each match in dialog.matches
                                if match.marked
                                    span.bg-primary #{match.text}
                                else
                                    span #{match.text}
        `
    }
}