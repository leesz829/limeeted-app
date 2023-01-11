import { shallowEqual, useSelector } from 'react-redux';

import { RootState } from 'redux/store';

export function useInterView() {
  const interview = useSelector(
    ({ auth }: RootState) => auth?.principal?.interview_list,
    shallowEqual
  );

  return interview;
}
