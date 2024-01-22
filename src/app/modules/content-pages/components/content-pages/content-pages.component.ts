import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { index } from '@firestitch/common';
import { ItemType } from '@firestitch/filter';
import { FsHtmlEditorConfig } from '@firestitch/html-editor';
import { FsListComponent, FsListConfig } from '@firestitch/list';

import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';


import { PageTypes } from '../../../../consts';
import { PageType } from '../../../../enums';
import { FS_CONTENT_CONFIG } from '../../../../injectors';
import { FsContentConfig } from '../../../../interfaces';
import { EditorComponent } from '../../../editor/components/editor';
import { ContentPageComponent } from '../content-page/content-page.component';


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
      data: {
        contentPage,
        config: this._config,
        title: 'Page',
        contentConfig: this._config,
        save: (data) => {
          return this._config.saveContentPage(data);
        },
        openSettings: (data) => {
          return this.openContentPage(data);
        },
      },
      maxWidth: '100vw',
      width: '100%',
      height: '100%',
      autoFocus: false,
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

  public openContentPage(contentPage): Observable<any> {
    return this._dialog.open(ContentPageComponent, {
      data: { contentPage },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      );
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
            this.openContentPage({
              type: PageType.StandardPage,
            })
              .pipe(
                filter((contentPage) => !!contentPage),
              )
              .subscribe((contentPage) => {
                this.openEditor(contentPage);
                this.listComponent.reload();
              });
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


