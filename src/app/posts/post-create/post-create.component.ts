import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../post.service';
import { mimeTypeValidator } from './mime-type.validator';


@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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

  mode = 'create';
  private postId: string | null = null;
  isLoading = this.postService.isLoading;
  imagePreview: string | null = null;

  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    content: new FormControl('', [Validators.required, Validators.minLength(5)]),
    image: new FormControl<File | null>(null, {
      validators: [Validators.required],
      asyncValidators: [mimeTypeValidator(['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp'])],
    }),
  });

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId!).subscribe((response) => {
          this.form.patchValue({
            title: response.post.title,
            content: response.post.content,
            image: response.post.imagePath as any,
          });
          this.imagePreview = response.post.imagePath ?? null;
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    const { title, content, image } = this.form.value;
    if (this.mode === 'create') {
      this.postService.addPost(title!, content!, image!);
    } else {
      this.postService.updatePost(this.postId!, title!, content!, image as any);
    }
    this.form.reset();
  }
}
