import React, { useState } from 'react';

const KEYPAD = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['←', '0', '적립'],
];

const MAX_LENGTH = 11;

const formatPhone = (phone: string) => {
  // 010-1234-5678 형태로 표시
  if (phone.length < 4) return phone;
  if (phone.length < 8) return `${phone.slice(0, 3)}-${phone.slice(3)}`;
  return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7, 11)}`;
};

const PosPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleKeypad = (key: string) => {
    if (loading) return;
    if (key === '←') {
      setPhone((prev) => prev.slice(0, -1));
    } else if (key === '적립') {
      handleSubmit();
    } else if (/^[0-9]$/.test(key) && phone.length < MAX_LENGTH) {
      setPhone((prev) => prev + key);
    }
  };

  const handleSubmit = async () => {
    setMessage('');
    if (phone.length !== 11) {
      setMessage('휴대전화번호 11자리를 입력하세요.');
      return;
    }
    setLoading(true);
    try {
      const res1 = await fetch('/api/customers/check-or-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (!res1.ok) throw new Error('고객 등록/조회 실패');
      const res2 = await fetch('/api/points/accumulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (!res2.ok) throw new Error('포인트 적립 실패');
      const res3 = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (!res3.ok) throw new Error('메시지 발송 실패');
      setMessage('정상적으로 처리되었습니다! 방문해주셔서 감사합니다.');
      setPhone('');
    } catch (err: any) {
      setMessage(err.message || '처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f4f6fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
    }}>
      <div style={{
        width: 700,
        height: 500,
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        display: 'flex',
        overflow: 'hidden',
      }}>
        {/* 좌측 안내 */}
        <div style={{
          width: 200,
          background: '#f8fafc',
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
          borderRight: '1px solid #e5e7eb',
        }}>
          <div style={{
            background: '#eef6ff',
            borderRadius: 12,
            padding: 16,
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 20,
            color: '#2563eb',
            marginBottom: 8,
          }}>
            <span style={{ color: '#2563eb', fontWeight: 900 }}>100 P</span> 적립
          </div>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 16,
            fontSize: 15,
            color: '#222',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
          }}>
            <b>KakaoTalk</b><br />
            입력하신 휴대전화번호로 매장의<br />
            카카오톡 알림톡이 전송됩니다.
          </div>
        </div>
        {/* 우측 키패드+입력 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {/* 상단 안내 */}
          <div style={{
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 600,
            marginTop: 24,
            marginBottom: 8,
          }}>
            휴대전화번호를 눌러주세요.
            <button
              onClick={() => setPhone('')}
              style={{ position: 'absolute', right: 24, top: 16, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}
              aria-label="취소"
              disabled={loading}
            >
              ×
            </button>
          </div>
          {/* 입력된 번호 */}
          <div style={{
            textAlign: 'center',
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: 2,
            margin: '16px 0 8px 0',
            minHeight: 48,
            color: '#222',
          }}>
            {phone ? formatPhone(phone) : <span style={{ color: '#bbb' }}>010-____-____</span>}
          </div>
          {/* 약관 안내 */}
          <div style={{ textAlign: 'center', fontSize: 13, color: '#888', marginBottom: 8 }}>
            이용약관과 개인정보 처리방침에 동의하시면 휴대전화 번호 입력 후 아래 적립 버튼을 터치하세요.
          </div>
          {/* 키패드 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            {KEYPAD.map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                {row.map((key) => (
                  <button
                    key={key}
                    onClick={() => handleKeypad(key)}
                    disabled={
                      loading ||
                      (key === '적립' && phone.length !== 11) ||
                      (key === '0' && phone.length === 0)
                    }
                    style={{
                      width: 64,
                      height: 56,
                      fontSize: key === '적립' ? 20 : 24,
                      fontWeight: key === '적립' ? 700 : 500,
                      borderRadius: 12,
                      border: '1px solid #e5e7eb',
                      background: key === '적립' ? '#2563eb' : '#fff',
                      color: key === '적립' ? '#fff' : '#222',
                      cursor: 'pointer',
                      boxShadow: key === '적립' ? '0 2px 8px #2563eb33' : 'none',
                      transition: 'all 0.1s',
                    }}
                  >
                    {key}
                  </button>
                ))}
              </div>
            ))}
          </div>
          {/* 안내 메시지 */}
          {message && (
            <div style={{ textAlign: 'center', color: message.includes('정상적으로') ? 'green' : 'red', fontSize: 18, margin: '12px 0' }}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PosPage; 