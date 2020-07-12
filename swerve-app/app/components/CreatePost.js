import React, { useEffect, useState, useContext } from "react"
import Page from './Page'
import Axios from 'axios'
import { withRouter } from 'react-router-dom'
import ExampleContext from '../ExampleContext'

function CreatePost(props) {
    const [title, setTitle] = useState()
    const [body, setBody] = useState()
    const { addFlashMessage } = useContext(ExampleContext)

    async function handleSubmit(e) {
        e.preventDefault()
        console.log('New post has been created.')
        try {
            const response = await Axios.post('/create-post', {title, body, token: localStorage.getItem('swerveappToken')})
            // Redirect to new post URL
            addFlashMessage('Congrats, post successfully created!')
            props.history.push(`/post/${response.data}`)
        } catch(e) {
            console.log(e.response.data)
        }
    }
  return (
      <Page title='Create New Post'>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="post-title" className="text-muted mb-1">
                    <small>Title</small>
                </label>
                <input onChange={e => setTitle(e.target.value)} autoFocus={true} name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
            </div>

            <div className="form-group">
                <label htmlFor="post-body" className="text-muted mb-1 d-block">
                    <small>Body Content</small>
                </label>
                <textarea onChange={e => setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
            </div>

            <button type="submit" className="btn btn-primary">Save New Post</button>
        </form>
      </Page>
  )
}

export default withRouter(CreatePost)