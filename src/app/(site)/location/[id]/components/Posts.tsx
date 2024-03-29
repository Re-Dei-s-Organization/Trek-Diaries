"use client";
import LoadingPost from "@/app/(site)/components/LoadingPost/LoadingPost";
import ViewPost from "../../../components/viewPost/viewPost";
import { useEffect } from "react";
import { ReturnPost } from "@/lib/zodSchema/dbTypes";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { CONSTANTS } from "@/lib/constants";
import { useToast } from "@/components/ui/use-toast";

interface Response {
  posts: Array<ReturnPost>;
  next: string;
}

export default function Posts({ locationId, userId }: { locationId: string, userId: string | undefined }) {
  const {toast} = useToast()
  const { ref, inView } = useInView()
  const { data, status, fetchNextPage } = useInfiniteQuery({
    queryKey: ["posts", locationId],
    queryFn: async ({ pageParam }: { pageParam: string }) => {
      try {
        const res = await fetch(
          `/api/location/post?locationId=${locationId}&last=${pageParam}&limit=${CONSTANTS.POSTS_PER_SCROLL}`,
          {
            cache: "no-store",
            method: "GET",
          }
        );
        const status = res.status;
        if (status === 200) {
          const data: Response = JSON.parse(await res.json());
          return data;
        } else if (status === 400) {
          toast({
            className: "fixed rounded-md top-2 left-[50%] flex max-h-screen w-full translate-x-[-50%] p-4 sm:right-0 sm:flex-col md:max-w-[420px]",
            title: "Invalid Request",
            description: "Please try again with valid parameters."
          })
          return;
        } else {
          toast({
            variant: "destructive",
            className: "fixed rounded-md top-2 left-[50%] flex max-h-screen w-full translate-x-[-50%] p-4 sm:right-0 sm:flex-col md:max-w-[420px]",
            description: "Something went wrong. Please try again later",
          })
          return;
        }
      } catch (error) {
        console.error(error);
        alert(error);
        return;
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage === undefined) {
        return null;
      } else {
        return lastPage.next;
      }
    },
    initialPageParam: "00000000-0000-0000-0000-000000000000",
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className="PostBody">
      {status === "pending" ? (
        <LoadingPost />
      ) : status === "error" ? (
        <h1>Something went wrong. Please try again later</h1>
      ) : (
        status === "success" &&
        data.pages.map((page, i) => {
          if (page === undefined) {
            return <h1 key={i}>Not Found!</h1>;
          } else if (page.posts.length === 0 && i === 0) {
            return <h1 key={i} className="text-center">No Posts Found!</h1>;
          } {
            return page.posts.map((post, i) => (
              <ViewPost
                userId={userId}
                key={i}
                id={post.id}
                registered_time={ post.registered_time }
                location={{
                  id: post.location_id,
                  address: post.location_address,
                }}
                description={post.description}
                likes={post.likes_count}
                imageURL={post.picture_url}
                owner={{
                  id: post.owner_id,
                  name: post.owner_name,
                }}
                rating={post.rating || 0}
              />
            ));
          }
        })
      )}

      <div ref={ref}></div>
    </div>
  );
}