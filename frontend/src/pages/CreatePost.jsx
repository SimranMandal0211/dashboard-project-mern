import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreatePost(){
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            const token = localStorage.getItem("token");
            await axios.post(
                `${process.env.REACT_APP_URL}/posts`,
                { title, content },
                {headers: { Authorization: `Bearer ${token}`}}
            );
            navigate("/dashboard");
        }catch(err){
            console.error(err);
        }
    }


    return (
        <div className="container mt-5">
            <h2>Create Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                </div>

                <div className="mb-3">
                <label className="form-label">Content</label>
                <textarea
                    className="form-control"
                    rows="4"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                </div>

                <button type="submit" className="btn btn-success">Save</button>
            </form>
        </div>
    )
}