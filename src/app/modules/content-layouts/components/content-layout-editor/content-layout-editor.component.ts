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

import { Subject, of, throwError } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { EditorType } from '../../../../enums';
import { FsContentConfig } from '../../../../interfaces';
import { EditorComponent } from '../../../editor/components/editor';
import { ContentLayoutComponent } from '../content-layout/content-layout.component';


@Component({
  templateUrl: './content-layout-editor.component.html',
  styleUrls: ['./content-layout-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentLayoutEditorComponent implements OnInit, OnDestroy {

  @ViewChild(EditorComponent)
  public editor: EditorComponent;

  public contentLayout: {
    id?: number;
    styles?: string;
    content?: string;
    name?: string;
  };

  public config: FsContentConfig;
  public EditorType = EditorType;
  public focused = null;
  public title;
  public editors = {
    [EditorType.Html]: true,
    [EditorType.Scss]: true,
    [EditorType.GlobalScss]: false,
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
    private _prompt: FsPrompt,
  ) {}

  public ngOnInit(): void {
    this._dialogRef.addPanelClass('fs-content-editor-overlay-pane');
    this._dialogRef.disableClose = true;
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

  public editorFocused(type) {
    this.focused = type;
  }

  public save = () => {
    return of(null)
      .pipe(
        filter(() => this.focused),
        switchMap(() => {
          switch (this.focused) {
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
      [EditorType.Scss]: 'styles',
      [EditorType.Html]: 'content',
    };

    const data = {
      id: this.contentLayout.id,
      [names[this.focused]]: this.editor.changes[this.focused],
    };

    return this.config.saveContentLayout({
      id: this.contentLayout.id,
      ...data,
    })
      .pipe(
        tap(() => {
          this._message.success('Saved Changes');
        }),
      );
  }

  public cancel(): void {
    if(!this.editor.hasChanges) {
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
      .subscribe((value) =>{
        if(value === 'discard') {
          this._dialogRef.close();
        }
      });
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
