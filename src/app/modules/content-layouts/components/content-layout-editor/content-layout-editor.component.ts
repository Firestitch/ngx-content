import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsPrompt } from '@firestitch/prompt';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { fromEvent } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { EditorType } from '../../../../enums';
import { FsContentConfig, FsContentLayout } from '../../../../interfaces';
import { EditorComponent } from '../../../editor/components/editor/editor.component';
import { EditorTogglesComponent } from '../../../editor/components/editor-toggles';
import { EditorActionsComponent } from '../../../editor/components/editor-actions';
import { ContentLayoutComponent } from '../content-layout/content-layout.component';


@Component({
  templateUrl: './content-layout-editor.component.html',
  styleUrls: ['./content-layout-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    FsFormModule,
    FsSkeletonModule,
    FsDialogModule,
    MatDialogTitle,
    EditorTogglesComponent,
    EditorActionsComponent,
    CdkScrollable,
    MatDialogContent,
    EditorComponent,
  ],
})
export class ContentLayoutEditorComponent implements OnInit {

  public editor = viewChild(EditorComponent);
  public contentLayout = signal<FsContentLayout>(null);

  public get isMac(): boolean {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }

  public config: FsContentConfig;
  public EditorType = EditorType;
  public editors = signal({
    [EditorType.Html]: true,
    [EditorType.Scss]: true,
    [EditorType.GlobalScss]: false,
  });

  public submitted = () => this.editor().save$(
    {
      [EditorType.Html]: 'content',
      [EditorType.Scss]: 'styles',
    },
    (values) => this.config.saveContentLayout({ id: this.contentLayout().id, ...values }),
  );

  private _data = inject(MAT_DIALOG_DATA);
  private _dialogRef = inject<MatDialogRef<ContentLayoutEditorComponent>>(MatDialogRef);
  private _dialog = inject(MatDialog);
  private _prompt = inject(FsPrompt);
  private _destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this._dialogRef.addPanelClass('fs-content-editor-overlay-pane');
    this._dialogRef.disableClose = true;
    this.config = this._data.contentConfig;
    this._initContentLayout();
    this._initEscape();
  }

  public editorToggleChange(event: MatButtonToggleChange): void {
    this.editors.update((editors) => ({ ...editors, [event.value]: !editors[event.value] }));
  }

  public save(): void {
    this.submitted()
      .subscribe();
  }

  public close(): void {
    if (!this.editor()?.hasChanges()) {
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
        filter((value) => value === 'discard'),
        tap(() => this._dialogRef.close()),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  public openSettings(): void {
    this._dialog.open(ContentLayoutComponent, {
      data: {
        contentLayout: this.contentLayout(),
      },
    })
      .afterClosed()
      .pipe(
        filter((contentLayout) => !!contentLayout),
        // Only what the settings dialog edits. Merging content/styles from its response would
        // push them through [html]/[scss] into the editors and wipe unsaved typing (IEB-T292).
        tap((contentLayout: FsContentLayout) => {
          this.contentLayout.update((current) => ({
            ...current,
            name: contentLayout.name,
            tag: contentLayout.tag,
          }));
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _initContentLayout(): void {
    this.config.loadContentLayout(this._data.contentLayout.id)
      .pipe(
        tap((contentLayout) => this.contentLayout.set(contentLayout)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _initEscape(): void {
    fromEvent(document, 'keydown')
      .pipe(
        filter((event: KeyboardEvent) => event.code === 'Escape'),
        tap(() => {
          const dialogRef = this._dialog.openDialogs.reverse()[0];
          if (dialogRef?.componentInstance === this) {
            this.close();
          }
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

}
