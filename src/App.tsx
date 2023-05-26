import { appId, LensConfig, LensProvider, development } from '@lens-protocol/react-web';
import { bindings as wagmiBindings } from '@lens-protocol/wagmi';
import toast, { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import { Home } from './HomePage';
import { AuthenticationPage } from './authentication/AuthenticationPage';
import { Breadcrumbs } from './components/Breadcrumbs';
import { PostList } from './post/PostList';
import { PostDetail } from './post/PostDetail';
import { Header } from './components/header/Header';
import {UseProfile} from './user/UseProfile'
import { UseCreateProfile } from './profiles/UseCreateProfile';
import { UseCreatePost } from './post/UseCreatePost';

const { provider, webSocketProvider } = configureChains([polygonMumbai], [publicProvider()]);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

const lensConfig: LensConfig = {
  // decert-app
  appId: appId('teasr-app-123'),
  sources: [appId('teasr-app-123')],
  bindings: wagmiBindings(),
  environment: development,
};

const toastNotification = (error: Error) => toast.error(error.message);

export function App() {
  return (
    <WagmiConfig client={client}>
      <LensProvider config={lensConfig} onError={toastNotification}>
        <Router>
          <Header />
          <main>
          <Routes>
                <Route path="/" element={<PostList />} />
                <Route path="/useCreatePost" element={<UseCreatePost />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/user/:id" element={<UseProfile />} />
                <Route path="/useCreateProfile" element={<UseCreateProfile />} />
          </Routes>
            <Toaster />
          </main>
        </Router>
      </LensProvider>
    </WagmiConfig>
  );
}
