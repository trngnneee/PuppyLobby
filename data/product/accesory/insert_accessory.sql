-- ================================
-- Colorful plastic toy with beeping horn for dogs and cats - sound-emitting chewing toy for dogs and cats
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Colorful plastic toy with beeping horn for dogs and cats - sound-emitting chewing toy for dogs and cats',
    30000,
    '2023-05-11',
    '2025-01-16',
    '2026-02-19',
    140,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771401/PuppyLobby/i9btbx9xhxrgyjenovch.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771403/PuppyLobby/xhsk1qkk36i3e63fikq7.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771406/PuppyLobby/o2km20pplrlozpi0i6am.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'S', 'Green', 'Alloy' FROM new_product;

-- ================================
-- Ball Handheld Rope Ball Toy for Dogs
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Ball Handheld Rope Ball Toy for Dogs',
    39000,
    '2023-02-04',
    '2024-02-22',
    '2026-04-10',
    118,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771410/PuppyLobby/kwnwte1zrbhqa092mgjl.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771413/PuppyLobby/xypoq6pelnjotxveuaxd.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771417/PuppyLobby/vvasw3vznyezgvoafhde.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'M', 'Yellow', 'Silicone' FROM new_product;

-- ================================
-- Dumbbell-shaped Rubber Dog Ball Toy Ball with Rope
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Dumbbell-shaped Rubber Dog Ball Toy Ball with Rope',
    39000,
    '2024-03-21',
    '2025-09-21',
    '2026-04-18',
    160,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771423/PuppyLobby/rqpopw8vxrohodkzdwfn.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771427/PuppyLobby/alcukoe4zo69iy58jh1o.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771430/PuppyLobby/dt30h7zmqekjlmrgobot.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'M', 'Blue', 'Synthetic Fabric' FROM new_product;

-- ================================
-- Dumbbell Spiked Rubber Ball Toy with Trumpet for Dogs and Cats
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Dumbbell Spiked Rubber Ball Toy with Trumpet for Dogs and Cats',
    25000,
    '2024-07-12',
    '2025-05-27',
    '2028-08-26',
    75,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771435/PuppyLobby/p6bxi3muztnfpcgulcq3.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771438/PuppyLobby/uryaw1w6owswp5brquvk.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771440/PuppyLobby/gxp5ug3ji42bvnmqivq4.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'M', 'Purple', 'Synthetic Fabric' FROM new_product;

-- ================================
-- Braided Rope Slipper Toy, Teeth Cleaning Chew Toy for Dogs
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Braided Rope Slipper Toy, Teeth Cleaning Chew Toy for Dogs',
    38000,
    '2024-02-18',
    '2024-01-27',
    '2026-10-02',
    94,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771446/PuppyLobby/rfi2pwa8eqinaxnauwnu.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771449/PuppyLobby/ifwuujlxzp5hblqgm5m3.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771452/PuppyLobby/bvs2axlcs6d0owqadjcp.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'S', 'Orange', 'Silicone' FROM new_product;

-- ================================
-- Ice Cream Cone Shaped Rubber Dog Chew Toy with Trumpet
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Ice Cream Cone Shaped Rubber Dog Chew Toy with Trumpet',
    25000,
    '2024-11-21',
    '2024-04-24',
    '2027-07-11',
    123,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771457/PuppyLobby/heusrpybkj7ibzrdatv2.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771460/PuppyLobby/j741jpjfwzgoggocdbby.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771463/PuppyLobby/f9ttkm3n5viak6icw33w.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'M', 'Yellow', 'ABS Plastic' FROM new_product;

-- ================================
-- Chuông Lục Lạc Inox Mạ Vàng Đeo Cổ Cho Chó Mèo
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Chuông Lục Lạc Inox Mạ Vàng Đeo Cổ Cho Chó Mèo',
    9000,
    '2024-05-08',
    '2024-12-19',
    '2028-01-31',
    107,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771469/PuppyLobby/lcxyfkckrckkoukv316u.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771472/PuppyLobby/xtab2lxosirwwa5pusio.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771474/PuppyLobby/mpy5xpy3h703en85vhsj.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'L', 'Gray', 'Synthetic Fabric' FROM new_product;

-- ================================
-- Bell to Train Dogs and Cats to Beg to Go Toilet and Beg to Go Outside
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Bell to Train Dogs and Cats to Beg to Go Toilet and Beg to Go Outside',
    38000,
    '2024-01-02',
    '2025-05-11',
    '2026-11-26',
    183,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771485/PuppyLobby/eln1xgvuhwcgo1p0k5w7.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771487/PuppyLobby/zv9w2e9wsi0bykvfxucu.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771489/PuppyLobby/bqresbw8pyxsviolhqmq.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'L', 'Black', 'ABS Plastic' FROM new_product;

-- ================================
-- Braided Rope Slipper Toy, Teeth Cleaning Chew Toy for Dogs
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Braided Rope Slipper Toy, Teeth Cleaning Chew Toy for Dogs',
    35000,
    '2022-06-30',
    '2024-06-30',
    '2028-03-02',
    87,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771494/PuppyLobby/egan8xk2vrfzhtejbfbl.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771497/PuppyLobby/khncnfqhzt2grphq5pva.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771500/PuppyLobby/iagt1m2rt1kikodxffax.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'L', 'Blue', 'ABS Plastic' FROM new_product;

-- ================================
-- Wheel-Shaped Chewing Toy with Horn for Dogs
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Wheel-Shaped Chewing Toy with Horn for Dogs',
    25000,
    '2024-10-09',
    '2024-05-21',
    '2026-06-25',
    191,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771505/PuppyLobby/d4r8ascshfbklpluf7t6.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771512/PuppyLobby/n7bol6appi2c2jyc5tz4.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771517/PuppyLobby/ubuv7cazkwlefdb1k3fu.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'L', 'Blue', 'ABS Plastic' FROM new_product;

-- ================================
-- Lobster Shaped Rubber Bite Toy for Dogs and Cats
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Lobster Shaped Rubber Bite Toy for Dogs and Cats',
    25000,
    '2022-05-18',
    '2025-10-16',
    '2028-03-22',
    153,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771522/PuppyLobby/qcad5mu1cwgrzwoyr3yp.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771525/PuppyLobby/qkdte46wdifkln4e1zx3.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771530/PuppyLobby/vslay2xcts85obanrehv.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'M', 'Green', 'Stainless Steel' FROM new_product;

-- ================================
-- Basketball Dumbbell Rubber Chewing Toy with Trumpet for Dogs and Cats
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Basketball Dumbbell Rubber Chewing Toy with Trumpet for Dogs and Cats',
    33000,
    '2024-06-29',
    '2025-05-03',
    '2027-04-05',
    176,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771535/PuppyLobby/zk0sclaeajmlnkijjewk.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771537/PuppyLobby/azspgnbbxaz9gnqrzons.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771540/PuppyLobby/umstbvhmvxcymp2fh2s8.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'S', 'Orange', 'Silicone' FROM new_product;

-- ================================
-- Footprint-shaped rubber ball toy for dogs and cats with trumpet
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Footprint-shaped rubber ball toy for dogs and cats with trumpet',
    25000,
    '2024-07-01',
    '2025-09-12',
    '2026-04-04',
    157,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771544/PuppyLobby/bcnj6snruk9yafwzlgfy.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771546/PuppyLobby/xr9l3lnsjxswrngwovy8.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771548/PuppyLobby/bcdbe6pevpipjvepbbe0.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'S', 'Red', 'Synthetic Fabric' FROM new_product;

-- ================================
-- Slipper-shaped rubber chew toy with squeaking trumpet for dogs and cats
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Slipper-shaped rubber chew toy with squeaking trumpet for dogs and cats',
    25000,
    '2023-01-31',
    '2025-02-07',
    '2026-08-10',
    70,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771553/PuppyLobby/njgsjt5d3jfliujzc8c1.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771555/PuppyLobby/teqidusmlat4d3za1vco.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771558/PuppyLobby/mzsyektyr81gf6tmn3pn.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'S', 'Pink', 'Silicone' FROM new_product;

-- ================================
-- Spiked Rubber Ball Toy with Flashing Lights and Horn
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Spiked Rubber Ball Toy with Flashing Lights and Horn',
    25000,
    '2022-03-13',
    '2024-05-06',
    '2027-12-21',
    192,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771564/PuppyLobby/dburgpmw60kbhq8knnex.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771568/PuppyLobby/lpldjhe8ptyx6srj68vr.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771571/PuppyLobby/umdxdwttachjrhuuvpor.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'L', 'Pink', 'Stainless Steel' FROM new_product;

-- ================================
-- Flying Disc Toy for Dog and Cat Training
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Flying Disc Toy for Dog and Cat Training',
    25000,
    '2024-02-07',
    '2025-12-05',
    '2028-10-17',
    194,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771576/PuppyLobby/vqdfn5vijsjzko5y6mhv.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771579/PuppyLobby/nfnqe6szw5nb3hawe6jp.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771581/PuppyLobby/yp2fzsthen23cvqtdxce.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'M', 'Red', 'Alloy' FROM new_product;

-- ================================
-- Dog Face Rubber Ball Toy for Dogs and Cats with Squeaky Trumpet
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Dog Face Rubber Ball Toy for Dogs and Cats with Squeaky Trumpet',
    25000,
    '2022-12-13',
    '2024-01-03',
    '2026-12-12',
    71,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771586/PuppyLobby/e6k1jdslpuzzwf8udkgn.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771591/PuppyLobby/sgcfowgv7umnvx0sbgbl.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771595/PuppyLobby/cl8y3lkk5v4f5bmdpibd.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'M', 'Black', 'Alloy' FROM new_product;

-- ================================
-- Dog Toy with Red and Blue Head Chicken with Trumpet
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Dog Toy with Red and Blue Head Chicken with Trumpet',
    25000,
    '2023-12-29',
    '2025-08-30',
    '2028-06-24',
    131,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771600/PuppyLobby/dfcrijmgtpby0ya0bn2n.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771602/PuppyLobby/gbjput6k76ahnlmxa00j.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771608/PuppyLobby/zxsnssenorxucbqvqis1.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'L', 'Black', 'Synthetic Fabric' FROM new_product;

-- ================================
-- Rope Toy with 2 Round Heads for Dogs and Cats 37cm Long
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Rope Toy with 2 Round Heads for Dogs and Cats 37cm Long',
    55000,
    '2022-12-28',
    '2024-05-10',
    '2026-10-12',
    101,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771612/PuppyLobby/bp0bnrfxvuzf75ditor8.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771615/PuppyLobby/fmqlsqhaiukcwo3kn3dp.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771618/PuppyLobby/fygon7zez0mmawrzukol.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'M', 'Green', 'Synthetic Fabric' FROM new_product;

-- ================================
-- Squeaking Rooster Toy with Whistle for Dogs and Cats of Many Sizes
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Squeaking Rooster Toy with Whistle for Dogs and Cats of Many Sizes',
    19000,
    '2022-10-02',
    '2024-03-28',
    '2026-09-15',
    126,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771623/PuppyLobby/ctfoix5eusnel8o4mg05.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771626/PuppyLobby/qk6qrlcf5gfxxwy39dte.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771629/PuppyLobby/rmskqtc8f4qjvzdevlk8.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'M', 'Black', 'Silicone' FROM new_product;

-- ================================
-- Rope carrot toy for dogs - Genyo toy 210
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Rope carrot toy for dogs - Genyo toy 210',
    21000,
    '2022-10-26',
    '2024-10-02',
    '2026-07-19',
    178,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771632/PuppyLobby/jdir0lzuyxxpb02tqofn.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771635/PuppyLobby/yg3x2hu5ixbquyx44zuz.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771639/PuppyLobby/hj00esffu51o8xh8luay.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'L', 'Pink', 'Synthetic Fabric' FROM new_product;

-- ================================
-- Chicken thighs are cute stuffed toys for dogs
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Chicken thighs are cute stuffed toys for dogs',
    51999,
    '2022-11-28',
    '2025-12-11',
    '2026-05-18',
    78,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771645/PuppyLobby/a6tbrshq2r49v7ekfjrn.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771647/PuppyLobby/urlm3zje6znlepwtufkk.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771649/PuppyLobby/ftg3hn8d2qivjmpr0bui.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'L', 'Black', 'Silicone' FROM new_product;

-- ================================
-- Dog squeaky ball toy (random color)
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Dog squeaky ball toy (random color)',
    50000,
    '2022-07-26',
    '2025-08-27',
    '2026-02-05',
    92,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771654/PuppyLobby/f59lz9qyyvhgejggnzmi.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771656/PuppyLobby/zhjdkd1cmifk9xtkle7y.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771659/PuppyLobby/im2rxz2wl1jyafb5fnt4.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'S', 'Purple', 'Alloy' FROM new_product;

-- ================================
-- Squeaky chew toy for dogs and cats
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Squeaky chew toy for dogs and cats',
    25000,
    '2023-06-08',
    '2025-11-23',
    '2027-08-01',
    68,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771668/PuppyLobby/izh20zry49bdfzxbtemz.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771670/PuppyLobby/gh5hz27ntesou4ihjpc2.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771672/PuppyLobby/m2eyroothfuunsa9ujoc.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'S', 'Black', 'Synthetic Fabric' FROM new_product;

-- ================================
-- Chewing bone dog toy (Random color)
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Chewing bone dog toy (Random color)',
    50000,
    '2022-11-30',
    '2025-03-22',
    '2026-05-18',
    174,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771676/PuppyLobby/ed76mwg0guombdddsajo.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771678/PuppyLobby/zgjmzskycfrhsxtvb8tn.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771680/PuppyLobby/plbbcdjxit790wq4tcro.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'S', 'Yellow', 'Stainless Steel' FROM new_product;

-- ================================
-- Combo of 2 Toys for Small Dogs
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Combo of 2 Toys for Small Dogs',
    100000,
    '2024-11-16',
    '2025-02-27',
    '2027-10-12',
    114,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771683/PuppyLobby/qhxi2bcqr47dvirvtmep.jpg' FROM new_product
)
,
img_1 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771687/PuppyLobby/o6efm9ssukfmmjfrursf.jpg' FROM new_product
)
,
img_2 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771689/PuppyLobby/advcpnwvpspsgs4iwjnr.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'M', 'Blue', 'ABS Plastic' FROM new_product;

-- ================================
-- Kun Miu Chicken Toy (7 x 31 cm)
WITH new_product AS (
  INSERT INTO product (
    product_name, price, manufacture_date, entry_date, expiry_date, stock, type
  ) VALUES (
    'Kun Miu Chicken Toy (7 x 31 cm)',
    37900,
    '2024-04-11',
    '2024-03-28',
    '2027-06-30',
    183,
    'accessory'
  ) RETURNING product_id
),
img_0 AS (
  INSERT INTO productimage (product_id, image_url)
  SELECT product_id, 'https://res.cloudinary.com/dvxmaiofh/image/upload/v1765771694/PuppyLobby/gjrjvjcpezwjuikyrcav.jpg' FROM new_product
)
INSERT INTO accessory (product_id, size, color, material)
SELECT product_id, 'S', 'Green', 'Silicone' FROM new_product;

