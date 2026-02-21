import { Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
  imports: [MatExpansionModule, MatButtonModule, MatIconModule, CommonModule],
})
export class PostListComponent implements OnInit {
  private postService = inject(PostService);
  posts = this.postService.posts;

  ngOnInit() {
    this.postService.getPosts();
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }
}
