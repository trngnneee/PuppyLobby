-- ================================
-- Đồ chơi nhựa màu sắc có kèn bíp bíp cho chó mèo - đồ chơi gặm nhấm phát ra âm thanh cho chó mèo
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Đồ chơi nhựa màu sắc có kèn bíp bíp cho chó mèo - đồ chơi gặm nhấm phát ra âm thanh cho chó mèo',
    30000,
    '2023-03-20',
    '2025-03-16',
    '2027-03-19',
    104,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765682945/PuppyLobby/ujbmfg1heauvt79wmwxh.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765682948/PuppyLobby/prunmm1j9ra2wwhyoppr.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765682951/PuppyLobby/oyege4fo8nrzn8kee9ll.jpg' FROM new_product
)
,
img_3 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765682954/PuppyLobby/q2r68apegeakhvppskaw.jpg' FROM new_product
)
,
img_4 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765682956/PuppyLobby/nycihkyklycegl8ibpni.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'M', 'Tím', 'Silicone' FROM new_product;

-- ================================
-- Đồ Chơi Bóng Dây Thừng Cầm Tay Hình Quả Cầu Cho Chó
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Đồ Chơi Bóng Dây Thừng Cầm Tay Hình Quả Cầu Cho Chó',
    39000,
    '2023-09-18',
    '2025-07-31',
    '2026-07-21',
    61,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765682959/PuppyLobby/lfahulcff2bbvevrmwzb.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765682962/PuppyLobby/ifa9pgxhtnsvb4pbd7en.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765682965/PuppyLobby/e9g35ii3gwhcacmkcpon.jpg' FROM new_product
)
,
img_3 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765682967/PuppyLobby/fvkfkcqpkwoc8rxvf1du.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'M', 'Nâu', 'Hợp kim' FROM new_product;

-- ================================
-- Bóng Đồ Chơi Bóng Cao Su Cho Chó Hình Quả Tạ Kèm Dây Thừng
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Bóng Đồ Chơi Bóng Cao Su Cho Chó Hình Quả Tạ Kèm Dây Thừng',
    39000,
    '2022-10-31',
    '2024-07-17',
    '2026-11-23',
    138,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765682970/PuppyLobby/kjcx4ccaol62wu76dv2x.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765682973/PuppyLobby/rpjnxd2zpbtk2nm6f4k4.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765682976/PuppyLobby/uxaalzy2bqnwmchkfos2.jpg' FROM new_product
)
,
img_3 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765682979/PuppyLobby/tudd70a4qlud8ljrclwp.jpg' FROM new_product
)
,
img_4 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765682981/PuppyLobby/vw8kqot4djknnxp1zuyr.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'M', 'Đỏ', 'Silicone' FROM new_product;

