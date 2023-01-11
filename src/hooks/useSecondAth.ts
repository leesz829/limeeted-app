import { shallowEqual, useSelector } from 'react-redux';

import { RootState } from 'redux/store';

export function useSecondAth() {
  const auth = useSelector(
    ({ auth }: RootState) => auth?.principal?.second_auth_list,
    shallowEqual
  );

  return auth;
}
