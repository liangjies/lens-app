import { ProfileId, useFeed, useRecentPosts } from '@lens-protocol/react-web';

import { UnauthenticatedFallback } from '../components/UnauthenticatedFallback';
import { WhenLoggedInWithProfile } from '../components/auth';
import { ErrorMessage } from '../components/error/ErrorMessage';
import { Loading } from '../components/loading/Loading';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { PostComposer } from './components/PostComposer';
import { PublicationCard } from './components/PublicationCard';


export function UseCreatePost() {
  return (
    <div>
      <WhenLoggedInWithProfile>
        {({ profile }) => (
          <>
            <PostComposer publisher={profile} />
          </>
         )}
      </WhenLoggedInWithProfile>
      <UnauthenticatedFallback message="Log in to create a post." />
    </div>
  );
}
