import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { FsFormModule } from '@firestitch/form';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FsTextEditorConfig, FsTextEditorModule } from '@firestitch/text-editor';

import { AngularSplitModule } from 'angular-split';
import { EMPTY, Observable, concat } from 'rxjs';
import { finalize, last, tap } from 'rxjs/operators';

import { EditorType } from '../../../../enums';
import { FsContentConfig, FsContentStyle } from '../../../../interfaces';
import { EditorLabelComponent } from '../editor-label/editor-label.component';


type EditorValues = Partial<Record<EditorType, string>>;


@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        AngularSplitModule,
        EditorLabelComponent,
        FsTextEditorModule,
        FormsModule,
        FsFormModule,
        FsSkeletonModule,
    ],
})
export class EditorComponent implements OnInit {

  public showHtml = input(false);
  public showScss = input(false);
  public showJs = input(false);
  public showGlobalScss = input(false);
  public contentConfig = input<FsContentConfig>();

  // Two-way bound to the text editors, so each holds exactly what is on screen. Nothing sits
  // between a keystroke and a save: the fsModelChange this replaced debounced every pane by
  // 300 ms (its `debounce: 0` falls back to 300), so a quick Ctrl+S posted text without its
  // last keystrokes (IEB-T292).
  public html = model<string>();
  public scss = model<string>();
  public js = model<string>();
  public globalScss = signal<string>(null);

  public contentStyle = signal<FsContentStyle>(null);
  public focusedArea = signal<EditorType>(null);
  public saving = signal(false);

  // A pane is changed when its text differs from what the server last confirmed. A pane
  // cleared to '' counts; one typed back to its original text does not (IEB-T292).
  public changedTypes = computed(() => {
    const saved = this._saved();

    return Object.values(EditorType)
      .filter((type) => type in saved && this.value(type) !== saved[type]);
  });
  public hasChanges = computed(() => this.changedTypes().length !== 0);

  public EditorType = EditorType;

  public scssConfig: FsTextEditorConfig;
  public globalScssConfig: FsTextEditorConfig;
  public htmlConfig: FsTextEditorConfig;
  public jsConfig: FsTextEditorConfig;

  private _saved = signal<EditorValues>({});
  private _message = inject(FsMessage);
  private _destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this._initTextEditors();
    this._saved.set({
      [EditorType.Html]: this.html() ?? '',
      [EditorType.Scss]: this.scss() ?? '',
      [EditorType.Js]: this.js() ?? '',
    });
    this._initGlobalContentStyle();
  }

  public value(type: EditorType): string {
    const panes = {
      [EditorType.Html]: this.html,
      [EditorType.Scss]: this.scss,
      [EditorType.Js]: this.js,
      [EditorType.GlobalScss]: this.globalScss,
    };

    return panes[type]() ?? '';
  }

  /**
   * Saves every changed pane, not just the one last focused, and records what was sent as
   * the new baseline, so anything typed while the request is in flight stays changed. With
   * nothing changed it sends nothing and shows no toast. Ctrl+S reaches this through fsForm's
   * [submit], so it shares the Save button's gate (IEB-T292).
   *
   * `fields` maps a pane to its property on the record (html → content); `saveRecord` posts
   * those properties.
   */
  public save$(
    fields: EditorValues,
    saveRecord: (values: Record<string, string>) => Observable<unknown>,
  ): Observable<unknown> {
    const sent: EditorValues = Object.fromEntries(
      this.changedTypes().map((type) => [type, this.value(type)]),
    );
    const saves = [
      this._saveRecord$(fields, sent, saveRecord),
      this._saveGlobalScss$(sent),
    ].filter((save) => !!save);

    if (!saves.length) {
      return EMPTY;
    }

    this.saving.set(true);

    return concat(...saves)
      .pipe(
        last(),
        tap(() => this._message.success('Saved Changes')),
        finalize(() => this.saving.set(false)),
      );
  }

  private _saveRecord$(
    fields: EditorValues,
    sent: EditorValues,
    saveRecord: (values: Record<string, string>) => Observable<unknown>,
  ): Observable<unknown> {
    const types = (Object.keys(sent) as EditorType[])
      .filter((type) => fields[type]);

    if (!types.length) {
      return null;
    }

    return saveRecord(Object.fromEntries(types.map((type) => [fields[type], sent[type]])))
      .pipe(
        tap(() => this._markSaved(types, sent)),
      );
  }

  private _saveGlobalScss$(sent: EditorValues): Observable<unknown> {
    if (!(EditorType.GlobalScss in sent)) {
      return null;
    }

    const contentStyle = { ...this.contentStyle(), scss: sent[EditorType.GlobalScss] };

    return this.contentConfig().saveContentStyle(contentStyle)
      .pipe(
        tap(() => {
          this.contentStyle.set(contentStyle);
          this._markSaved([EditorType.GlobalScss], sent);
        }),
      );
  }

  private _markSaved(types: EditorType[], sent: EditorValues): void {
    this._saved.update((saved) => ({
      ...saved,
      ...Object.fromEntries(types.map((type) => [type, sent[type]])),
    }));
  }

  private _initTextEditors(): void {
    this.scssConfig = this._createTextEditorConfig(EditorType.Scss, 'scss');
    this.jsConfig = this._createTextEditorConfig(EditorType.Js, 'js');
    this.htmlConfig = this._createTextEditorConfig(EditorType.Html, 'html');
    this.globalScssConfig = this._createTextEditorConfig(EditorType.GlobalScss, 'scss');
  }

  private _createTextEditorConfig(type: EditorType, language: string): FsTextEditorConfig {
    return {
      tabSize: 2,
      language,
      height: '100%',
      focus: () => {
        this.focusedArea.set(type);
      },
    };
  }

  private _initGlobalContentStyle(): void {
    this.contentConfig().loadContentStyle()
      .pipe(
        tap((contentStyle) => {
          const scss = contentStyle?.scss ?? '';

          this.contentStyle.set(contentStyle || {});
          this.globalScss.set(scss);
          this._saved.update((saved) => ({ ...saved, [EditorType.GlobalScss]: scss }));
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

}
