import {
  ContentFocus,
  ProfileOwnedByMe,
  supportsSelfFundedFallback,
  useCreatePost,
  useSelfFundedFallback,
} from '@lens-protocol/react-web';

import { upload } from '../../upload';
import { never } from '../../utils';

export type PostComposerProps = {
  publisher: ProfileOwnedByMe;
};

export function PostComposer({ publisher }: PostComposerProps) {
  const {
    execute: post,
    error: postError,
    isPending: isPosting,
  } = useCreatePost({ publisher, upload });
  const {
    execute: fallback,
    error: fallbackError,
    isPending: fallbackInProgress,
  } = useSelfFundedFallback();

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    const formData = new FormData(form);
    const content = (formData.get('content') as string | null) ?? never();

    const submitd = async (content: string) => {
      const result = await post({
        content,
        contentFocus: ContentFocus.TEXT,
        locale: 'en',
      });
      // const subsidizedAttempt = await post({
      //   content,
      //   contentFocus: ContentFocus.TEXT,
      //   locale: 'en',
      // });
      if (result.isSuccess()) {
        form.reset();
        return;
      }
      const selfFundedAttempt = await fallback(result.postError.fallback);

      if (selfFundedAttempt.isSuccess()) {
        form.reset();
      }
      // if (subsidizedAttempt.isSuccess()) {
      //   form.reset();
      //   return;
      // }

      // if (supportsSelfFundedFallback(subsidizedAttempt.error)) {
      //   const retry = window.confirm(
      //     'We cannot cover the transaction costs at this time. Do you want to retry with your own MATIC?',
      //   );

      //   if (retry) {
      //     const selfFundedAttempt = await fallback(subsidizedAttempt.error.fallback);

      //     if (selfFundedAttempt.isSuccess()) {
      //       form.reset();
      //     }
      //   }
      // }


      // if (supportsSelfFundedFallback(subsidizedAttempt.error)) {
      //   const retry = window.confirm(
      //     'We cannot cover the transaction costs at this time. Do you want to retry with your own MATIC?',
      //   );

      //   if (retry) {
      //     const selfFundedAttempt = await fallback(subsidizedAttempt.error.fallback);

      //     if (selfFundedAttempt.isSuccess()) {
      //       form.reset();
      //     }
      //   }
      // }
    };
  }
  const isPending = isPosting || fallbackInProgress;

  return (
    <form onSubmit={submit}>
      <fieldset>
        <textarea
          name="content"
          minLength={1}
          required
          rows={3}
          placeholder="What's happening?"
          style={{ resize: 'none' }}
          disabled={isPending}
        ></textarea>

        <button type="submit" name="submit" disabled={isPending} style={{ marginRight: '10px' }}>
          Post
        </button>
        <button type="submit" name="submitSign" disabled={isPending} style={{ marginRight: '10px' }}>
          Post With Sign
        </button>
        {!isPosting && postError && <pre>{postError.message}</pre>}
        {!fallbackInProgress && fallbackError && <pre>{fallbackError.message}</pre>}
      </fieldset>
    </form>
  );
}
