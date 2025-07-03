import type { NextApiRequest, NextApiResponse } from 'next';

// TODO: supabase client import 및 메시지 발송 연동
// import { supabase } from '../../../lib/supabaseClient';
// import { sendKakaoAlimtalk } from '../../../lib/kakao';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.body;
  if (!phone || typeof phone !== 'string' || phone.length !== 11) {
    return res.status(400).json({ error: '유효한 전화번호를 입력하세요.' });
  }

  // --- 실제 구현 시 Supabase에서 고객 정보/혜택 조회 후 메시지 템플릿 생성 ---
  // const { data: customer } = await supabase.from('customers').select('*').eq('phone', phone).single();
  // const { data: latestReward } = await supabase.from('points').select('*').eq('customer_id', customer.id).order('created_at', { ascending: false }).limit(1);
  // const message = ...혜택/방문수에 따라 템플릿 생성...
  // await sendKakaoAlimtalk(phone, message);

  // --- 임시 메시지 예시 ---
  let message = '';
  if (phone.startsWith('0101234')) {
    message = '[방문 감사] 홍길동님, 3회 방문 감사합니다! 단골 혜택(10% 할인 쿠폰)이 지급되었습니다.';
  } else {
    message = '[방문 감사] 첫 방문을 환영합니다! 100P가 적립되었습니다.';
  }

  // 실제 메시지 발송 대신 콘솔 출력
  // eslint-disable-next-line no-console
  console.log(`[알림톡] ${phone}: ${message}`);

  return res.status(200).json({ success: true, phone, message });
} 