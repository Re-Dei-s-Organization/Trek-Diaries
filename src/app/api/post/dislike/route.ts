import { NextRequest, NextResponse } from "next/server";
import { likePostSchema, LikePost } from "@/lib/zodSchema/likePost";
import { ServerRuntime } from "next";
import { dislikePost, isPostLiked, postExists } from "@/lib/db/actions";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const data: LikePost = likePostSchema.parse(await req.json());

    if (!(await postExists(data.postId))) {
      return NextResponse.json("Post does not exist", { status: 404 });
    }

    if (!(await isPostLiked(data))) {
      return NextResponse.json("Post already disliked", { status: 409 });
    }

    const likes: number = await dislikePost(data);
    return NextResponse.json(JSON.stringify({ likes }), { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json("Invalid request", { status: 400 });
    }
    console.error(error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
} 