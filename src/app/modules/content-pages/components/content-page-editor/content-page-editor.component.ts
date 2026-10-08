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

import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';

import { FsPrompt } from '@firestitch/prompt';

import { fromEvent } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { EditorType } from '../../../../enums';
import { FsContentConfig, FsContentPage } from '../../../../interfaces';
import { ContentPageComponent } from '../content-page/content-page.component';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FsDialogModule } from '@firestitch/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { EditorComponent } from '../../../editor/components/editor/editor.component';
import { EditorTogglesComponent } from '../../../editor/components/editor-toggles';
import { EditorActionsComponent } from '../../../editor/components/editor-actions';


@Component({
    templateUrl: './content-page-editor.component.html',
    styleUrls: ['./content-page-editor.component.scss'],
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
export class ContentPageEditorComponent implements OnInit {

  public editor = viewChild(EditorComponent);
  public contentPage = signal<FsContentPage>(null);
  public config: FsContentConfig;
  public editors = signal({
    [EditorType.Html]: true,
    [EditorType.Scss]: true,
    [EditorType.Js]: false,
    [EditorType.GlobalScss]: false,
  });

  public get isMac(): boolean {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }

  public submitted = () => this.editor().save$(
    {
      [EditorType.Html]: 'content',
      [EditorType.Scss]: 'styles',
      [EditorType.Js]: 'js',
    },
    (values) => this.config.saveContentPage({ id: this.contentPage().id, ...values }),
  );

  private _data = inject(MAT_DIALOG_DATA);
  private _dialogRef = inject<MatDialogRef<ContentPageEditorComponent>>(MatDialogRef);
  private _dialog = inject(MatDialog);
  private _prompt = inject(FsPrompt);
  private _destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this._dialogRef.addPanelClass('fs-content-editor-overlay-pane');
    this._dialogRef.disableClose = true;
    this.config = this._data.contentConfig;
    this._initContentPage();
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

  public openPreview(): void {
    window.open(this.contentPage().path, '_blank');
  }

  public openSettings(): void {
    this._dialog.open(ContentPageComponent, {
      data: {
        contentPage: this.contentPage(),
      },
    })
      .afterClosed()
      .pipe(
        filter((contentPage) => !!contentPage),
        // Only what the settings dialog edits. Merging content/styles/js from its response
        // would push them through [html]/[scss]/[js] into the editors and wipe unsaved typing
        // (IEB-T292). The path is merged so Preview follows a renamed page.
        tap((contentPage: FsContentPage) => {
          this.contentPage.update((current) => ({
            ...current,
            type: contentPage.type,
            contentLayoutId: contentPage.contentLayoutId,
            name: contentPage.name,
            path: contentPage.path,
            title: contentPage.title,
          }));
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _initContentPage(): void {
    this.config.loadContentPage(this._data.contentPage.id)
      .pipe(
        tap((contentPage) => this.contentPage.set(contentPage)),
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
