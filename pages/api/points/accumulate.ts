import type { NextApiRequest, NextApiResponse } from 'next';

// TODO: supabase client import 및 연결
// import { supabase } from '../../../lib/supabaseClient';

// 방문 횟수에 따른 레벨 및 혜택 예시
const getLevelAndReward = (visitCount: number) => {
  if (visitCount === 1) return { level: '신규', reward: '100P 적립' };
  if (visitCount === 3) return { level: '단골', reward: '10% 할인 쿠폰' };
  if (visitCount === 5) return { level: 'VIP', reward: '사이드메뉴 무료 쿠폰' };
  return { level: null, reward: null };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.body;
  if (!phone || typeof phone !== 'string' || phone.length !== 11) {
    return res.status(400).json({ error: '유효한 전화번호를 입력하세요.' });
  }

  // --- 실제 구현 시 Supabase 연동 ---
  // 1. 고객 정보 조회 (phone)
  // 2. visit_count +1 업데이트
  // 3. 포인트/쿠폰 지급 내역 기록
  // const { data: customer, error } = await supabase
  //   .from('customers')
  //   .select('*')
  //   .eq('phone', phone)
  //   .single();
  // if (error || !customer) return res.status(404).json({ error: '고객 정보 없음' });
  // const newVisitCount = customer.visit_count + 1;
  // await supabase.from('customers').update({ visit_count: newVisitCount }).eq('id', customer.id);
  // const { level, reward } = getLevelAndReward(newVisitCount);
  // if (reward) { ...포인트/쿠폰 지급... }

  // --- 임시 Mock 로직 ---
  // 기존 고객: 0101234... → visit_count 2 → 3회차 방문(단골)
  // 신규 고객: 그 외 → visit_count 0 → 1회차 방문(신규)
  let visitCount = 0;
  if (phone.startsWith('0101234')) {
    visitCount = 2;
  }
  visitCount += 1;
  const { level, reward } = getLevelAndReward(visitCount);

  return res.status(200).json({
    phone,
    visit_count: visitCount,
    level,
    reward,
    message: reward
      ? `${level} 고객 혜택: ${reward}`
      : `${visitCount}회 방문, 적립/쿠폰 없음`,
  });
} 