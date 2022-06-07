import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';
import { FsTextEditorComponent } from '@firestitch/text-editor';

import { Subject, of } from 'rxjs';
import { switchMap, tap, takeUntil } from 'rxjs/operators';

import { PageTypes } from '../../../../consts';
import { FsContentConfig } from '../../../../interfaces';
import { FS_CONTENT_CONFIG } from '../../../../injectors';


@Component({
  templateUrl: './content-page.component.html',
  styleUrls: ['./content-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    this._fetchData();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
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
        };

        this._cdRef.markForCheck();
      });
  }

}
