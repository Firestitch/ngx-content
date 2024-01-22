import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { ItemType } from '@firestitch/filter';
import { FsListComponent, FsListConfig } from '@firestitch/list';

import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { FS_CONTENT_CONFIG } from '../../../../injectors';
import { FsContentConfig } from '../../../../interfaces';
import { EditorComponent } from '../../../editor/components/editor';
import { ContentLayoutComponent } from '../../components/content-layout';


@Component({
  selector: 'fs-content-layouts',
  templateUrl: './content-layouts.component.html',
  styleUrls: ['./content-layouts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsContentLayoutsComponent implements OnInit, OnDestroy {

  @ViewChild(FsListComponent)
  public listComponent: FsListComponent;

  public listConfig: FsListConfig;

  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(FS_CONTENT_CONFIG) private _config: FsContentConfig,
    private _dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this._initListConfig();
  }

  public openEditor(contentLayout: any): void {
    this._dialog.open(EditorComponent, {
      maxWidth: '100vw',
      width: '100%',
      height: '100%',
      data: {
        contentPage: contentLayout,
        title: 'Layout',
        contentConfig: this._config,
        save: (data) => {
          return this._config.saveContentLayout({
            id: contentLayout.id,
            ...data,
          });
        },
        openSettings: (data) => {
          return this.openLayout(data);
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

  public openLayout(contentLayout: any): Observable<any> {
    return this._dialog.open(ContentLayoutComponent, {
      data: {
        contentLayout,
      },
    })
      .afterClosed()
      .pipe(
        filter((_contentLayout) => !!_contentLayout),
        takeUntil(this._destroy$),
      );
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _initListConfig(): void {
    this.listConfig = {
      paging: false,
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
            this.openLayout({})
              .subscribe(() => {
                this.listComponent.reload();
              });
          },
        },
      ],
      rowActions: [
        {
          click: (data) => {
            return this._config.deleteContentLayout(data);
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
        return this._config.loadContentLayouts(query)
          .pipe(
            map((contentLayouts: any) => {
              return { data: contentLayouts  };
            }),
          );
      },
      restore: {
        query: { state: 'deleted' },
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        reload: true,
        click: (row) => {
          return this._config.saveContentLayout({ id: row.id, state: 'active' });
        },
      },
    };
  }

}

