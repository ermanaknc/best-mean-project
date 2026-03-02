import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { finalize } from 'rxjs';
import { Post } from './post.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);
  private _posts = signal<Post[]>([]);
  readonly posts = this._posts.asReadonly();

  private router = inject(Router);

  private _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  private _totalPosts = signal<number>(0);
  readonly totalPosts = this._totalPosts.asReadonly();

  private apiUrl = `${environment.apiUrl}/api/posts`;

  getPosts(pageSize: number, currentPage: number) {
    const params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('currentPage', currentPage.toString());

    this._isLoading.set(true);
    this.http.get<{message: string, posts: Post[], totalPosts: number}>(
      this.apiUrl,
      { params }
    ).pipe(
      finalize(() => this._isLoading.set(false))
    ).subscribe({
      next: (postData) => {
        this._posts.set(postData.posts);
        this._totalPosts.set(postData.totalPosts);
      },
    });
  }

  getPost(id: string) {
    this._isLoading.set(true);
    return this.http.get<{ post: Post }>(`${this.apiUrl}/${id}`).pipe(
      finalize(() => this._isLoading.set(false))
    );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, image.name);

    this._isLoading.set(true);
    this.http.post<{message: string, post: Post}>(this.apiUrl, postData).pipe(
      finalize(() => this._isLoading.set(false))
    ).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, image.name);
    } else {
      postData = { _id: id, title, content, imagePath: image };
    }

    this._isLoading.set(true);
    this.http.put<{ message: string, post: Post }>(`${this.apiUrl}/${id}`, postData).pipe(
      finalize(() => this._isLoading.set(false))
    ).subscribe({
      next: () => {
        this._posts.update(posts => posts.map(p => p._id === id ? { ...p, title, content } : p));
        this.router.navigate(['/']);
      },
    });
  }

  deletePost(postId: string, pageSize: number, currentPage: number) {
    this._isLoading.set(true);
    this.http.delete<{ message: string }>(`${this.apiUrl}/${postId}`).pipe(
      finalize(() => this._isLoading.set(false))
    ).subscribe({
      next: () => {
        this.getPosts(pageSize, currentPage);
      },
    });
  }
}
