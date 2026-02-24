import { Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
  imports: [MatExpansionModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, CommonModule],
})
export class PostListComponent implements OnInit {
  private postService = inject(PostService);
  private router = inject(Router);
  posts = this.postService.posts;
  isLoading = this.postService.isLoading;

  ngOnInit() {
    this.postService.getPosts();
  }

  onEdit(postId: string) {
    this.router.navigate(['/edit', postId]);
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }
}
