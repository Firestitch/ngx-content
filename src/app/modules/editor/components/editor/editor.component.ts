import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewChildren,
  QueryList,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

import { FsMessage } from '@firestitch/message';
import { FsTextEditorComponent } from '@firestitch/text-editor';

import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';


@Component({
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements OnInit, OnDestroy {

  @ViewChildren(FsTextEditorComponent)
  public textEditors: QueryList<FsTextEditorComponent>;

  public styles = null;
  public content = null;
  public editors = { content: true, styles: true };

  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<EditorComponent>,
    private _message: FsMessage,
  ) {}

  public ngOnInit(): void {
    this._dialogRef.updateSize('100%','100%');
    this.content = this._data.content;
    this.styles = this._data.styles;
  }

  public editorToggleChange(event: MatButtonToggleChange): void {
    this.editors[event.value] = !this.editors[event.value];
    setTimeout(() => {
      this.textEditors.forEach((textEditor) => {
        textEditor.updateLayout();
      });
    }, 100);
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public save = () => {
    return this._data.save({ content: this.content, styles: this.styles })
      .pipe(
        tap(() => {
          this._message.success('Saved Changes');
        }),
      );
  };

}
