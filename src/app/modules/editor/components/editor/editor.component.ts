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
  @Input() public js ;
  @Input() public contentConfig: FsContentConfig;

  @Output() public changed = new EventEmitter<{ type: string; value: string }>();

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
    private _message: FsMessage,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.initTextEditors();
    this.initGlobalContentStyle();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public globalScssChange() {
    this.contentConfig.saveContentStyle(this.contentStyle)
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
    this.contentConfig.loadContentStyle()
      .subscribe((contentStyle) => {
        this.contentStyle = contentStyle || {};
        this._cdRef.markForCheck();
      });
  }

}
