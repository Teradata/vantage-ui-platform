import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { THEME_LOCAL_STORAGE_KEY, VantageThemeService, VantageTheme, VANTAGE_THEME_PROVIDER } from './theme.service';

let mockItems = {};
const mockLocalStorage = {
  getItem: (key: string) => {
    return key in mockItems ? mockItems[key] : undefined;
  },

  removeItem: (key: string) => {
    delete mockItems[key];
  },

  setItem: (key: string, value: string) => {
    mockItems[key] = value;
  },
};
const resetMockItems = () => (mockItems = {});

describe('ThemeService', () => {
  let service: VantageThemeService;
  let mediaSpy: jasmine.Spy;
  let mediaQueryList: MediaQueryList;

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

    mediaSpy = spyOn(window, 'matchMedia').and.returnValue(mediaQueryList);

    TestBed.configureTestingModule({
      imports: [CommonModule],
      providers: [VANTAGE_THEME_PROVIDER],
    });
  });

  afterEach(resetMockItems);

  it('should pull previous theme choices from localStorage', (done: DoneFn) => {
    // start with preloaded localStorage theme
    localStorage.setItem(THEME_LOCAL_STORAGE_KEY, VantageTheme.DARK);

    service = TestBed.inject(VantageThemeService);
    service.activeTheme$.subscribe((theme: VantageTheme) => {
      expect(localStorage.getItem).toHaveBeenCalled();
      expect(mediaSpy).not.toHaveBeenCalled();
      expect(theme).toBe(VantageTheme.DARK);
      done();
    });
  });

  it('should fall back to the browser theme preference', (done: DoneFn) => {
    // ensure browser under test is always the same
    mediaSpy.and.returnValue({ matches: true });

    service = TestBed.inject(VantageThemeService);

    service.activeTheme$.subscribe((theme: VantageTheme) => {
      expect(localStorage.getItem).toHaveBeenCalled();
      expect(mediaSpy).toHaveBeenCalled();
      expect(theme).toBe(VantageTheme.DARK);
      done();
    });
  });

  it('should default to the Light theme in absence of other preferences', (done: DoneFn) => {
    service = TestBed.inject(VantageThemeService);

    mediaSpy.and.returnValue({ matches: false });

    service.activeTheme$.subscribe((theme: VantageTheme) => {
      expect(theme).toBe(VantageTheme.LIGHT);
      done();
    });
  });

  it('should set the theme in localStorage', (done: DoneFn) => {
    service = TestBed.inject(VantageThemeService);
    service.applyDarkTheme();

    service.activeTheme$.subscribe((theme: VantageTheme) => {
      expect(localStorage.setItem).toHaveBeenCalledWith(THEME_LOCAL_STORAGE_KEY, VantageTheme.DARK);
      expect(theme).toBe(VantageTheme.DARK);
      expect(localStorage.getItem(THEME_LOCAL_STORAGE_KEY)).toBe(VantageTheme.DARK);
      done();
    });
  });
});
