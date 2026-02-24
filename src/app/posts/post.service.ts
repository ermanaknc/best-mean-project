import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);
  private _posts = signal<Post[]>([]);
  readonly posts = this._posts.asReadonly();
  
  private router = inject(Router);

  private _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  getPosts() {
    this._isLoading.set(true);
    this.http.get<{message: string, posts: Post[]}>("http://localhost:3000/api/posts").subscribe({
      next: (postData) => {
        this._posts.set(postData.posts);
      },
      complete: () => {
        this._isLoading.set(false);
      }
    });
  }

  getPost(id: string) {
    this._isLoading.set(true);
    return this.http.get<{ post: Post }>("http://localhost:3000/api/posts/" + id).pipe(
      finalize(() => this._isLoading.set(false))
    );
  }

  addPost(post: Post) {
    this._isLoading.set(true);
    this.http.post<{message: string, post: Post}>("http://localhost:3000/api/posts", post).subscribe({
      next: (responseData) => {
        console.log(responseData.message);
        this._posts.update(posts => [...posts, responseData.post]);
        this.router.navigate(['/']);
      },
      complete: () => {
        this._isLoading.set(false);
      }
    });
  }

  updatePost(post: Post) {
    this._isLoading.set(true);
    this.http.put<{ message: string }>("http://localhost:3000/api/posts/" + post._id, post).subscribe({
      next: (response) => {
        console.log(response.message);
        this._posts.update(posts => posts.map(p => p._id === post._id ? post : p));
        this.router.navigate(['/']);
      },
      complete: () => {
        this._isLoading.set(false);
      }
    });
  }

  deletePost(postId: string) {
    this._isLoading.set(true);
    this.http.delete<{ message: string }>("http://localhost:3000/api/posts/" + postId).subscribe({
      next: (response) => {
        console.log(response.message);
        this._posts.update(posts => posts.filter(post => post._id !== postId));
      },
      complete: () => {
        this._isLoading.set(false);
      }
    });
  }
}
