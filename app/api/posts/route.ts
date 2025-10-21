import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const hashtag = searchParams.get("hashtag")

    // TODO: 실제 데이터베이스에서 게시물 조회
    // Example: const posts = await db.posts.findMany({
    //   where: hashtag ? { hashtags: { has: hashtag } } : {}
    // })

    return NextResponse.json({
      success: true,
      posts: [], // 실제 게시물 데이터
      hashtag,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "게시물 조회 중 오류가 발생했습니다" }, { status: 500 })
  }
}
