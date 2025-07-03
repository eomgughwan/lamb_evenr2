import type { NextApiRequest, NextApiResponse } from 'next';

// TODO: supabase client import 및 연결
// import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.body;
  if (!phone || typeof phone !== 'string' || phone.length !== 11) {
    return res.status(400).json({ error: '유효한 전화번호를 입력하세요.' });
  }

  // --- 실제 구현 시 Supabase 연동 ---
  // const { data: customer, error } = await supabase
  //   .from('customers')
  //   .select('*')
  //   .eq('phone', phone)
  //   .single();
  // if (error && error.code !== 'PGRST116') {
  //   return res.status(500).json({ error: 'DB 조회 오류' });
  // }
  // if (customer) {
  //   return res.status(200).json({ customer, isNew: false });
  // }
  // // 신규 등록
  // const { data: newCustomer, error: insertError } = await supabase
  //   .from('customers')
  //   .insert([{ phone, visit_count: 0 }])
  //   .single();
  // if (insertError) {
  //   return res.status(500).json({ error: '고객 등록 오류' });
  // }
  // return res.status(201).json({ customer: newCustomer, isNew: true });

  // --- 임시 Mock 응답 ---
  if (phone.startsWith('0101234')) {
    // 기존 고객 예시
    return res.status(200).json({
      customer: {
        id: 1,
        name: '홍길동',
        phone,
        visit_count: 2,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-06-01T00:00:00Z',
      },
      isNew: false,
    });
  } else {
    // 신규 고객 예시
    return res.status(201).json({
      customer: {
        id: 2,
        name: null,
        phone,
        visit_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      isNew: true,
    });
  }
} 