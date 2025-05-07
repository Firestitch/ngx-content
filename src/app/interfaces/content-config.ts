import { Observable } from 'rxjs';

import { FsContentLayout } from './content-layout';
import { FsContentPage } from './content-page';
import { FsContentStyle } from './content-style';


export interface FsContentConfig {
  loadContent: (path: string) => Observable<FsContentPage>;
  loadContentPages: (query: any) => Observable<{ contentPages: FsContentPage[]; paging: any }>;
  loadContentPage: (contentPageId: number) => Observable<FsContentPage>;
  saveContentPage: (contentPage: FsContentPage) => Observable<FsContentPage>;
  deleteContentPage: (contentPage: FsContentPage) => Observable<FsContentPage>;
  loadContentLayouts: (query?: any) => Observable<{ contentLayouts: FsContentLayout[]; paging: any }>;
  loadContentLayout: (contentLayoutId) => Observable<FsContentLayout>;
  loadContentStyleCss?: () => Observable<string>;
  loadContentStyle: () => Observable<FsContentStyle>;
  saveContentStyle: (contentStyle: FsContentStyle) => Observable<FsContentStyle>;
  saveContentLayout: (contentLayout: FsContentLayout) => Observable<FsContentLayout>;
  deleteContentLayout: (contentLayout: FsContentLayout) => Observable<FsContentLayout>;
}
