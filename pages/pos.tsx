import React, { useState } from 'react';

// 전화번호 입력 컴포넌트
const PhoneNumberInput: React.FC<{ onSubmit: (phone: string) => void; loading: boolean }> = ({ onSubmit, loading }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 입력, 11자리 제한
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
    setPhone(value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 11) {
      setError('전화번호 11자리를 입력해주세요.');
      return;
    }
    onSubmit(phone);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label htmlFor="phone">전화번호 입력 (숫자만, 11자리)</label>
      <input
        id="phone"
        type="tel"
        value={phone}
        onChange={handleChange}
        placeholder="01012345678"
        disabled={loading}
        style={{ fontSize: 18, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        autoFocus
      />
      {error && <div style={{ color: 'red', fontSize: 14 }}>{error}</div>}
      <button type="submit" disabled={loading} style={{ padding: 10, fontSize: 18, borderRadius: 6, background: '#0070f3', color: '#fff', border: 'none' }}>
        {loading ? '처리 중...' : '확인'}
      </button>
    </form>
  );
};

const PosPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = async (phone: string) => {
    setLoading(true);
    setMessage('');
    try {
      // 1. 고객 체크/등록
      const res1 = await fetch('/api/customers/check-or-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (!res1.ok) throw new Error('고객 등록/조회 실패');
      // 2. 포인트 적립
      const res2 = await fetch('/api/points/accumulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (!res2.ok) throw new Error('포인트 적립 실패');
      // 3. 메시지 발송
      const res3 = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (!res3.ok) throw new Error('메시지 발송 실패');
      setMessage('정상적으로 처리되었습니다! 방문해주셔서 감사합니다.');
    } catch (err: any) {
      setMessage(err.message || '처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32, minHeight: '100vh', background: '#f9f9f9' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>고객 전화번호 입력</h1>
      <PhoneNumberInput onSubmit={handlePhoneSubmit} loading={loading} />
      {message && (
        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 18, color: message.includes('정상적으로') ? 'green' : 'red' }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default PosPage; 