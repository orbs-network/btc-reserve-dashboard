"use client";

import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { LoginLayout } from "./layouts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QUERIES } from "./consts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});


const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
})

persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 5 * 60, // 60 minutes cache duration
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      return [QUERIES.BTC_PRICE, QUERIES.BTC_HISTORY, QUERIES.BTC_PRICE_CHANGED].includes(query.queryKey[0] as QUERIES)
    }
  }
  
  
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
      >
        <LoginLayout>{children}</LoginLayout>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
