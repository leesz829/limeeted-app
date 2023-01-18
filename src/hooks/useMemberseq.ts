import { shallowEqual, useSelector } from 'react-redux';

import { RootState } from 'redux/store';

export function useMemberseq() {
  const seq = useSelector(
    ({ auth }: RootState) => auth?.principal?.mbr_base?.member_seq,
    shallowEqual
  );

  return seq;
}
