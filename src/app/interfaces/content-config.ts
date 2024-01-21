import { Observable } from 'rxjs';

import { FsContentLayout } from './content-layout';
import { FsContentPage } from './content-page';


export interface FsContentConfig {
  loadContent: (path: string) => Observable<{ content: string; styles: string; title: string }>;
  loadContentPages: (query: any) => Observable<{ contentPages: FsContentPage[]; paging: any }>;
  saveContentPage: (contentPage: FsContentPage) => Observable<FsContentPage>;
  deleteContentPage: (contentPage: FsContentPage) => Observable<FsContentPage>;
  loadContentLayouts: (query?: any) => Observable<FsContentLayout[]>;
  saveContentLayout: (contentLayout: FsContentLayout) => Observable<FsContentLayout>;
  deleteContentLayout: (contentLayout: FsContentLayout) => Observable<FsContentLayout>;
}
