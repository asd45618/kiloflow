import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  try {
    const response = await fetch(
      'https://api.odcloud.kr/api/15068730/v1/uddi:2dd1a2cb-6030-48a2-980d-c31f0cc18b6c?page=1&perPage=15&serviceKey=9QBTARbvzv2jtn%2Fkukph5k4O6ArctzriUp6IXMfHSUYt8fmmfoQRjDqpCrZGYhJ4wCubV30EVCm928oL18EL%2BA%3D%3D'
    );
    if (!response.ok) {
      throw new Error('데이터를 불러오는 데 실패했습니다.');
    }
    const data = await response.json();

    let exId = 0;
    const apiData = data.data.map(
      (api: any) => (
        exId++,
        {
          id: exId,
          MET: parseInt(api.MET계수),
          name: api.운동명,
        }
      )
    );

    console.log(apiData);

    return res.status(200).json(apiData);
  } catch (error) {
    console.error('데이터베이스에서 운동 목록을 가져오는 중 에러:', error);
    return res.status(500).json({ message: '내부 서버 오류' });
  }
}
