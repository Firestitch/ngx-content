import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';

import { tap } from 'rxjs/operators';

import { PageTypes } from '../../../../consts';
import { FS_CONTENT_CONFIG } from '../../../../injectors';
import { FsContentConfig, FsContentLayout, FsContentPage } from '../../../../interfaces';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { FsDialogModule } from '@firestitch/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';


@Component({
    templateUrl: './content-page.component.html',
    styleUrls: ['./content-page.component.scss'],
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
        MatSelect,
        MatOption,
        MatInput,
        MatDialogActions,
    ],
})
export class ContentPageComponent implements OnInit {

  public contentPage = signal<FsContentPage>(null);
  public contentLayouts = signal<FsContentLayout[]>(null);
  public PageTypes = PageTypes;

  private _config = inject<FsContentConfig>(FS_CONTENT_CONFIG);
  private _data = inject(MAT_DIALOG_DATA);
  private _dialogRef = inject<MatDialogRef<ContentPageComponent>>(MatDialogRef);
  private _message = inject(FsMessage);
  private _destroyRef = inject(DestroyRef);

  constructor() {
    this._init();
  }

  public ngOnInit(): void {
    this._dialogRef.updateSize('600px');
  }

  public save = () => {
    // Only the fields this dialog edits. Sending the whole page re-sent the Page Editor's copy
    // of content, styles and js, which the server wrote over edits saved since (IEB-T292).
    const { id, type, contentLayoutId, name, path, title } = this.contentPage();

    return this._config.saveContentPage({ id, type, contentLayoutId, name, path, title })
      .pipe(
        tap((contentPage) => {
          this._message.success('Saved Changes');
          this._dialogRef.close(contentPage);
        }),
      );
  };

  private _init(): void {
    this.contentPage.set({
      ...this._data.contentPage,
      path: this._data.contentPage.path || '/',
    });

    this._config.loadContentLayouts()
      .pipe(
        // The config answers with the { contentLayouts, paging } envelope
        // (FsContentConfig.loadContentLayouts), so the select takes its array, not the
        // envelope, which rendered no options at all (IEB-T294).
        tap((response) => this.contentLayouts.set(response.contentLayouts)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

}
