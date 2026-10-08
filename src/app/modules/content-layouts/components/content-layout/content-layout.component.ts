import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';

import { tap } from 'rxjs/operators';

import { FS_CONTENT_CONFIG } from '../../../../injectors';
import { FsContentConfig, FsContentLayout } from '../../../../interfaces';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { FsDialogModule } from '@firestitch/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';


@Component({
    templateUrl: './content-layout.component.html',
    styleUrls: ['./content-layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsSkeletonModule,
        FormsModule,
        FsFormModule,
        FsDialogModule,
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        MatFormField,
        MatLabel,
        MatInput,
        MatDialogActions,
    ],
})
export class ContentLayoutComponent {

  public contentLayout = signal<FsContentLayout>(null);

  private _config = inject<FsContentConfig>(FS_CONTENT_CONFIG);
  private _data = inject(MAT_DIALOG_DATA);
  private _dialogRef = inject<MatDialogRef<ContentLayoutComponent>>(MatDialogRef);
  private _message = inject(FsMessage);

  constructor() {
    this._init();
  }

  public save = () => {
    // Only the fields this dialog edits. Sending the whole layout re-sent the Layout Editor's
    // copy of content and styles, which the server wrote over edits saved since (IEB-T292).
    const { id, name, tag } = this.contentLayout();

    return this._config.saveContentLayout({ id, name, tag })
      .pipe(
        tap((contentLayout) => {
          this._message.success('Saved Changes');
          this._dialogRef.close(contentLayout);
        }),
      );
  };

  private _init(): void {
    this.contentLayout.set({ ...this._data.contentLayout });
  }

}
