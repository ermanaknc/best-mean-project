import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  private postService = inject(PostService);

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postService.addPost({
      title: form.value.title,
      content: form.value.content,
    });
    form.resetForm();
  }
}
