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

import { PageTypes } from '../../../../consts';
import { FS_CONTENT_CONFIG } from '../../../../injectors';
import { FsContentConfig } from '../../../../interfaces';
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
export class ContentPageComponent implements OnInit, OnDestroy {

  @ViewChildren(FsTextEditorComponent)
  public textEditors: QueryList<FsTextEditorComponent>;

  public contentPage = null;
  public PageTypes = PageTypes;
  public contentLayouts;
  public editors = { content: true, styles: true };

  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(FS_CONTENT_CONFIG) private _config: FsContentConfig,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<ContentPageComponent>,
    private _message: FsMessage,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this._dialogRef.updateSize('600px');
    this._fetchData();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public save = () => {
    return this._config.saveContentPage(this.contentPage)
      .pipe(
        tap((contentPage) => {
          this._message.success('Saved Changes');
          this._dialogRef.close(contentPage);
        }),
      );
  };

  private _fetchData(): void {
    this._config.loadContentLayouts()
      .subscribe((contentLayouts) => {
        this.contentLayouts = contentLayouts;
        this._cdRef.markForCheck();
      });

    of(this._data.contentPage)
      .pipe(
        switchMap((contentPage) => {
          return of(contentPage);
        }),
        takeUntil(this._destroy$),
      )
      .subscribe((contentPage) => {
        this.contentPage = {
          ...contentPage,
          path: contentPage.path || '/',
        };

        this._cdRef.markForCheck();
      });
  }

}
