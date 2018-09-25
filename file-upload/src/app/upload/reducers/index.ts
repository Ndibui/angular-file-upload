import * as fromFileUpload from './upload.reducer';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

export interface AppState {
    fileUpload: fromFileUpload.State;
}

export const reducers: ActionReducerMap<AppState> = {
    fileUpload: fromFileUpload.reducer
};

export const getAppState = createFeatureSelector<AppState>('upload');
export const getFileUploadState = createSelector(
    getAppState,
    state => state.fileUpload
);

export const getFileUploadSelectors = {
    getUploadingFiles: createSelector(
      getFileUploadState,
      fromFileUpload.getUploadingFiles
    ),
    getUploadedFiles: createSelector(
      getFileUploadState,
      fromFileUpload.getUploadedFiles
    ),
    getUploadingState: createSelector(
      getFileUploadState,
      fromFileUpload.getUploadingState
    )
  };


