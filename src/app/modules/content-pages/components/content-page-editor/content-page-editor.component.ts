import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';
import { FsPrompt } from '@firestitch/prompt';

import { Subject, fromEvent, of, throwError } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { EditorType } from '../../../../enums';
import { FsContentConfig } from '../../../../interfaces';
import { EditorComponent } from '../../../editor/components/editor';
import { ContentPageComponent } from '../content-page/content-page.component';


@Component({
  templateUrl: './content-page-editor.component.html',
  styleUrls: ['./content-page-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageEditorComponent implements OnInit, OnDestroy {

  @ViewChild(EditorComponent)
  public editor: EditorComponent;

  public contentPage: {
    id?: number;
    styles?: string;
    content?: string;
    name?: string;
    js?: string;
  };
  public focused = null;
  public config: FsContentConfig;
  public resizing = false;
  public title;
  public editors = {
    [EditorType.Html]: true,
    [EditorType.Scss]: true,
    [EditorType.Js]: false,
    [EditorType.GlobalScss]: false,
  };

  public get isMac(): boolean {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }

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
    private _prompt: FsPrompt,
  ) { }

  public ngOnInit(): void {
    this._dialogRef.addPanelClass('fs-content-editor-overlay-pane');
    this._dialogRef.disableClose = true;
    this.config = this._data.contentConfig;
    this._initContentPage(this._data.contentPage);
    this._initEscape();
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

  public editorFocused(type) {
    this.focused = type;
  }

  public save = () => {
    return of(null)
      .pipe(
        filter(() => this.focused),
        switchMap(() => {
          switch (this.focused) {
            case EditorType.Js:
            case EditorType.Html:
            case EditorType.Scss:
              return this.saveContentPage();
            case EditorType.GlobalScss:
              return this.editor.saveGlobalScss();
          }

          return throwError('Invalid focus');
        }),
        tap(() => {
          this.editor.clearChange(this.focused);
          this._cdRef.markForCheck();
        }),
      );
  };

  public saveContentPage() {
    const names = {
      [EditorType.Js]: 'js',
      [EditorType.Scss]: 'styles',
      [EditorType.Html]: 'content',
    };

    const data = {
      id: this.contentPage.id,
      [names[this.focused]]: this.editor.changes[this.focused],
    };

    return this.config.saveContentPage({
      id: this.contentPage.id,
      ...data,
    })
      .pipe(
        tap(() => {
          this._message.success('Saved Changes');
        }),
      );
  }


  public close(): void {
    if (!this.editor.hasChanges) {
      return this._dialogRef.close();
    }

    this._prompt.confirm({
      dialogConfig: {
        width: null,
      },
      title: 'You have unsaved changes',
      template: 'What would you like to do with your changes?',
      buttons: [
        {
          label: 'Review Changes',
          value: 'review',
        },
        {
          label: 'Discard Changes',
          value: 'discard',
        },
      ],
    })
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((value) => {
        if (value === 'discard') {
          this._dialogRef.close();
        }
      });
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

  private _initEscape(): void {
    fromEvent(document, 'keydown')
      .pipe(
        filter((event: KeyboardEvent) => event.code === 'Escape'),
        takeUntil(this._destroy$),
      ).subscribe(() => {
        const dialogRef = this._dialog.openDialogs.reverse()[0];
        if (dialogRef?.componentInstance === this) {
          this.close();
        }
      });
  }

}
