import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // TODO: 실제 사용자의 여행 목록 조회
    // Example: const travels = await db.travels.findMany({
    //   where: { userId: currentUserId }
    // })

    return NextResponse.json({
      success: true,
      travels: [], // 실제 여행 데이터
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "여행 목록 조회 중 오류가 발생했습니다" }, { status: 500 })
  }
}
