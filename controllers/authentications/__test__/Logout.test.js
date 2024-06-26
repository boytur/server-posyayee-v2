const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app, server } = require('../../../server');


describe('DELETE /api/auth/logout', () => {
    it('should return 401 if not logged in', async () => {
        const response = await request(app)
            .delete('/api/auth/logout')
            .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่!');
    });

    it('should return 200 and delete cookies if logged in', async () => {
        const user = {
            "user_id": "3",
            "user_acc_verify": true,
            "user_fname": "แสงจันทร์",
            "user_lname": "แสนคราม",
            "user_phone": "0990717548",
            "user_role": "owner",
            "user_email": null,
            "user_image": null,
            "store_id": "2",
            "store": {
                "store_id": "2",
                "store_name": "ร้านค้าแม่ยาหยี",
                "store_remaining": 28,
                "store_address": "85 หมู่ 11 ตำบลนาเกษม อำเภอ ทุ่งศรีอุดม จังหวัด อุบลราชธานี 34160",
                "store_phone": "0990717548",
                "store_taxid": null,
                "store_image": null,
                "store_active": true,
                "package_id": 1
            },
            "setting": {
                "stt_id": "1",
                "stt_peep_sound": true,
                "stt_alway_print": false,
                "stt_out_stock_value": 5,
                "createdAt": "2024-05-05T00:00:00.000Z",
                "updatedAt": "2024-05-05T00:00:00.000Z",
                "store_id": "2"
            },
            "package": {
                "package_id": 1,
                "package_name": "ฟรี"
            }
        };

        const refreshToken = jwt.sign({ user }, process.env.JWT_REFRESH, { expiresIn: '30d' });
        const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '15m' });

        const response = await request(app)
            .delete('/api/auth/logout')
            .set('Cookie', `refresh_token=${refreshToken}; access_token=${accessToken}`)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Cookies deleted successfully');
    });
});

beforeAll(async () => {
    server.listen(4000, () => {
        console.log(`POSYAYEE-V2 app listening on port 4000`);
    });
});

afterAll(async () => {
    server.close();
});