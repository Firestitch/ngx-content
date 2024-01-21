import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { FsFormDirective } from '@firestitch/form';
import { FsMessage } from '@firestitch/message';
import { FsTextEditorComponent } from '@firestitch/text-editor';

import { Subject, fromEvent } from 'rxjs';
import { finalize, take, takeUntil, tap } from 'rxjs/operators';

import { FsContentConfig } from '../../../../interfaces';
import { ContentPageComponent } from '../../../content-pages/components/content-page';


@Component({
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements OnInit, OnDestroy {

  @ViewChild(FsFormDirective)
  public form: FsFormDirective;

  @ViewChild('styleEditor')
  public styleEditor: FsTextEditorComponent;

  @ViewChild('contentEditor')
  public contentEditor: FsTextEditorComponent;

  @ViewChild('separator', { static: true, read: ElementRef })
  public separator: ElementRef;

  @ViewChild('contentContainer', { static: true, read: ElementRef })
  public contentContainer: ElementRef;

  @ViewChild('styleContainer', { static: true, read: ElementRef })
  public styleContainer: ElementRef;

  public contentPage;
  public resizing = false;
  public editors = { content: true, styles: true };

  private _config: FsContentConfig;
  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: { contentPage: any; config: FsContentConfig },
    private _dialogRef: MatDialogRef<EditorComponent>,
    private _dialog: MatDialog,
    private _message: FsMessage,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.contentPage = this._data.contentPage;
    this._config = this._data.config;
    this._initSeparator();
  }

  public editorToggleChange(event: MatButtonToggleChange): void {
    this.editors[event.value] = !this.editors[event.value];
    this.updateEditorLayouts();
  }

  public updateEditorLayouts(): void {
    setTimeout(() => {
      if(this.editors.content) {
        this.contentEditor.updateLayout();
      }

      if(this.editors.styles) {
        this.styleEditor.updateLayout();
      }
    });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public stylesChanged() {
    this.form.triggerSubmit();
  }

  public contentChanged() {
    this.form.triggerSubmit();
  }

  public save = () => {
    return this._config.saveContentPage({
      id: this.contentPage.id,
      styles: this.contentPage.styles,
      content: this.contentPage.content,
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
      );
  };

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


  private _initSeparator(): void {
    fromEvent(this.separator.nativeElement, 'mousedown')
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((e) => {
        this._moveSeparator(e);
      });
  }

  private _moveSeparator(separatorEvent): void {
    let mouseDown = {
      clientX: separatorEvent.clientX,
      clientY: separatorEvent.clientY,
      offsetLeft:  Number(this.separator.nativeElement.offsetLeft),
      offsetTop:   Number(this.separator.nativeElement.offsetTop),
      firstWidth:  Number(this.contentContainer.nativeElement.offsetWidth),
      secondWidth: Number(this.styleContainer.nativeElement.offsetWidth),
    };

    this.resizing = true;
    this._cdRef.markForCheck();

    fromEvent(document, 'mousemove')
      .pipe(
        finalize(() => {
          mouseDown = null;
          this.resizing = false;
          this._cdRef.markForCheck();
          this.updateEditorLayouts();
        }),
        takeUntil(
          fromEvent(this.separator.nativeElement, 'mouseup')
            .pipe(
              take(1),
              takeUntil(this._destroy$),
            ),
        ),
        takeUntil(this._destroy$),
      )
      .subscribe((e: any) => {
        const delta = { x: e.clientX - mouseDown.clientX,
          y: e.clientY - mouseDown.clientY };

        delta.x = Math.min(Math.max(delta.x, -mouseDown.firstWidth),
          mouseDown.secondWidth);

        this.separator.nativeElement.style.left = `${mouseDown.offsetLeft + delta.x}px`;
        this.contentContainer.nativeElement.style.width = `${mouseDown.firstWidth + delta.x}px`;
        this.styleContainer.nativeElement.style.width = `${mouseDown.secondWidth - delta.x}px`;
      });
  }
}
