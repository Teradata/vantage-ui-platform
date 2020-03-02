// TD_PRE_LOADER_COUNT variable is defined inside pre-loader.html

export function showPreLoader(): void {
  if ((<any>window).TD_PRE_LOADER_COUNT !== undefined) {
    (<any>window).TD_PRE_LOADER_COUNT++;
    updatePreLoaderVisibility();
  }
}

export function hidePreLoader(): void {
  if ((<any>window).TD_PRE_LOADER_COUNT !== undefined) {
    (<any>window).TD_PRE_LOADER_COUNT--;
    updatePreLoaderVisibility();
  }
}

function updatePreLoaderVisibility(): void {
  const loader: HTMLElement = document.getElementById('td-pre-loader');
  if (loader) {
    loader.style.height = (<any>window).TD_PRE_LOADER_COUNT > 0 ? '100%' : '0';
    loader.style.opacity = (<any>window).TD_PRE_LOADER_COUNT > 0 ? '1' : '0';
  }
}
