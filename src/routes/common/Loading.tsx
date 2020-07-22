import React from 'react';
import { LoadingState } from 'features/asyncSlice.util'

interface LoadingProps {
    loadingStates: LoadingState[],
    children: React.ReactElement | React.ReactElement[],
}

export default function Loading ({loadingStates, children}: LoadingProps) {

    const hasFailure = loadingStates.some(state => state === LoadingState.Failed);
    const isLoading = loadingStates.some(state => state === LoadingState.Loading);

    return (
    <section>
        {
            hasFailure && <h3>An error occured loading some ressources</h3>
        }
        {
            isLoading && <h3>Currently loading...</h3>
        }
        {
            !isLoading && !hasFailure && <>{children}</>
        }
    </section>
    );
};