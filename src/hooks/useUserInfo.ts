import { shallowEqual, useSelector } from 'react-redux';

import { RootState } from 'redux/store';

export function useUserInfo() {
  const me = useSelector(
    ({ auth }: RootState) => auth?.principal?.mbr_base,
    shallowEqual
  );

  return me;
}
