import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ErrorComponent {
  data = inject(MAT_DIALOG_DATA) as { message: string };
}
