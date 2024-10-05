import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';


import { FsMessage } from '@firestitch/message';
import { FsTextEditorConfig } from '@firestitch/text-editor';

import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { EditorType } from '../../../../enums';
import { FsContentConfig } from '../../../../interfaces';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements OnInit, OnDestroy {

  @Input() public showHtml = false;
  @Input() public showScss = false;
  @Input() public showJs = false;
  @Input() public showGlobalScss = false;

  @Input() public html;
  @Input() public scss;
  @Input() public js;
  @Input() public contentConfig: FsContentConfig;

  @Output() public changed = new EventEmitter<{ type: string; value: string }>();
  @Output() public focused = new EventEmitter<string>();
  @Output() public blured = new EventEmitter<string>();

  public changes: any = {};
  public EditorType = EditorType;
  public focusedArea: string;

  public contentStyle: {
    scss?: string;
  };

  public resizing = false;
  public title;

  public scssConfig: FsTextEditorConfig;
  public globalScssConfig: FsTextEditorConfig;
  public htmlConfig: FsTextEditorConfig;
  public jsConfig: FsTextEditorConfig;

  private _destroy$ = new Subject<void>();

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _message: FsMessage,
  ) { }

  public ngOnInit(): void {
    this.initTextEditors();
    this.initGlobalContentStyle();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public change(type, value) {
    this.changed.emit({ type, value });
    this.changes[type] = value;
  }

  public get hasChanges() {
    return Object.keys(this.changes)
      .filter((name) => !!this.changes[name])
      .length !== 0;
  }

  public clearChange(type) {
    this.changes[type] = undefined;
    this._cdRef.markForCheck();
  }

  public initTextEditors() {
    this.scssConfig = {
      tabSize: 2,
      language: 'scss',
      height: '100%',
      focus: () => {
        this._onFocus(EditorType.Scss);
      },
      blur: () => {
        this.blured.emit(EditorType.Scss);
      },
    };
    this.jsConfig = {
      tabSize: 2,
      language: 'js',
      height: '100%',
      focus: () => {
        this._onFocus(EditorType.Js);
      },
      blur: () => {
        this.blured.emit(EditorType.Js);
      },
    };
    this.htmlConfig = {
      tabSize: 2,
      language: 'html',
      height: '100%',
      focus: () => {
        this._onFocus(EditorType.Html);
      },
      blur: () => {
        this.blured.emit(EditorType.Html);
      },
    };
    this.globalScssConfig = {
      tabSize: 2,
      language: 'scss',
      height: '100%',
      focus: () => {
        this._onFocus(EditorType.GlobalScss);
      },
      blur: () => {
        this.blured.emit(EditorType.GlobalScss);
      },
    };
  }

  public initGlobalContentStyle() {
    this.contentConfig.loadContentStyle()
      .subscribe((contentStyle) => {
        this.contentStyle = contentStyle || {};
        this._cdRef.markForCheck();
      });
  }

  public saveGlobalScss() {
    return this.contentConfig.saveContentStyle(this.contentStyle)
      .pipe(
        tap(() => {
          this._message.success('Saved Changes');
        }),
      );
  }

  private _onFocus(type): void {
    this.focusedArea = type;
    this.focused.emit(type);
  }

}
