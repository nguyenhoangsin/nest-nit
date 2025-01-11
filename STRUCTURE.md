```
src/
├── app.module.ts         # Root module của ứng dụng
├── main.ts               # Entry point (bootstrap)
├── common/               # Thư mục chứa các mã nguồn dùng chung
│   ├── decorators/       # Custom decorators
│   ├── filters/          # Exception filters
│   ├── interceptors/     # Interceptors
│   ├── guards/           # Guards (Authorization, Authentication)
│   ├── pipes/            # Pipes (Validation, Transformation)
│   ├── dtos/             # DTOs (Data Transfer Objects)
│   ├── interfaces/       # Interfaces dùng chung
│   └── utils/            # Các hàm helper hoặc utils
├── config/               # Cấu hình ứng dụng
│   ├── app.config.ts     # Cấu hình chính
│   └── ...               # Các tệp cấu hình khác (database, mail, etc.)
├── modules/              # Các module chính trong ứng dụng
│   ├── auth/             # Module Authentication
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── strategies/   # Auth strategies (JWT, Passport, etc.)
│   │   └── dtos/         # DTOs riêng cho auth
│   ├── users/            # Module Users
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── dtos/         # DTOs riêng cho users
│   └── ...               # Các module khác
├── database/             # Database module (ORM, Entities, Migrations)
│   ├── entities/         # Entities/Models
│   ├── migrations/       # Migration files
│   └── database.module.ts
├── middleware/           # Các middleware tùy chỉnh
├── tests/                # Test cases
│   ├── unit/             # Unit tests
│   └── e2e/              # End-to-end tests
└── shared/               # Các module hoặc thành phần tái sử dụng
    └── logger/           # Custom logger module (ví dụ: Winston)
```

### Chi tiết từng phần

1. app.module.ts
   Là module gốc, nơi kết hợp các module con trong ứng dụng.

2. main.ts
   Điểm khởi chạy ứng dụng, nơi cấu hình global (e.g., middleware, pipes, guards).

3. common/
   Chứa các mã nguồn dùng chung, không phụ thuộc vào module cụ thể nào:

- Decorators: Các decorator tùy chỉnh.
- Filters: Xử lý exception.
- Interceptors: Điều chỉnh logic trước hoặc sau khi xử lý request.
- Guards: Bảo vệ route hoặc module (ví dụ: kiểm tra quyền truy cập).
- Pipes: Validation hoặc chuyển đổi dữ liệu.

4. config/
   Lưu trữ các tệp cấu hình ứng dụng như kết nối database, cài đặt JWT, hoặc các biến môi trường.

5. modules/
   Mỗi module đại diện cho một feature hoặc domain cụ thể.
   Ví dụ: Module users, auth hay bất kỳ domain nào liên quan.

6. database/
   Quản lý cấu trúc dữ liệu, bao gồm:

- Các entity cho TypeORM, Sequelize, hoặc Prisma.
- Các file migration.

7. middleware/
   Các middleware tùy chỉnh như logging request hoặc xử lý CORS.

8. tests/
   Chứa các tệp unit test và e2e test để đảm bảo ứng dụng hoạt động đúng.

9. shared/
   Các thành phần có thể tái sử dụng trong nhiều module, như logger, email service.
