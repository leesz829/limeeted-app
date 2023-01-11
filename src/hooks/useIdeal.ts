import { shallowEqual, useSelector } from 'react-redux';

import { RootState } from 'redux/store';

export function useIdeal() {
  const ideal = useSelector(
    ({ auth }: RootState) => auth?.principal?.ideal_type,
    shallowEqual
  );

  return ideal;
}
