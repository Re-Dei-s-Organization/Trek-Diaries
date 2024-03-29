import AddLocation from "./components/AddLocation";
import Results from "./components/Results";
import React from "react";
import { Metadata } from 'next'
 
type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}
 
export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const query = searchParams.q
 
  return {
    title: `Search: ${query}`,
    description: `Search results for ${query}`,
  }
}

export default function SearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  return (
    <div className="flex gap-1 sm:gap-4 sm:justify-between min-h-screen mt-14 dark:bg-black bg-slate-100">
      <div className="w-2/5 sm:w-1/4 bg-custom_gray mt-2 border"></div>
      <div className="mt-2 bg-custom_gray border w-3/4  sm:w-2/4 box-border space-y-6">
        <div className="flex justify-center mt-8">
          <AddLocation />
        </div>
        <Results query={searchParams.q as string}/>
      </div>
      <div className="w-2/5 sm:w-1/4 bg-custom_gray border mt-2"></div>
    </div>
  );
}
