import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';

/** In-memory database for demo; resets on server restart. */
export const db = {
  users: [
    {
      id: 'admin-1',
      name: 'Admin',
      email: 'admin@example.com',
      phone: '',
      passwordHash: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      suspended: false,
      createdAt: Date.now()
    }
  ],
  posts: [],
  comments: []
};

// Seed one post
db.posts.push({
  id: uuid(),
  authorId: 'admin-1',
  title: 'Welcome to Simple Blog',
  content: 'This is a demo post created by Admin. Register to write your own posts!',
  image: '',
  likes: [],
  dislikes: [],
  suspended: false,
  createdAt: Date.now()
});

export function createUser({ name, email, password }){
  const exists = db.users.find(u => u.email === email);
  if (exists) throw new Error('Email already in use');
  const user = {
    id: uuid(),
    name, email, phone: '',
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'user',
    suspended: false,
    createdAt: Date.now()
  };
  db.users.push(user);
  return user;
}

export function findUserByEmail(email){ return db.users.find(u => u.email === email); }
export function findUserById(id){ return db.users.find(u => u.id === id); }

export function listUsers(){ return db.users; }
export function updateUser(id, updates){
  const i = db.users.findIndex(u => u.id === id);
  if (i === -1) return null;
  db.users[i] = { ...db.users[i], ...updates };
  return db.users[i];
}

export function createPost({ authorId, title, content, image }){
  const post = {
    id: uuid(), authorId, title, content, image: image||'',
    likes: [], dislikes: [], suspended: false, createdAt: Date.now()
  };
  db.posts.unshift(post);
  return post;
}
export function getPost(id){ return db.posts.find(p => p.id === id); }
export function updatePost(id, updates){
  const i = db.posts.findIndex(p => p.id === id);
  if (i === -1) return null;
  db.posts[i] = { ...db.posts[i], ...updates };
  return db.posts[i];
}
export function deletePost(id){
  const i = db.posts.findIndex(p => p.id === id);
  if (i === -1) return false;
  db.posts.splice(i,1);
  db.comments = db.comments.filter(c => c.postId !== id);
  return true;
}
export function searchPosts(q){
  q = (q||'').toLowerCase();
  return db.posts.filter(p => !p.suspended && (p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)));
}

export function addComment({ postId, authorId, text }){
  const c = { id: uuid(), postId, authorId, text, createdAt: Date.now(), suspended: false };
  db.comments.push(c);
  return c;
}
export function listComments(postId){
  return db.comments.filter(c => c.postId === postId && !c.suspended);
}
export function deleteComment(id){
  const i = db.comments.findIndex(c => c.id === id);
  if (i === -1) return false;
  db.comments.splice(i,1); return true;
}

export function toggleReaction({ postId, userId, type }){
  const post = getPost(postId);
  if (!post) return null;
  const addTo = type === 'like' ? 'likes' : 'dislikes';
  const removeFrom = type === 'like' ? 'dislikes' : 'likes';
  post[removeFrom] = post[removeFrom].filter(id => id !== userId);
  if (post[addTo].includes(userId)) {
    post[addTo] = post[addTo].filter(id => id !== userId);
  } else {
    post[addTo].push(userId);
  }
  return post;
}
