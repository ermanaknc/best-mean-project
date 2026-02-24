import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  private postService = inject(PostService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  mode = 'create';
  private postId: string | null = null;
  post: Post = { title: '', content: '' };
  isLoading = this.postService.isLoading;

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId!).subscribe((response) => {
          this.post = { ...response.post };
          this.cdr.markForCheck();
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postService.addPost({
        title: form.value.title,
        content: form.value.content,
      });
    } else {
      this.postService.updatePost({
        _id: this.postId!,
        title: form.value.title,
        content: form.value.content,
      });
    }
    form.resetForm();
  }
}
