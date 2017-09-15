import { TogetherToWorkPage } from './app.po';

describe('together-to-work App', () => {
  let page: TogetherToWorkPage;

  beforeEach(() => {
    page = new TogetherToWorkPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
