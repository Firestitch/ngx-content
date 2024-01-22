import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';


import { FsFormDirective } from '@firestitch/form';
import { FsMessage } from '@firestitch/message';
import { FsTextEditorComponent } from '@firestitch/text-editor';

import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { FS_CONTENT_CONFIG } from '../../../../injectors';
import { FsContentConfig } from '../../../../interfaces';


@Component({
  selector: 'fs-content-style',
  templateUrl: './content-style.component.html',
  styleUrls: ['./content-style.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentStyleComponent implements OnInit, OnDestroy {

  @ViewChild(FsTextEditorComponent)
  public textEditors: FsTextEditorComponent;

  @ViewChild(FsFormDirective)
  public form: FsFormDirective;

  @Input() public height: string = '100%';

  public contentStyle = null;
  public styleConfig = {
    tabSize: 2,
    language: 'scss',
    height: '100%',
  };

  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(FS_CONTENT_CONFIG) private _config: FsContentConfig,
    private _message: FsMessage,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.styleConfig.height = this.height;
    this._config.loadContentStyle()
      .subscribe((contentStyle) => {
        this.contentStyle = contentStyle;
        this._cdRef.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public save() {
    this._config.saveContentStyle(this.contentStyle)
      .pipe(
        tap((contentStyle) => {
          this.contentStyle = {
            ...this.contentStyle,
            ...contentStyle,
          };

          this._cdRef.markForCheck();
          this._message.success('Saved Changes');
        }),
      ).subscribe();
  }

}
