import { ActionReducerMapBuilder, AsyncThunk, EntityAdapter, EntityState } from '@reduxjs/toolkit'

export enum LoadingState {
    Idle,
    Loading,
    Succeeded,
    Failed,
}

export interface AsyncInitialState extends EntityState<unknown> {
    status: LoadingState,
    error: null | string,
}

export const adapterInitialState = {
    status: LoadingState.Idle,
    error: null,
}

export const buildAsyncReducer = 
(asyncThunk: AsyncThunk<any, void, {}>) =>
(adapter: EntityAdapter<any>) => 
(builder: ActionReducerMapBuilder<AsyncInitialState>) => 
{
    builder.addCase(asyncThunk.fulfilled, (state, {payload}) => {
        state.status = LoadingState.Succeeded;
        state.error = null;
        adapter.setAll(state, payload);
    });

    builder.addCase(asyncThunk.pending, (state, {payload}) => {
        state.status = LoadingState.Loading;
    });

    builder.addCase(asyncThunk.rejected, (state, {payload}) => {
        state.status = LoadingState.Failed;
        state.error = payload as string;
    });
}