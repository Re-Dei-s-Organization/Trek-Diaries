"use client";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
// import algoliasearch from "algoliasearch/lite";
// import { getAlgoliaApiKey, getAlgoliaAppId } from "@/lib/secrets";

// const searchClient = algoliasearch(getAlgoliaAppId(), getAlgoliaApiKey());

export default function SearchInput() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();

    /* encode the search query to uri */
    const encodedQuery = encodeURI(searchQuery);

    router.push(`/search?q=${encodedQuery}`);

    if (pathname.includes("/search")) {
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex justify-center items-center w-96 gap-2"
    >
      <Input
        className="text-center shadow-md"
        placeholder="Search Location"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        type="submit"
        className="w-7 h-7 hover:text-indigo-400 cursor-pointer "
      >
        <Search />
      </button>
    </form>
  );
}
