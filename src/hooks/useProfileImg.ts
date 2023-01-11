import { shallowEqual, useSelector } from 'react-redux';

import { RootState } from 'redux/store';

export function useProfileImg() {
  const interview = useSelector(
    ({ auth }: RootState) => auth?.principal?.img_list,
    shallowEqual
  );

  return interview || [];
}
