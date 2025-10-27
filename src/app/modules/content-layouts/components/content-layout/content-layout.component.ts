import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';
import { FsTextEditorComponent } from '@firestitch/text-editor';

import { Subject, of } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

import { FS_CONTENT_CONFIG } from '../../../../injectors';
import { FsContentConfig } from '../../../../interfaces';
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
export class ContentLayoutComponent implements OnInit, OnDestroy {

  @ViewChildren(FsTextEditorComponent)
  public textEditors: QueryList<FsTextEditorComponent>;

  public contentLayout = null;
  public editors = { content: true, styles: true };

  private _destroy$ = new Subject<void>();

  constructor(    
    @Inject(FS_CONTENT_CONFIG) private _config: FsContentConfig,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<ContentLayoutComponent>,
    private _message: FsMessage,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this._fetchData();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public save = () => {
    return this._config.saveContentLayout(this.contentLayout)
      .pipe(
        tap((contentLayout) => {
          this._message.success('Saved Changes');
          this._dialogRef.close(contentLayout);
        }),
      );
  };

  private _fetchData(): void {
    of(this._data.contentLayout)
      .pipe(
        switchMap((contentLayout) => {
          return of(contentLayout);
        }),
        takeUntil(this._destroy$),
      )
      .subscribe((contentLayout) => {
        this.contentLayout = { ...contentLayout };

        this._cdRef.markForCheck();
      });
  }

}
