import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const postId = params.postId

    // TODO: 실제 데이터베이스에서 댓글 조회
    // Example: const comments = await db.comments.findMany({ where: { postId } })

    return NextResponse.json({
      success: true,
      comments: [], // 실제 댓글 데이터
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "댓글 조회 중 오류가 발생했습니다" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const postId = params.postId
    const body = await request.json()
    const { text } = body

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ success: false, error: "댓글 내용을 입력해주세요" }, { status: 400 })
    }

    // TODO: 실제 데이터베이스에 댓글 저장
    // Example: const comment = await db.comments.create({
    //   data: { postId, userId: currentUserId, text }
    // })

    const newComment = {
      id: Date.now(),
      username: "User1", // TODO: 실제 로그인한 사용자 정보
      avatar: "/travel-user-avatar.jpg",
      text,
      timeAgo: "방금 전",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      comment: newComment,
      message: "댓글이 작성되었습니다",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "댓글 작성 중 오류가 발생했습니다" }, { status: 500 })
  }
}
