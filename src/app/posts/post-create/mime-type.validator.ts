import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export function mimeTypeValidator(allowedTypes: string[]): AsyncValidatorFn {
  return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {

    if (!(control.value instanceof File)) {
      return of(null);
    }

    const file = control.value as File;

    return new Observable((observer: Observer<{ [key: string]: any } | null>) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const arr = new Uint8Array(reader.result as ArrayBuffer).subarray(0, 12);

        let header = '';
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16).padStart(2, '0');
        }

        let detectedType = 'unknown';

        if (header.startsWith('89504e47')) {
          detectedType = 'image/png';

        } else if (header.startsWith('ffd8ff')) {
          detectedType = 'image/jpeg';

        } else if (header.startsWith('47494638')) {
          detectedType = 'image/gif';

        } else if (header.startsWith('424d')) {
          detectedType = 'image/bmp';

        } else if (header.startsWith('52494646') && header.slice(16, 24) === '57454250') {
          detectedType = 'image/webp';
        }

        if (allowedTypes.includes(detectedType)) {
          observer.next(null);
        } else {
          observer.next({ invalidMimeType: true });
        }
        observer.complete();
      };

      reader.readAsArrayBuffer(file.slice(0, 12));
    });
  };
}
