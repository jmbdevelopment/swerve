import React, { useState, useReducer, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useImmerReducer } from 'use-immer'

import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Axios from 'axios'
Axios.defaults.baseURL = 'http://localhost:8080'

import StateContext from './StateContext'
import DispatchContext from './DispatchContext'

// Components
import Header from './components/Header'
import HomeGuest from './components/HomeGuest'
import Home from './components/Home'
import Footer from './components//Footer'
import About from './components/About'
import Terms from './components/Terms'
import CreatePost from './components/CreatePost'
import ViewSinglePost from './components/ViewSinglePost'
import FlashMessages from './components/FlashMessages'

function Main() {
    const initialState = {
        loggedIn: Boolean(localStorage.getItem('swerveappToken')),
        flashMessages: [],
        user: {
            token: localStorage.getItem('swerveappToken'),
            username: localStorage.getItem('swerveappUsername'),
            avatar: localStorage.getItem('swerveappAvatar')
        }
    }

    function ourReducer(draft, action) {
        switch(action.type) {
            case "login":
                draft.loggedIn = true
                draft.user = action.data
                return
            case "logout":
                draft.loggedIn = false
                return
            case "flashMessage":
                draft.flashMessages.push(action.value)
                return
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, initialState)

    useEffect(() => {
        if(state.loggedIn) {
            localStorage.setItem('swerveappToken', state.user.token)
            localStorage.setItem('swerveappUsername', state.user.username)
            localStorage.setItem('swerveappAvatar', state.user.avatar)
        } else {
            localStorage.removeItem('swerveappToken')
            localStorage.removeItem('swerveappUsername')
            localStorage.removeItem('swerveappAvatar')
        }
    }, [state.loggedIn])

    function addFlashMessage(msg) {
        setFlashMessages(prev => prev.concat(msg))
    }

    return (
        <StateContext.Provider value={ state }>
            <DispatchContext.Provider value={ dispatch }>
                <BrowserRouter>
                    <FlashMessages messages={state.flashMessages} />
                    <Header />
                    <Switch>
                        <Route path='/' exact>
                            {state.loggedIn ? <Home /> : <HomeGuest />}
                        </Route>
                        <Route path='/post/:id'>
                            <ViewSinglePost />
                        </Route>
                        <Route path='/create-post'>
                            <CreatePost addFlashMessage={addFlashMessage} />
                        </Route>
                        <Route path='/about-us'>
                            <About />
                        </Route>
                        <Route path='/terms'>
                            <Terms />
                        </Route>
                    </Switch>
                    <Footer />
                </BrowserRouter>
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

ReactDOM.render(<Main />, document.querySelector('#app'))

if(module.hot) {
    module.hot.accept()
}