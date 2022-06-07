import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy,
  Input,
  Inject,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { ItemType } from '@firestitch/filter';
import { index } from '@firestitch/common';
import { FsHtmlEditorConfig } from '@firestitch/html-editor';

import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { PageTypes } from '../../../../consts';
import { FS_CONTENT_CONFIG } from '../../../../injectors';
import { FsContentConfig } from '../../../../interfaces';
import { ContentPageComponent } from '../content-page/content-page.component';
import { EditorComponent } from '../../../editor/components/editor';


@Component({
  selector: 'fs-content-pages',
  templateUrl: './content-pages.component.html',
  styleUrls: ['./content-pages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsContentPagesComponent implements OnInit, OnDestroy {

  @Input() public htmlEditorConfig: FsHtmlEditorConfig;

  @ViewChild(FsListComponent)
  public listComponent: FsListComponent;

  public listConfig: FsListConfig;
  public pageTypes = index(PageTypes, 'value', 'name');

  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(FS_CONTENT_CONFIG) private _config: FsContentConfig,
    private _dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this._initListConfig();
  }

  public openEditor(contentPage: any): void {
    this._dialog.open(EditorComponent, {
      maxWidth: null,
      maxHeight: null,
      data: {
        styles: contentPage.styles,
        content: contentPage.content,
        save: (data) => {
          return this._config.saveContentPage({
            id: contentPage.id,
            ...data,
          });
        },     
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
    .subscribe(() => {
      this.listComponent.reload();
    });
  }

  public openPage(contentPage: any): void {
    this._dialog.open(ContentPageComponent, {
      data: {
        contentPage,
      },
    })
      .afterClosed()
      .pipe(
        filter((_contentPage) => !!_contentPage),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.listComponent.reload();
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _initListConfig(): void {
    this.listConfig = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search',
        },
      ],
      actions: [
        {
          label: 'Create',
          click: () => {
            this.openPage({});
          },
        },
      ],
      rowActions: [
        {
          click: (data) => {
            return this._config.deleteContentPage(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this record?',
          },
          menu: true,
          label: 'Delete',
        },
      ],
      fetch: (query) => {
        return this._config.loadContentPages(query)
          .pipe(
            map((response: any) => {
              return { data: response.contentPages, paging: response.paging };
            }),
          );
      },
      restore: {
        query: { state: 'deleted' },
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        reload: true,
        click: (row) => {
          return this._config.saveContentPage({ id: row.id, state: 'active' });
        },
      },
    };
  }

}


