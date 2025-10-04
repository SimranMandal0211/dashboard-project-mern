import React, { useEffect, useState, useContext} from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../AuthContext';

export default function Dashboard(){
    const [message, setMessage] = useState();
    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        api.get('/user/dashboard')
            .then(res => setMessage(res.data.message || 'Welcome to your dashboard!'))
            .catch(err => setMessage(err.response?.data?.message || 'Unauthorized'));
    }, []);

     // Fetch posts
    useEffect(() => {
      fetchPosts();
    }, []);

    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts');
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
      return (
          <div className="container mt-5">
            <h2>Dashboard</h2>
            <p>{message}</p>

            {user && (
              <div className="mb-4">
                <h5>Logged in as: {user.name}</h5>
                <p>Email: {user.email}</p>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center my-3">
              <h4>Your Posts</h4>
              <Link to="/create-post" className="btn btn-primary">+ New Post</Link>
            </div>

            {posts.length === 0 ? (
              <p>No posts yet.</p>
            ) : (
              <ul className="list-group">
                {posts.map(post => (
                  <li key={post._id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{post.title}</span>
                    <div>
                      <Link to={`/edit-post/${post._id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
      );
}