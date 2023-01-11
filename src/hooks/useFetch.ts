import { useLayoutEffect, useState } from 'react';

const useFetch = (apiCall:) => {
  const [data, setData] = useState(null);

  useLayoutEffect(() => {
    async function fetch() {
      const { success, data } = await apiCall();

      if (success) {
        setData(data);
      } else {
        setData(null);
      }
    }
    fetch();

    return () => setData(null);
  }, [apiCall]);

  return [data, fetch];
};

export default useFetch;
