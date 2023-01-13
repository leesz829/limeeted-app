import { shallowEqual, useSelector } from 'react-redux';

import { RootState } from 'redux/store';

export function useMatches() {
  const matches = useSelector(
    ({ auth }: RootState) => auth?.principal?.match_trgt_list,
    shallowEqual
  );

  return matches;
}
