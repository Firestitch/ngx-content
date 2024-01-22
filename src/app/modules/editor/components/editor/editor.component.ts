import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';
import { FsTextEditorConfig } from '@firestitch/text-editor';


import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { FsContentConfig } from '../../../../interfaces';


@Component({
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements OnInit, OnDestroy {

  public contentPage: {
    id?: number;
    styles?: string;
    content?: string;
    name?: string;
    js?: string;
  };

  public contentStyle: {
    scss?: string;
  };

  public resizing = false;
  public title;
  public editors = {
    html: true,
    scss: true,
    js: false,
    globalScss: false,
  };

  public scssConfig: FsTextEditorConfig;
  public globalScssConfig: FsTextEditorConfig;
  public htmlConfig: FsTextEditorConfig;
  public jsConfig: FsTextEditorConfig;

  private _config: FsContentConfig;
  private _destroy$ = new Subject<void>();
  private _save: (data) => Observable<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: {
      contentPage: any;
      title: string;
      save: (data) => Observable<any>;
      openSettings: (data) => Observable<any>;
      contentConfig: FsContentConfig;
    },
    private _dialogRef: MatDialogRef<EditorComponent>,
    private _message: FsMessage,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this._dialogRef.addPanelClass('fs-content-editor-overlay-pane');
    this.title = this._data.title;
    this.contentPage = this._data.contentPage;
    this._config = this._data.contentConfig;
    this._save = this._data.save;
    this.initTextEditors();
    this.initGlobalContentStyle();
  }

  public editorToggleChange(event: MatButtonToggleChange): void {
    this.editors[event.value] = !this.editors[event.value];
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public globalScssChange() {
    this._config.saveContentStyle(this.contentStyle)
      .subscribe((contentStyle) => {
        this.contentStyle = contentStyle;
        this._message.success('Saved Changes');
        this._cdRef.markForCheck();
      });
  }

  public initTextEditors() {
    this.scssConfig = {
      tabSize: 2,
      language: 'scss',
      height: '100%',
    };
    this.jsConfig = {
      tabSize: 2,
      language: 'js',
      height: '100%',
    };
    this.htmlConfig = {
      tabSize: 2,
      language: 'html',
      height: '100%',
    };
    this.globalScssConfig = {
      tabSize: 2,
      language: 'scss',
      height: '100%',
    };
  }

  public initGlobalContentStyle() {
    this._config.loadContentStyle()
      .subscribe((contentStyle) => {
        this.contentStyle = contentStyle;
        this._cdRef.markForCheck();
      });
  }

  public saveContentPage() {
    this._save({
      id: this.contentPage.id,
      styles: this.contentPage.styles,
      content: this.contentPage.content,
      js: this.contentPage.js,
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
    this._data.openSettings(this.contentPage)
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
