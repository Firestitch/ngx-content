import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';


import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { FsContentConfig, FsContentPage } from '../../../../interfaces';
import { ContentPageComponent } from '../content-page/content-page.component';


@Component({
  templateUrl: './content-page-editor.component.html',
  styleUrls: ['./content-page-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageEditorComponent implements OnInit, OnDestroy {

  public contentPage: {
    id?: number;
    styles?: string;
    content?: string;
    name?: string;
    js?: string;
  };

  public config: FsContentConfig;
  public resizing = false;
  public title;
  public editors = {
    html: true,
    scss: true,
    js: false,
    globalScss: false,
  };

  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: {
      contentPage: any;
      contentConfig: FsContentConfig;
    },
    private _dialogRef: MatDialogRef<ContentPageEditorComponent>,
    private _message: FsMessage,
    private _dialog: MatDialog,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this._dialogRef.addPanelClass('fs-content-editor-overlay-pane');
    this.config = this._data.contentConfig;
    this._initContentPage(this._data.contentPage);
  }

  public editorToggleChange(event: MatButtonToggleChange): void {
    this.editors[event.value] = !this.editors[event.value];
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public _initContentPage(contentPage) {
    this.config.loadContentPage(contentPage.id)
      .subscribe((data) => {
        this.contentPage = data;
        this._cdRef.markForCheck();
      });
  }

  public editorChanged(event) {
    const data: FsContentPage = {};

    if(event.type === 'js') {
      data.js = event.value;
    }

    if(event.type === 'html') {
      data.content = event.value;
    }

    if(event.type === 'scss') {
      data.styles = event.value;
    }

    this.saveContentPage(data);
  }

  public saveContentPage(data) {
    this.config.saveContentPage({
      id: this.contentPage.id,
      ...data,
    })
      .pipe(
        tap((contentPage) => {
          this.contentPage = {
            ...this.contentPage,
            ...contentPage,
          };
          this._cdRef.markForCheck();
          this._message.success('Saved Changes');
        }),
      )
      .subscribe();
  }

  public openSettings(): void {
    this._dialog.open(ContentPageComponent, {
      data: {
        contentPage: this.contentPage,
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((contentPage) => {
        this.contentPage = {
          ...this.contentPage,
          ...contentPage,
        };
        this._cdRef.markForCheck();
      });
  }

}
