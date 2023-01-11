import { shallowEqual, useSelector } from 'react-redux';

import { RootState } from 'redux/store';

export function useInterView() {
  const likes = useSelector(
    ({ auth }: RootState) => auth?.principal?.res_like_list,
    shallowEqual
  );

  return likes;
}
