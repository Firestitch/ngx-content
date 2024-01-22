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

import { FsContentConfig, FsContentLayout } from '../../../../interfaces';
import { ContentLayoutComponent } from '../content-layout/content-layout.component';


@Component({
  templateUrl: './content-layout-editor.component.html',
  styleUrls: ['./content-layout-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentLayoutEditorComponent implements OnInit, OnDestroy {

  public contentLayout: {
    id?: number;
    styles?: string;
    content?: string;
    name?: string;
  };

  public config: FsContentConfig;
  public resizing = false;
  public title;
  public editors = {
    html: true,
    scss: true,
    globalScss: false,
  };

  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: {
      contentLayout: any;
      contentConfig: FsContentConfig;
    },
    private _dialogRef: MatDialogRef<ContentLayoutEditorComponent>,
    private _message: FsMessage,
    private _dialog: MatDialog,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this._dialogRef.addPanelClass('fs-content-editor-overlay-pane');
    this.config = this._data.contentConfig;
    this._initContentLayout(this._data.contentLayout);
  }

  public editorToggleChange(event: MatButtonToggleChange): void {
    this.editors[event.value] = !this.editors[event.value];
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public _initContentLayout(contentLayout) {
    this.config.loadContentLayout(contentLayout.id)
      .subscribe((data) => {
        this.contentLayout = data;
        this._cdRef.markForCheck();
      });
  }

  public editorChanged(event) {
    const data: FsContentLayout = {};

    if(event.type === 'html') {
      data.content = event.value;
    }

    if(event.type === 'scss') {
      data.styles = event.value;
    }

    this.saveContentLayout(data);
  }

  public saveContentLayout(data) {
    this.config.saveContentLayout({
      id: this.contentLayout.id,
      ...data,
    })
      .pipe(
        tap((contentLayout) => {
          this.contentLayout = {
            ...this.contentLayout,
            ...contentLayout,
          };
          this._cdRef.markForCheck();
          this._message.success('Saved Changes');
        }),
      )
      .subscribe();
  }

  public openSettings(): void {
    this._dialog.open(ContentLayoutComponent, {
      data: {
        contentLayout: this.contentLayout,
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((contentLayout) => {
        this.contentLayout = {
          ...this.contentLayout,
          ...contentLayout,
        };
        this._cdRef.markForCheck();
      });
  }

}
