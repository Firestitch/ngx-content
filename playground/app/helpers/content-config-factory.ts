import { FsContentConfig, FsContentPage } from '@firestitch/content';
import { parse } from '@firestitch/date';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { FsContentLayout, FsContentStyle } from 'src/app/interfaces';


export function contentConfigFactory(): FsContentConfig {
  return {
    loadContentPages: (query) => {
      return of({
        contentPages: ContentPages,
        paging: {},
      });
    },
    loadContentPage: (contentPageId: number) => {
      return of(ContentPages)
        .pipe(
          map((contentPages) => {
            return contentPages
              .filter((contentPage) => contentPage.id === contentPageId)[0];
          }),
        );
    },
    loadContentLayout: (contentLayoutId: number) => {
      return of(ContentLayouts)
        .pipe(
          map((contentLayouts) => {
            return contentLayouts
              .filter((contentLayout) => contentLayout.id === contentLayoutId)[0];
          }),
        );
    },
    saveContentPage: (contentPage: FsContentPage) => {
      return of(contentPage);
    },
    deleteContentPage: (contentPage: FsContentPage) => {
      return of(contentPage);
    },
    loadContentLayouts: (query) => {
      return of({
        contentLayouts: ContentLayouts,
        paging: {},
      });
    },
    saveContentLayout: (contentLayout: FsContentLayout) => {
      return of(contentLayout);
    },
    deleteContentLayout: (contentPage: FsContentPage) => {
      return of(contentPage);
    },
    loadContent: (path: string) => {
      return of({
        content: '<h1 class="heading">Contact Us <span id="hello"></span></h1>',
        styles: '.heading { color: purple }',
        title: 'Contact Us',
        js: 'document.querySelector("#hello").append("Hello!");',
      });
    },
    saveContentStyle: (contentStyle: FsContentStyle) => of(contentStyle),
    loadContentStyle: () => of({ scss: 'body { background: #9bbfff; }' }),
    loadContentStyleCss: () =>  of('body { background: #9bbfff; }'),
  };
}


const ContentPages = [
  {
    id: 3,
    state: 'active',
    type: 'standardPage',
    path: 'about',
    content: 'About',
    createDate: parse('2022-05-31T13:42:08+00:00'),
    modifyDate: parse('2022-05-31T13:42:22+00:00'),
    name: 'About',
    title: null,
    styles: null,
    contentLayoutId: 1,
  },
  {
    id: 7,
    state: 'active',
    type: 'standardPage',
    path: 'contactus',
    content: null,
    createDate: parse('2022-05-31T14:20:20+00:00'),
    modifyDate: parse('2022-05-31T14:20:20+00:00'),
    name: 'Contact us',
    title: null,
    styles: null,
    contentLayoutId: 1,
  },
  {
    id: 2,
    state: 'active',
    type: 'homePage',
    path: '',
    content: '<element-search></element-search>\n\n<div class=\'banner\'>\n  <img src=\'https://jetsplitz.s3.ca-central-1.amazonaws.com/pub/content/Header_Image.jpg\'/>\n  <div class=\'info\'>\n    <h2>Search, Request, Sell</h2>\n    <span>Your online marketplace for empty legs.</span>\n    <span>It is like Uber and AirBnB but for Private Air Travel.</span>\n  </div>\n</div>\n\n<div class=\'heading\'>\n  <h2>Destinations you can travel to now</h2>\n  Click on the location to see if there are any empty legs to these fabulous destionations!\n</div>\n\n<div class=\'destinations\'>\n  <div class=\'item\'>\n    <a href=\'/explore?passengers=6&amp;destinationAirport=LFPG\'><img src=\'https://jetsplitz.s3.ca-central-1.amazonaws.com/pub/content/Paris_splash.jpg\'/></a>\n    <span class=\'name\'>Paris</span>\n  </div>\n  <div class=\'item\'>\n    <a href = \'/explore?passengers=6&amp;destinationAirport=KMIA\'><img src=\'https://jetsplitz.s3.ca-central-1.amazonaws.com/pub/content/Miami_splash.jpg\'/></a>\n    <span class=\'name\'>Miami</span>\n  </div>\n  <div class=\'item\'>\n    <a href = \'/explore?passengers=6&amp;destinationAirport=EGLL\'><img src=\'https://jetsplitz.s3.ca-central-1.amazonaws.com/pub/content/London_splash.jpg\'/></a>\n    <span class=\'name\'>London</span>\n  </div>\n  <div class=\'item\'>\n    <a href = \'/explore?passengers=6&amp;destinationAirport=KLAX\'><img src=\'https://jetsplitz.s3.ca-central-1.amazonaws.com/pub/content/Los_Angeles_splash.jpg\'/></a>\n    <span class=\'name\'>Los Angeles</span>\n  </div>\n  <div class=\'item\'>\n    <a href = \'/explore?passengers=6&amp;destinationAirport=KJFK\'><img src=\'https://jetsplitz.s3.ca-central-1.amazonaws.com/pub/content/New_York_splash.jpg\'/></a>\n    <span class=\'name\'>New York</span>\n  </div>\n  <div class=\'item\'>\n    <a href = \'/explore?passengers=6&amp;destinationAirport=MYNN\'><img src=\'https://jetsplitz.s3.ca-central-1.amazonaws.com/pub/content/Nassau_splash.jpg\'/></a>\n    <span class=\'name\'>Nassau</span>\n  </div>\n  <div class=\'item\'>\n    <a href = \'/explore?passengers=6&amp;destinationAirport=LIRF\'><img src=\'https://jetsplitz.s3.ca-central-1.amazonaws.com/pub/content/Rome_splash.jpg\'/></a>\n    <span class=\'name\'>Rome</span>\n  </div>\n  <div class=\'item\'>\n    <a href = \'/explore?passengers=6&amp;destinationAirport=CYVR\'><img src=\'https://jetsplitz.s3.ca-central-1.amazonaws.com/pub/content/Vancouver_splash.jpg\'/></a>\n    <span class=\'name\'>Vancouver</span>\n  </div>\n</div>',
    createDate: parse('2022-04-18T20:50:58+00:00'),
    modifyDate: parse('2022-06-04T07:13:11+00:00'),
    name: 'Home Page',
    title: null,
    styles: '.banner {\n  position: relative;\n  margin: 18px 0 25px 0;\n  img {\n    width: 100%;\n    border-radius: 16px;\n  }\n\n  .info {\n    display: flex;\n    flex-direction: column;\n    position: absolute;\n    left: 25px;\n    top: 17px;\n    & * {\n      color: #fff;\n    }\n  }\n}\n\nh2 {\n  font-size: 25px;\n}\n\n.heading {\n  margin-bottom: 20px;\n}\n\n.destinations {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr 1fr;\n  grid-column-gap: 20px;\n  grid-row-gap: 20px;\n\n  .item {\n    position: relative;\n    height: 156px;\n    border-radius: 7px;\n    overflow: hidden;\n\n    img {\n      width: 100%;\n      height: 100%;\n      object-fit: cover;\n    }\n    \n    .name {\n      color: #fff;\n      position: absolute;\n      bottom: 15px;\n      left: 10px;\n      font-weight: 600;\n      font-size: 20px;\n    }\n  }\n}\n\n@media (max-width: 1000px) {\n  .destinations {\n    grid-template-columns: 1fr 1fr;\n  }\n  .banner .info {\n    h2 {\n      margin-top: 0;\n    }\n  }\n}\n\n@media (max-width: 499px) {\n  .banner .info {\n    top: 0;\n  }\n}\n\n// .home-container {\n//   color: #fff;\n//   text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.38);\n\n//   .large {\n//     font-size: 40px;\n//   }\n\n//   .medium {\n//     font-size: 30px;\n//   }\n// }',
    contentLayoutId: 1,
  },
  {
    id: 5,
    state: 'active',
    type: 'standardPage',
    path: 'jobs',
    content: null,
    createDate: parse('2022-05-31T14:19:49+00:00'),
    modifyDate: parse('2022-05-31T14:19:49+00:00'),
    name: 'Jobs',
    title: null,
    styles: null,
    contentLayoutId: 1,
  },
  {
    id: 1,
    state: 'active',
    type: 'notFoundPage',
    path: '404',
    content: '<h1>404 Not Found</h1>',
    createDate: parse('2022-04-18T20:50:58+00:00'),
    modifyDate: parse('2022-04-18T20:50:58+00:00'),
    name: 'Not Found',
    title: null,
    styles: '',
    contentLayoutId: 1,
  },
];

const ContentLayouts = [
  {
    id: 1,
    state: 'active',
    name: 'Default',
    createDate: parse('2022-04-18T20:50:58+00:00'),
    modifyDate: parse('2022-04-18T20:50:58+00:00'),
    tag: null,
    content: '<div>\n  <div class="content-container">\n    <element-header></element-header>\n    <div class="content">\n        <content></content>\n    </div>\n  </div>\n</div>',
    styles: 'body {\n  // background-image: url(http://firestitch.com/wp-content/uploads/2020/03/bg.jpg?id=6989);\n  background-repeat: no-repeat;\n  background-size: cover;\n  background-position: center top;\n  font-family: \'Montserrat\', sans-serif;\n}\n\n.content-container {\n  margin: auto;\n  padding: 20px 50px;\n  max-width: 1080px;\n}\n\n\n.button {\nbox-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);\ncolor: white;\nbackground-color: #F86773;\nbox-sizing: border-box;\nposition: relative;\n-webkit-user-select: none;\n-moz-user-select: none;\n-ms-user-select: none;\nuser-select: none;\ncursor: pointer;\noutline: none;\nborder: none;\n-webkit-tap-highlight-color: transparent;\ndisplay: inline-block;\nwhite-space: nowrap;\ntext-decoration: none;\nvertical-align: baseline;\ntext-align: center;\nmargin: 0;\nmin-width: 64px;\nline-height: 36px;\npadding: 0 16px;\nborder-radius: 4px;\noverflow: visible;\ntransform: translate3d(0, 0, 0);\ntransition: background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n@media (max-width: 1000px) {\n  body {\n    .content-container {\n      width: auto;\n      padding: 20px 5px;\n    }\n  }\n}',
  },
];
