import { shallowEqual, useSelector } from 'react-redux';

export function useIsLogedin() {
  const me = useSelector(({ mbr }: RootState) => mbr.base, shallowEqual);

  return !!me;
}
