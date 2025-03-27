import React, { useState, useEffect } from 'react';
import ModalComments from './components/ModalComments';
import ModalUserInfo from './components/ModalUserInfo';

const App = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, postsRes, commentsRes] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/users'),
          fetch('https://jsonplaceholder.typicode.com/posts'),
          fetch('https://jsonplaceholder.typicode.com/comments'),
        ]);

        if (!usersRes.ok || !postsRes.ok || !commentsRes.ok) {
          throw new Error('Ошибка загрузки данных');
        }

        const [usersData, postsData, commentsData] = await Promise.all([
          usersRes.json(),
          postsRes.json(),
          commentsRes.json(),
        ]);

        setUsers(usersData);
        setPosts(postsData);
        setComments(commentsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleShowPostsByUser = (userId) => {
    setSelectedUserId(userId);
    window.scrollTo(0, 0);
  }

  const filteredPosts = selectedUserId
    ? posts.filter(post => post.userId === selectedUserId)
    : posts;

  const usersById = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});

  const postComments = comments.filter(
    comment => comment.postId === selectedPost?.id
  );

  if (loading) return <div className='loading'>Загрузка...</div>;
  if (error) return <div className='error'>Ошибка: {error}</div>;

  return (
    <div className="App">
      <div className="layout">
        <aside className="sidebar">
          <h2>Пользователи</h2>
          <ul className="user-list">
            <li>
              <button
                onClick={() => setSelectedUserId(null)}
                className={!selectedUserId ? 'active' : ''}
              >
                Все посты
              </button>
            </li>
            {users.map(user => (
              <li key={user.id}>
                <button
                  onClick={() => handleShowPostsByUser(user.id)}
                  className={selectedUserId === user.id ? 'active' : ''}
                >
                  {user.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="content">
          <h1 className="title">Посты <span>{selectedUserId ? usersById[selectedUserId]?.name : ''}</span></h1>
          <div className="posts">
            {filteredPosts.map(post => (
              <article key={post.id} className="post">
                <h3>{post.title}</h3>
                <p onClick={() => setSelectedUser(usersById[post.userId])} className="author">
                  Автор: {usersById[post.userId]?.name || 'Неизвестен'}
                </p>
                <p>{post.body}</p>
                <button
                  onClick={() => setSelectedPost(post)}
                  className="show-comments"
                >
                  Показать комментарии
                </button>
              </article>
            ))}
          </div>
        </main>
      </div>

      {selectedPost && (
        <ModalComments onClose={() => setSelectedPost(null)}>
          <div className="modal-content">
            <h2>{selectedPost.title}</h2>
            <p className="author">
              Автор: {usersById[selectedPost.userId]?.name || 'Неизвестен'}
            </p>
            <p>{selectedPost.body}</p>
            
            <div className="comments">
              <h3>Комментарии ({postComments.length})</h3>
              {postComments.map(comment => (
                <div key={comment.id} className="comment">
                  <h4>{comment.name}</h4>
                  <p>{comment.body}</p>
                  <p className="email">{comment.email}</p>
                </div>
              ))}
            </div>
          </div>
        </ModalComments>
      )}

      {selectedUser && (
        <ModalUserInfo onClose={() => setSelectedUser(null)}>
          <div className="modal-content user-info">
            <h2>{selectedUser.name}</h2>
            
            <div className="info-section">
              <h3>Контактная информация</h3>
              <p>👤 Логин: {selectedUser.username}</p>
              <p>📧 Email: <a href={`mailto:${selectedUser.email}`}>{selectedUser.email}</a></p>
              <p>📞 Телефон: {selectedUser.phone}</p>
              <p>🌐 Сайт: <a href={`http://${selectedUser.website}`} target="_blank" rel="noreferrer">{selectedUser.website}</a></p>
            </div>

            <div className="info-section">
              <h3>Адрес</h3>
              <p>📍 {selectedUser.address.street}, {selectedUser.address.suite}</p>
              <p>🏙️ {selectedUser.address.city}</p>
              <p>📮 {selectedUser.address.zipcode}</p>
              <p>🌎 {selectedUser.address.geo.lat}, {selectedUser.address.geo.lng}</p>
            </div>

            <div className="info-section">
              <h3>Компания</h3>
              <p>🏢 {selectedUser.company.name}</p>
              <p>💼 {selectedUser.company.catchPhrase}</p>
              <p>🎯 {selectedUser.company.bs}</p>
            </div>
          </div>
        </ModalUserInfo>
      )}
    </div>
  );
}

export default App