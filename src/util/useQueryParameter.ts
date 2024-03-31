// /exmaple?name=abc -> /example?name=abc&key=value
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

export function useQueryParameter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function addQueryParameter(key: string, value: string) {
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        ...Object.fromEntries(searchParams.entries()),
        [key]: value,
      },
    });

    router.replace(url);
  }

  return {
    addQueryParameter,
    queryObject: Object.fromEntries(searchParams.entries()),
  };
}
