import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, PostCreateComponent, PostListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
