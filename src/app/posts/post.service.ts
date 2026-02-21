import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);
  private _posts = signal<Post[]>([]);
  readonly posts = this._posts.asReadonly();

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>("http://localhost:3000/api/posts").subscribe((postData) => {
      this._posts.set(postData.posts);
    });
  }

  addPost(post: Post) {
    this.http.post<{message: string, post: Post}>("http://localhost:3000/api/posts", post).subscribe((responseData) => {
      console.log(responseData.message);
      this._posts.update(posts => [...posts, responseData.post]);
    });
  }

  deletePost(postId: string) {
    this.http.delete<{ message: string }>("http://localhost:3000/api/posts/" + postId).subscribe((response) => {
      console.log(response.message);
      this._posts.update(posts => posts.filter(post => post._id !== postId));
    });
  }
}
