import { Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
  imports: [MatExpansionModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatPaginatorModule, CommonModule],
})
export class PostListComponent implements OnInit {
  private postService = inject(PostService);
  private router = inject(Router);
  posts = this.postService.posts;
  isLoading = this.postService.isLoading;
  totalPosts = this.postService.totalPosts;

  currentPage = 1;
  pageSizeOptions = [2, 5, 10, 25];
  pageSize = 2;

  ngOnInit() {
    this.postService.getPosts(this.pageSize, this.currentPage);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.postService.getPosts(this.pageSize, this.currentPage);
  }

  onEdit(postId: string) {
    this.router.navigate(['/edit', postId]);
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId, this.pageSize, this.currentPage);
  }
}
