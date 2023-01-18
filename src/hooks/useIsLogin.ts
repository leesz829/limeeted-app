import { shallowEqual, useSelector } from 'react-redux';

export function useIsLogedin() {
  const me = useSelector(
    ({ auth }: RootState) => auth?.principal?.mbr_base,
    shallowEqual
  );

  return !!me;
}
