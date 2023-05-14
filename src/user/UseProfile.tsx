import { Profile, ProfileId, useProfile } from '@lens-protocol/react-web';
import { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorMessage } from '../components/error/ErrorMessage';
import { Loading } from '../components/loading/Loading';
import { ProfileCard } from './components/ProfileCard';
import { ProfileSelector } from './components/ProfileSelector';

type ProfileByProps = {
  profileId: ProfileId;
};

function ProfileBy({ profileId }: ProfileByProps) {
  const { data: profile, error, loading } = useProfile({ profileId });

  if (loading) return <Loading />;

  if (error) return <ErrorMessage error={error} />;

  return <ProfileCard profile={profile} />;
}

export function UseProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { id } = useParams();
  return (
    <>
          <ProfileSelector onProfileSelected={(p) => setProfile(p)} />

      {profile && <ProfileBy profileId={profile.id} />}
    </>
  );
}
