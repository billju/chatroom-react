import Head from 'next/head'
import Finder from '../components/finder'

export default props=>pug`
    .container
        Head
            link(rel="stylesheet" href="/css/lobby.css")
            link(rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons")
        Finder(dialogs=[{text:'bangbangbang'}])
`