import {
  PublicationId,
  publicationId,
  useComments,
  usePublication,
} from '@lens-protocol/react-web';
import { useParams } from 'react-router-dom';
import { ErrorMessage } from '../components/error/ErrorMessage';
import { Loading } from '../components/loading/Loading';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { PublicationCard } from './components/PublicationCard';

type CommentsProps = {
  commentsOf: PublicationId;
};

function Comments({ commentsOf }: CommentsProps) {
  const {
    data: comments,
    error,
    loading,
    hasMore,
    observeRef,
  } = useInfiniteScroll(useComments({ commentsOf }));

  if (loading) return <Loading />;

  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {comments.map((comment) => (
        <PublicationCard key={comment.id} publication={comment} />
      ))}
      {hasMore && <p ref={observeRef}>Loading more...</p>}
    </div>
  );
}

export function PostDetail() {
  const { id } = useParams();
  const {
    data: publication,
    error,
    loading,
  } = usePublication({ publicationId: publicationId(id!) });

  if (loading) return <Loading />;

  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <PublicationCard publication={publication} />
      <h3>Comments</h3>
      <Comments commentsOf={publication.id} />
    </div>
  );
}
