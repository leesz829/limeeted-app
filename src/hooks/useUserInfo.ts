import { shallowEqual, useSelector } from 'react-redux';

import { RootState } from 'redux/store';

export function useUserInfo() {
  const me = useSelector(({ mbr }: RootState) => mbr.base, shallowEqual);

  return me;
}
