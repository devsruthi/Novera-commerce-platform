-- Styla clothing catalog seed (≥500 products)
-- Categories: dresses, tops, bottoms, outerwear, accessories
-- Sources: DummyJSON fashion + generated curated apparel with Unsplash galleries
-- Run in Supabase SQL Editor. Re-run replaces products tagged styla-seed.
-- Also removes shoes / electronics / other categories and their products.

begin;

-- Remove non-clothing catalog rows
delete from public.products
where category_id in (
  select id from public.categories where slug in ('shoes', 'electronics', 'other')
);
delete from public.categories where slug in ('shoes', 'electronics', 'other');

-- Ensure clothing categories exist
insert into public.categories (name, slug) values
  ('Dresses', 'dresses'),
  ('Tops', 'tops'),
  ('Bottoms', 'bottoms'),
  ('Outerwear', 'outerwear'),
  ('Accessories', 'accessories')
on conflict (name) do nothing;

update public.categories set image = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80' where slug = 'dresses';
update public.categories set image = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80' where slug = 'tops';
update public.categories set image = 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80' where slug = 'bottoms';
update public.categories set image = 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80' where slug = 'outerwear';
update public.categories set image = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80' where slug = 'accessories';

do $$
declare
  v_owner uuid;
begin
  if not exists (select 1 from public.shops) then
    select id into v_owner from public.profiles where role = 'shop_owner' order by created_at asc limit 1;
    if v_owner is null then
      raise exception 'No shop and no shop_owner profile found. Sign up a shop_owner first, then re-run this seed.';
    end if;
    insert into public.shops (owner_id, shop_name, description, address, rating)
    values (
      v_owner,
      'Styla Studio',
      'Clothing and fashion accessories — curated dresses, tops, bottoms, outerwear, and finishing pieces.',
      'Berlin, DE',
      4.70
    )
    on conflict (owner_id) do update
      set shop_name = excluded.shop_name,
          description = excluded.description;
  end if;
end $$;

delete from public.products where 'styla-seed' = any(tags);

with shop as (
  select id as shop_id from public.shops order by created_at asc limit 1
),
cats as (
  select id, slug from public.categories
)
insert into public.products (
  shop_id, category_id, title, description, price, discount_price,
  stock, brand, images, colors, sizes, tags, featured, rating
)

select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Black Women''s Gown',
  'The Black Women''s Gown is an elegant and timeless evening gown. With a sleek black design, it''s perfect for formal events and special occasions, exuding sophistication and style.',
  129.99,
  116.37,
  25,
  'Styla',
  ARRAY['https://cdn.dummyjson.com/product-images/womens-dresses/black-women''s-gown/1.webp', 'https://cdn.dummyjson.com/product-images/womens-dresses/black-women''s-gown/2.webp', 'https://cdn.dummyjson.com/product-images/womens-dresses/black-women''s-gown/3.webp', 'https://cdn.dummyjson.com/product-images/womens-dresses/black-women''s-gown/4.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['clothing', 'gowns', 'dresses', 'dummyjson', 'styla-seed']::text[],
  false,
  3.64
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Corset Leather With Skirt',
  'The Corset Leather With Skirt is a bold and edgy ensemble that combines a stylish corset with a matching skirt. Ideal for fashion-forward individuals, it makes a statement at any event.',
  89.99,
  75.36,
  30,
  'Styla',
  ARRAY['https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/1.webp', 'https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/2.webp', 'https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/3.webp', 'https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/4.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['clothing', 'corsets', 'skirts', 'dresses', 'dummyjson', 'styla-seed']::text[],
  false,
  3.2
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Corset With Black Skirt',
  'The Corset With Black Skirt is a chic and versatile outfit that pairs a fashionable corset with a classic black skirt. It offers a trendy and coordinated look for various occasions.',
  79.99,
  67.94,
  33,
  'Styla',
  ARRAY['https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/1.webp', 'https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/2.webp', 'https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/3.webp', 'https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/4.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['clothing', 'corsets', 'skirts', 'dresses', 'dummyjson', 'styla-seed']::text[],
  true,
  4.52
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Dress Pea',
  'The Dress Pea is a stylish and comfortable dress with a pea pattern. Perfect for casual outings, it adds a playful and fun element to your wardrobe, making it a great choice for day-to-day wear.',
  49.99,
  41.15,
  6,
  'Styla',
  ARRAY['https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/1.webp', 'https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/2.webp', 'https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/3.webp', 'https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/4.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['clothing', 'dresses', 'dummyjson', 'styla-seed']::text[],
  true,
  4.88
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Marni Red & Black Suit',
  'The Marni Red & Black Suit is a sophisticated and fashion-forward suit ensemble. With a combination of red and black tones, it showcases a modern design for a bold and confident look.',
  179.99,
  145.76,
  62,
  'Styla',
  ARRAY['https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/1.webp', 'https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/2.webp', 'https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/3.webp', 'https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/4.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['clothing', 'suits', 'dresses', 'dummyjson', 'styla-seed']::text[],
  true,
  4.48
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Everyday Twill Midi Dress · Studio 188',
  'A flattering midi dress in twill with a clean silhouette for day-to-evening wear. Available in red with complementary brown styling details.',
  82.25,
  70.73,
  36,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'everyday', 'twill', 'red', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Luxe Slip Dress · Quiet 189',
  'Bias-cut slip dress with adjustable straps and a soft drape. Available in green with complementary yellow styling details.',
  87.0,
  76.56,
  37,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'luxe', 'cashmere blend', 'green', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Minimal Wrap Dress · Atelier 190',
  'True-wrap dress with a defined waist and knee-skimming hem. Available in beige with complementary purple styling details.',
  85.5,
  null,
  38,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'minimal', 'linen', 'beige', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Urban Shirt Dress · Maison 191',
  'Button-front shirt dress with side slits and a removable belt. Available in pink with complementary orange styling details.',
  90.25,
  70.39,
  39,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'urban', 'cotton', 'pink', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Coastal A-Line Day Dress · Coastal 192',
  'Easy A-line day dress with soft structure and hidden pockets. Available in grey with complementary multicolor styling details.',
  95.0,
  76.0,
  40,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'coastal', 'silk', 'grey', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Studio Column Gown · Nordic 193',
  'Sleek column silhouette for evening events and celebrations. Available in brown with complementary black styling details.',
  99.75,
  null,
  41,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'studio', 'satin', 'brown', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Archive Tiered Maxi Dress · City 194',
  'Floaty tiered maxi with breathable lining and relaxed fit. Available in yellow with complementary white styling details.',
  104.5,
  87.78,
  42,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'archive', 'wool', 'yellow', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Heritage Knit Bodycon Dress · River 195',
  'Soft stretch knit bodycon with a smooth, polished finish. Available in purple with complementary blue styling details.',
  103.0,
  88.58,
  43,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'heritage', 'denim', 'purple', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Airy Poplin Midi Dress · Trail 196',
  'A flattering midi dress in poplin with a clean silhouette for day-to-evening wear. Available in orange with complementary navy styling details.',
  107.75,
  null,
  44,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'airy', 'poplin', 'orange', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Sculpted Slip Dress · Lumen 197',
  'Bias-cut slip dress with adjustable straps and a soft drape. Available in multicolor with complementary red styling details.',
  112.5,
  101.25,
  45,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'sculpted', 'jersey', 'multicolor', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Refined Wrap Dress · Soft 198',
  'True-wrap dress with a defined waist and knee-skimming hem. Available in black with complementary green styling details.',
  117.25,
  91.45,
  46,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'refined', 'twill', 'black', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Effortless Shirt Dress · Velvet 199',
  'Button-front shirt dress with side slits and a removable belt. Available in white with complementary beige styling details.',
  122.0,
  null,
  47,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'effortless', 'cashmere blend', 'white', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Classic A-Line Day Dress · Paper 200',
  'Easy A-line day dress with soft structure and hidden pockets. Available in blue with complementary pink styling details.',
  120.5,
  98.81,
  48,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'classic', 'linen', 'blue', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Modern Column Gown · Harbor 201',
  'Sleek column silhouette for evening events and celebrations. Available in navy with complementary grey styling details.',
  125.25,
  105.21,
  49,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'modern', 'cotton', 'navy', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Relaxed Tiered Maxi Dress · Oak 202',
  'Floaty tiered maxi with breathable lining and relaxed fit. Available in red with complementary brown styling details.',
  70.5,
  null,
  50,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'relaxed', 'silk', 'red', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Tailored Knit Bodycon Dress · Studio 203',
  'Soft stretch knit bodycon with a smooth, polished finish. Available in green with complementary yellow styling details.',
  75.25,
  66.22,
  51,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'tailored', 'satin', 'green', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Essential Wool Midi Dress · Quiet 204',
  'A flattering midi dress in wool with a clean silhouette for day-to-evening wear. Available in beige with complementary purple styling details.',
  80.0,
  72.0,
  52,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'essential', 'wool', 'beige', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Elevated Slip Dress · Atelier 205',
  'Bias-cut slip dress with adjustable straps and a soft drape. Available in pink with complementary orange styling details.',
  78.5,
  null,
  53,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'elevated', 'denim', 'pink', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Soft Wrap Dress · Maison 206',
  'True-wrap dress with a defined waist and knee-skimming hem. Available in grey with complementary multicolor styling details.',
  83.25,
  66.6,
  54,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'soft', 'poplin', 'grey', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Structured Shirt Dress · Coastal 207',
  'Button-front shirt dress with side slits and a removable belt. Available in brown with complementary black styling details.',
  88.0,
  72.16,
  55,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'structured', 'jersey', 'brown', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Everyday A-Line Day Dress · Nordic 208',
  'Easy A-line day dress with soft structure and hidden pockets. Available in yellow with complementary white styling details.',
  92.75,
  null,
  56,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'everyday', 'twill', 'yellow', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Luxe Column Gown · City 209',
  'Sleek column silhouette for evening events and celebrations. Available in purple with complementary blue styling details.',
  97.5,
  83.85,
  57,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'luxe', 'cashmere blend', 'purple', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Minimal Tiered Maxi Dress · River 210',
  'Floaty tiered maxi with breathable lining and relaxed fit. Available in orange with complementary navy styling details.',
  96.0,
  84.48,
  58,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'minimal', 'linen', 'orange', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Urban Knit Bodycon Dress · Trail 211',
  'Soft stretch knit bodycon with a smooth, polished finish. Available in multicolor with complementary red styling details.',
  100.75,
  null,
  59,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'urban', 'cotton', 'multicolor', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Coastal Silk Midi Dress · Lumen 212',
  'A flattering midi dress in silk with a clean silhouette for day-to-evening wear. Available in black with complementary green styling details.',
  105.5,
  82.29,
  60,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'coastal', 'silk', 'black', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Studio Slip Dress · Soft 213',
  'Bias-cut slip dress with adjustable straps and a soft drape. Available in white with complementary beige styling details.',
  110.25,
  88.2,
  61,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'studio', 'satin', 'white', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Archive Wrap Dress · Velvet 214',
  'True-wrap dress with a defined waist and knee-skimming hem. Available in blue with complementary pink styling details.',
  115.0,
  null,
  62,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'archive', 'wool', 'blue', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Heritage Shirt Dress · Paper 215',
  'Button-front shirt dress with side slits and a removable belt. Available in navy with complementary grey styling details.',
  113.5,
  95.34,
  63,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'heritage', 'denim', 'navy', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Airy A-Line Day Dress · Harbor 216',
  'Easy A-line day dress with soft structure and hidden pockets. Available in red with complementary brown styling details.',
  118.25,
  101.69,
  64,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'airy', 'poplin', 'red', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Sculpted Column Gown · Oak 217',
  'Sleek column silhouette for evening events and celebrations. Available in green with complementary yellow styling details.',
  123.0,
  null,
  65,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'sculpted', 'jersey', 'green', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Refined Tiered Maxi Dress · Studio 218',
  'Floaty tiered maxi with breathable lining and relaxed fit. Available in beige with complementary purple styling details.',
  127.75,
  114.98,
  66,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'refined', 'twill', 'beige', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Effortless Knit Bodycon Dress · Quiet 219',
  'Soft stretch knit bodycon with a smooth, polished finish. Available in pink with complementary orange styling details.',
  73.0,
  56.94,
  67,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'effortless', 'cashmere blend', 'pink', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Classic Linen Midi Dress · Atelier 220',
  'A flattering midi dress in linen with a clean silhouette for day-to-evening wear. Available in grey with complementary multicolor styling details.',
  71.5,
  null,
  8,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'classic', 'linen', 'grey', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Modern Slip Dress · Maison 221',
  'Bias-cut slip dress with adjustable straps and a soft drape. Available in brown with complementary black styling details.',
  76.25,
  62.53,
  9,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'modern', 'cotton', 'brown', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Relaxed Wrap Dress · Coastal 222',
  'True-wrap dress with a defined waist and knee-skimming hem. Available in yellow with complementary white styling details.',
  81.0,
  68.04,
  10,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'relaxed', 'silk', 'yellow', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Tailored Shirt Dress · Nordic 223',
  'Button-front shirt dress with side slits and a removable belt. Available in purple with complementary blue styling details.',
  85.75,
  null,
  11,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'tailored', 'satin', 'purple', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Essential A-Line Day Dress · City 224',
  'Easy A-line day dress with soft structure and hidden pockets. Available in orange with complementary navy styling details.',
  90.5,
  79.64,
  12,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'essential', 'wool', 'orange', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Elevated Column Gown · River 225',
  'Sleek column silhouette for evening events and celebrations. Available in multicolor with complementary red styling details.',
  89.0,
  80.1,
  13,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'elevated', 'denim', 'multicolor', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Soft Tiered Maxi Dress · Trail 226',
  'Floaty tiered maxi with breathable lining and relaxed fit. Available in black with complementary green styling details.',
  93.75,
  null,
  14,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'soft', 'poplin', 'black', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Structured Knit Bodycon Dress · Lumen 227',
  'Soft stretch knit bodycon with a smooth, polished finish. Available in white with complementary beige styling details.',
  98.5,
  78.8,
  15,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'structured', 'jersey', 'white', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Everyday Twill Midi Dress · Soft 228',
  'A flattering midi dress in twill with a clean silhouette for day-to-evening wear. Available in blue with complementary pink styling details.',
  103.25,
  84.67,
  16,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'everyday', 'twill', 'blue', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Luxe Slip Dress · Velvet 229',
  'Bias-cut slip dress with adjustable straps and a soft drape. Available in navy with complementary grey styling details.',
  108.0,
  null,
  17,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'luxe', 'cashmere blend', 'navy', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Minimal Wrap Dress · Paper 230',
  'True-wrap dress with a defined waist and knee-skimming hem. Available in red with complementary brown styling details.',
  106.5,
  91.59,
  18,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'minimal', 'linen', 'red', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Urban Shirt Dress · Harbor 231',
  'Button-front shirt dress with side slits and a removable belt. Available in green with complementary yellow styling details.',
  111.25,
  97.9,
  19,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'urban', 'cotton', 'green', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Coastal A-Line Day Dress · Oak 232',
  'Easy A-line day dress with soft structure and hidden pockets. Available in beige with complementary purple styling details.',
  116.0,
  null,
  20,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'coastal', 'silk', 'beige', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Studio Column Gown · Studio 233',
  'Sleek column silhouette for evening events and celebrations. Available in pink with complementary orange styling details.',
  120.75,
  94.19,
  21,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'studio', 'satin', 'pink', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Archive Tiered Maxi Dress · Quiet 234',
  'Floaty tiered maxi with breathable lining and relaxed fit. Available in grey with complementary multicolor styling details.',
  125.5,
  100.4,
  22,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'archive', 'wool', 'grey', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Heritage Knit Bodycon Dress · Atelier 235',
  'Soft stretch knit bodycon with a smooth, polished finish. Available in brown with complementary black styling details.',
  124.0,
  null,
  23,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'heritage', 'denim', 'brown', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Airy Poplin Midi Dress · Maison 236',
  'A flattering midi dress in poplin with a clean silhouette for day-to-evening wear. Available in yellow with complementary white styling details.',
  69.25,
  58.17,
  24,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'airy', 'poplin', 'yellow', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Sculpted Slip Dress · Coastal 237',
  'Bias-cut slip dress with adjustable straps and a soft drape. Available in purple with complementary blue styling details.',
  74.0,
  63.64,
  25,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'sculpted', 'jersey', 'purple', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Refined Wrap Dress · Nordic 238',
  'True-wrap dress with a defined waist and knee-skimming hem. Available in orange with complementary navy styling details.',
  78.75,
  null,
  26,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'refined', 'twill', 'orange', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Effortless Shirt Dress · City 239',
  'Button-front shirt dress with side slits and a removable belt. Available in multicolor with complementary red styling details.',
  83.5,
  75.15,
  27,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'effortless', 'cashmere blend', 'multicolor', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Classic A-Line Day Dress · River 240',
  'Easy A-line day dress with soft structure and hidden pockets. Available in black with complementary green styling details.',
  82.0,
  63.96,
  28,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'classic', 'linen', 'black', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Modern Column Gown · Trail 241',
  'Sleek column silhouette for evening events and celebrations. Available in white with complementary beige styling details.',
  86.75,
  null,
  29,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'modern', 'cotton', 'white', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Relaxed Tiered Maxi Dress · Lumen 242',
  'Floaty tiered maxi with breathable lining and relaxed fit. Available in blue with complementary pink styling details.',
  91.5,
  75.03,
  30,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'relaxed', 'silk', 'blue', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Tailored Knit Bodycon Dress · Soft 243',
  'Soft stretch knit bodycon with a smooth, polished finish. Available in navy with complementary grey styling details.',
  96.25,
  80.85,
  31,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'tailored', 'satin', 'navy', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Essential Wool Midi Dress · Velvet 244',
  'A flattering midi dress in wool with a clean silhouette for day-to-evening wear. Available in red with complementary brown styling details.',
  101.0,
  null,
  32,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'essential', 'wool', 'red', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Elevated Slip Dress · Paper 245',
  'Bias-cut slip dress with adjustable straps and a soft drape. Available in green with complementary yellow styling details.',
  99.5,
  87.56,
  33,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'elevated', 'denim', 'green', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Soft Wrap Dress · Harbor 246',
  'True-wrap dress with a defined waist and knee-skimming hem. Available in beige with complementary purple styling details.',
  104.25,
  93.83,
  34,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'soft', 'poplin', 'beige', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Structured Shirt Dress · Oak 247',
  'Button-front shirt dress with side slits and a removable belt. Available in pink with complementary orange styling details.',
  109.0,
  null,
  35,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'structured', 'jersey', 'pink', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Everyday A-Line Day Dress · Studio 248',
  'Easy A-line day dress with soft structure and hidden pockets. Available in grey with complementary multicolor styling details.',
  113.75,
  91.0,
  36,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'everyday', 'twill', 'grey', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Luxe Column Gown · Quiet 249',
  'Sleek column silhouette for evening events and celebrations. Available in brown with complementary black styling details.',
  118.5,
  97.17,
  37,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'luxe', 'cashmere blend', 'brown', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Minimal Tiered Maxi Dress · Atelier 250',
  'Floaty tiered maxi with breathable lining and relaxed fit. Available in yellow with complementary white styling details.',
  117.0,
  null,
  38,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'minimal', 'linen', 'yellow', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Urban Knit Bodycon Dress · Maison 251',
  'Soft stretch knit bodycon with a smooth, polished finish. Available in purple with complementary blue styling details.',
  121.75,
  104.7,
  39,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'urban', 'cotton', 'purple', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Coastal Silk Midi Dress · Coastal 252',
  'A flattering midi dress in silk with a clean silhouette for day-to-evening wear. Available in orange with complementary navy styling details.',
  126.5,
  111.32,
  40,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'coastal', 'silk', 'orange', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Studio Slip Dress · Nordic 253',
  'Bias-cut slip dress with adjustable straps and a soft drape. Available in multicolor with complementary red styling details.',
  71.75,
  null,
  41,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'studio', 'satin', 'multicolor', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Archive Wrap Dress · City 254',
  'True-wrap dress with a defined waist and knee-skimming hem. Available in black with complementary green styling details.',
  76.5,
  59.67,
  42,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'archive', 'wool', 'black', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Heritage Shirt Dress · River 255',
  'Button-front shirt dress with side slits and a removable belt. Available in white with complementary beige styling details.',
  75.0,
  60.0,
  43,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'heritage', 'denim', 'white', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Airy A-Line Day Dress · Trail 256',
  'Easy A-line day dress with soft structure and hidden pockets. Available in blue with complementary pink styling details.',
  79.75,
  null,
  44,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'airy', 'poplin', 'blue', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Sculpted Column Gown · Lumen 257',
  'Sleek column silhouette for evening events and celebrations. Available in navy with complementary grey styling details.',
  84.5,
  70.98,
  45,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'sculpted', 'jersey', 'navy', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Refined Tiered Maxi Dress · Soft 258',
  'Floaty tiered maxi with breathable lining and relaxed fit. Available in red with complementary brown styling details.',
  89.25,
  76.75,
  46,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'refined', 'twill', 'red', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Effortless Knit Bodycon Dress · Velvet 259',
  'Soft stretch knit bodycon with a smooth, polished finish. Available in green with complementary yellow styling details.',
  94.0,
  null,
  47,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'effortless', 'cashmere blend', 'green', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Classic Linen Midi Dress · Paper 260',
  'A flattering midi dress in linen with a clean silhouette for day-to-evening wear. Available in beige with complementary purple styling details.',
  92.5,
  83.25,
  48,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'classic', 'linen', 'beige', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Modern Slip Dress · Harbor 261',
  'Bias-cut slip dress with adjustable straps and a soft drape. Available in pink with complementary orange styling details.',
  97.25,
  75.86,
  49,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'modern', 'cotton', 'pink', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Relaxed Wrap Dress · Oak 262',
  'True-wrap dress with a defined waist and knee-skimming hem. Available in grey with complementary multicolor styling details.',
  102.0,
  null,
  50,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'relaxed', 'silk', 'grey', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.68
from shop;

with shop as (
  select id as shop_id from public.shops order by created_at asc limit 1
),
cats as (
  select id, slug from public.categories
)
insert into public.products (
  shop_id, category_id, title, description, price, discount_price,
  stock, brand, images, colors, sizes, tags, featured, rating
)

select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Tailored Shirt Dress · Studio 263',
  'Button-front shirt dress with side slits and a removable belt. Available in brown with complementary black styling details.',
  106.75,
  87.54,
  51,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'tailored', 'satin', 'brown', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Essential A-Line Day Dress · Quiet 264',
  'Easy A-line day dress with soft structure and hidden pockets. Available in yellow with complementary white styling details.',
  111.5,
  93.66,
  52,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'essential', 'wool', 'yellow', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Elevated Column Gown · Atelier 265',
  'Sleek column silhouette for evening events and celebrations. Available in purple with complementary blue styling details.',
  110.0,
  null,
  53,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'elevated', 'denim', 'purple', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Soft Tiered Maxi Dress · Maison 266',
  'Floaty tiered maxi with breathable lining and relaxed fit. Available in orange with complementary navy styling details.',
  114.75,
  100.98,
  54,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'soft', 'poplin', 'orange', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Structured Knit Bodycon Dress · Coastal 267',
  'Soft stretch knit bodycon with a smooth, polished finish. Available in multicolor with complementary red styling details.',
  119.5,
  107.55,
  55,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'structured', 'jersey', 'multicolor', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Everyday Twill Midi Dress · Nordic 268',
  'A flattering midi dress in twill with a clean silhouette for day-to-evening wear. Available in black with complementary green styling details.',
  124.25,
  null,
  56,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'everyday', 'twill', 'black', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Luxe Slip Dress · City 269',
  'Bias-cut slip dress with adjustable straps and a soft drape. Available in white with complementary beige styling details.',
  129.0,
  103.2,
  57,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'luxe', 'cashmere blend', 'white', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Minimal Wrap Dress · River 270',
  'True-wrap dress with a defined waist and knee-skimming hem. Available in blue with complementary pink styling details.',
  68.0,
  55.76,
  58,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'minimal', 'linen', 'blue', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Urban Shirt Dress · Trail 271',
  'Button-front shirt dress with side slits and a removable belt. Available in navy with complementary grey styling details.',
  72.75,
  null,
  59,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'urban', 'cotton', 'navy', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Coastal A-Line Day Dress · Lumen 272',
  'Easy A-line day dress with soft structure and hidden pockets. Available in red with complementary brown styling details.',
  77.5,
  66.65,
  60,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'coastal', 'silk', 'red', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Studio Column Gown · Soft 273',
  'Sleek column silhouette for evening events and celebrations. Available in green with complementary yellow styling details.',
  82.25,
  72.38,
  61,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'studio', 'satin', 'green', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Archive Tiered Maxi Dress · Velvet 274',
  'Floaty tiered maxi with breathable lining and relaxed fit. Available in beige with complementary purple styling details.',
  87.0,
  null,
  62,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'archive', 'wool', 'beige', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Heritage Knit Bodycon Dress · Paper 275',
  'Soft stretch knit bodycon with a smooth, polished finish. Available in pink with complementary orange styling details.',
  85.5,
  66.69,
  63,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'heritage', 'denim', 'pink', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Airy Poplin Midi Dress · Harbor 276',
  'A flattering midi dress in poplin with a clean silhouette for day-to-evening wear. Available in grey with complementary multicolor styling details.',
  90.25,
  72.2,
  64,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'airy', 'poplin', 'grey', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Sculpted Slip Dress · Oak 277',
  'Bias-cut slip dress with adjustable straps and a soft drape. Available in brown with complementary black styling details.',
  95.0,
  null,
  65,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'sculpted', 'jersey', 'brown', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Refined Wrap Dress · Studio 278',
  'True-wrap dress with a defined waist and knee-skimming hem. Available in yellow with complementary white styling details.',
  99.75,
  83.79,
  66,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'refined', 'twill', 'yellow', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Effortless Shirt Dress · Quiet 279',
  'Button-front shirt dress with side slits and a removable belt. Available in purple with complementary blue styling details.',
  104.5,
  89.87,
  67,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'effortless', 'cashmere blend', 'purple', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Classic A-Line Day Dress · Atelier 280',
  'Easy A-line day dress with soft structure and hidden pockets. Available in orange with complementary navy styling details.',
  103.0,
  null,
  8,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'classic', 'linen', 'orange', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Modern Column Gown · Maison 281',
  'Sleek column silhouette for evening events and celebrations. Available in multicolor with complementary red styling details.',
  107.75,
  96.98,
  9,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'modern', 'cotton', 'multicolor', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Relaxed Tiered Maxi Dress · Coastal 282',
  'Floaty tiered maxi with breathable lining and relaxed fit. Available in black with complementary green styling details.',
  112.5,
  87.75,
  10,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'relaxed', 'silk', 'black', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Tailored Knit Bodycon Dress · Nordic 283',
  'Soft stretch knit bodycon with a smooth, polished finish. Available in white with complementary beige styling details.',
  117.25,
  null,
  11,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'tailored', 'satin', 'white', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Essential Wool Midi Dress · City 284',
  'A flattering midi dress in wool with a clean silhouette for day-to-evening wear. Available in blue with complementary pink styling details.',
  122.0,
  100.04,
  12,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'essential', 'wool', 'blue', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Elevated Slip Dress · River 285',
  'Bias-cut slip dress with adjustable straps and a soft drape. Available in navy with complementary grey styling details.',
  120.5,
  101.22,
  13,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'elevated', 'denim', 'navy', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Soft Wrap Dress · Trail 286',
  'True-wrap dress with a defined waist and knee-skimming hem. Available in red with complementary brown styling details.',
  125.25,
  null,
  14,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'soft', 'poplin', 'red', 'dresses', 'styla-seed', 'curated']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Structured Shirt Dress · Lumen 287',
  'Button-front shirt dress with side slits and a removable belt. Available in green with complementary yellow styling details.',
  70.5,
  62.04,
  15,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'structured', 'jersey', 'green', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Everyday A-Line Day Dress · Soft 288',
  'Easy A-line day dress with soft structure and hidden pockets. Available in beige with complementary purple styling details.',
  75.25,
  67.73,
  16,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'everyday', 'twill', 'beige', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Luxe Column Gown · Velvet 289',
  'Sleek column silhouette for evening events and celebrations. Available in pink with complementary orange styling details.',
  80.0,
  null,
  17,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'luxe', 'cashmere blend', 'pink', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Minimal Tiered Maxi Dress · Paper 290',
  'Floaty tiered maxi with breathable lining and relaxed fit. Available in grey with complementary multicolor styling details.',
  78.5,
  62.8,
  18,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'minimal', 'linen', 'grey', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Urban Knit Bodycon Dress · Harbor 291',
  'Soft stretch knit bodycon with a smooth, polished finish. Available in brown with complementary black styling details.',
  83.25,
  68.27,
  19,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'urban', 'cotton', 'brown', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'dresses'),
  'Coastal Silk Midi Dress · Oak 292',
  'A flattering midi dress in silk with a clean silhouette for day-to-evening wear. Available in yellow with complementary white styling details.',
  88.0,
  null,
  20,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['dress', 'midi', 'occasion', 'wardrobe', 'coastal', 'silk', 'yellow', 'dresses', 'styla-seed', 'curated']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Blue Frock',
  'The Blue Frock is a charming and stylish dress for various occasions. With a vibrant blue color and a comfortable design, it adds a touch of elegance to your wardrobe.',
  29.99,
  26.35,
  52,
  'Styla',
  ARRAY['https://cdn.dummyjson.com/product-images/tops/blue-frock/1.webp', 'https://cdn.dummyjson.com/product-images/tops/blue-frock/2.webp', 'https://cdn.dummyjson.com/product-images/tops/blue-frock/3.webp', 'https://cdn.dummyjson.com/product-images/tops/blue-frock/4.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['clothing', 'dresses', 'tops', 'dummyjson', 'styla-seed']::text[],
  false,
  4.17
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Girl Summer Dress',
  'The Girl Summer Dress is a cute and breezy dress designed for warm weather. With playful patterns and lightweight fabric, it''s perfect for keeping cool and stylish during the summer.',
  19.99,
  16.15,
  43,
  'Styla',
  ARRAY['https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/1.webp', 'https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/2.webp', 'https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/3.webp', 'https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/4.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['clothing', 'girls'' dresses', 'tops', 'dummyjson', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Gray Dress',
  'The Gray Dress is a versatile and chic option for various occasions. With a neutral gray color, it can be dressed up or down, making it a wardrobe staple for any fashion-forward individual.',
  34.99,
  29.99,
  55,
  'Styla',
  ARRAY['https://cdn.dummyjson.com/product-images/tops/gray-dress/1.webp', 'https://cdn.dummyjson.com/product-images/tops/gray-dress/2.webp', 'https://cdn.dummyjson.com/product-images/tops/gray-dress/3.webp', 'https://cdn.dummyjson.com/product-images/tops/gray-dress/4.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['clothing', 'dresses', 'tops', 'dummyjson', 'styla-seed']::text[],
  false,
  3.2
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Short Frock',
  'The Short Frock is a playful and trendy dress with a shorter length. Ideal for casual outings or special occasions, it combines style and comfort for a fashionable look.',
  24.99,
  21.63,
  22,
  'Styla',
  ARRAY['https://cdn.dummyjson.com/product-images/tops/short-frock/1.webp', 'https://cdn.dummyjson.com/product-images/tops/short-frock/2.webp', 'https://cdn.dummyjson.com/product-images/tops/short-frock/3.webp', 'https://cdn.dummyjson.com/product-images/tops/short-frock/4.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['clothing', 'dresses', 'tops', 'dummyjson', 'styla-seed']::text[],
  false,
  3.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Tartan Dress',
  'The Tartan Dress features a classic tartan pattern, bringing a timeless and sophisticated touch to your wardrobe. Perfect for fall and winter, it adds a hint of traditional charm.',
  39.99,
  34.81,
  73,
  'Styla',
  ARRAY['https://cdn.dummyjson.com/product-images/tops/tartan-dress/1.webp', 'https://cdn.dummyjson.com/product-images/tops/tartan-dress/2.webp', 'https://cdn.dummyjson.com/product-images/tops/tartan-dress/3.webp', 'https://cdn.dummyjson.com/product-images/tops/tartan-dress/4.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['clothing', 'dresses', 'tops', 'dummyjson', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Blue & Black Check Shirt',
  'The Blue & Black Check Shirt is a stylish and comfortable men''s shirt featuring a classic check pattern. Made from high-quality fabric, it''s suitable for both casual and semi-formal occasions.',
  29.99,
  25.39,
  38,
  'Fashion Trends',
  ARRAY['https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/1.webp', 'https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/2.webp', 'https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/3.webp', 'https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/4.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['clothing', 'men''s shirts', 'tops', 'dummyjson', 'styla-seed']::text[],
  false,
  3.64
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Gigabyte Aorus Men Tshirt',
  'The Gigabyte Aorus Men Tshirt is a cool and casual shirt for gaming enthusiasts. With the Aorus logo and sleek design, it''s perfect for expressing your gaming style.',
  24.99,
  null,
  90,
  'Gigabyte',
  ARRAY['https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/1.webp', 'https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/2.webp', 'https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/3.webp', 'https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/4.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['clothing', 'men''s t-shirts', 'tops', 'dummyjson', 'styla-seed']::text[],
  false,
  3.2
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Man Plaid Shirt',
  'The Man Plaid Shirt is a timeless and versatile men''s shirt with a classic plaid pattern. Its comfortable fit and casual style make it a wardrobe essential for various occasions.',
  34.99,
  28.17,
  82,
  'Classic Wear',
  ARRAY['https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/1.webp', 'https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/2.webp', 'https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/3.webp', 'https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/4.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['clothing', 'men''s shirts', 'tops', 'dummyjson', 'styla-seed']::text[],
  false,
  3.46
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Man Short Sleeve Shirt',
  'The Man Short Sleeve Shirt is a breezy and stylish option for warm days. With a comfortable fit and short sleeves, it''s perfect for a laid-back yet polished look.',
  19.99,
  null,
  2,
  'Casual Comfort',
  ARRAY['https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/1.webp', 'https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/2.webp', 'https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/3.webp', 'https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/4.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['clothing', 'men''s shirts', 'tops', 'dummyjson', 'styla-seed']::text[],
  false,
  3.2
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Men Check Shirt',
  'The Men Check Shirt is a classic and versatile shirt featuring a stylish check pattern. Suitable for various occasions, it adds a smart and polished touch to your wardrobe.',
  27.99,
  24.8,
  95,
  'Urban Chic',
  ARRAY['https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/1.webp', 'https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/2.webp', 'https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/3.webp', 'https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/4.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['clothing', 'men''s shirts', 'tops', 'dummyjson', 'styla-seed']::text[],
  false,
  3.2
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Studio Ribbed Tank · Soft 273',
  'Contour rib tank for layering or warm-weather wear. Available in green with complementary yellow styling details.',
  56.25,
  49.5,
  61,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'studio', 'satin', 'green', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Archive Poplin Shirt · Velvet 274',
  'Crisp poplin shirt tailored for office and weekend outfits. Available in beige with complementary purple styling details.',
  61.0,
  null,
  62,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'archive', 'wool', 'beige', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Heritage Hoodie · Paper 275',
  'Brushed-back hoodie with kangaroo pocket and relaxed fit. Available in pink with complementary orange styling details.',
  59.5,
  46.41,
  63,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'heritage', 'denim', 'pink', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Airy Poplin Blouse · Harbor 276',
  'Lightweight poplin blouse with a refined collar and easy drape. Available in grey with complementary multicolor styling details.',
  64.25,
  51.4,
  64,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'airy', 'poplin', 'grey', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Sculpted Crewneck Tee · Oak 277',
  'Everyday cotton crewneck with a soft handfeel and clean hem. Available in brown with complementary black styling details.',
  69.0,
  null,
  65,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'sculpted', 'jersey', 'brown', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Refined Silk Camisole · Studio 278',
  'Bias camisole with adjustable straps — layering essential. Available in yellow with complementary white styling details.',
  73.75,
  61.95,
  66,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'refined', 'twill', 'yellow', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Effortless Oversized Shirt · Quiet 279',
  'Relaxed button-up with dropped shoulders and curved hem. Available in purple with complementary blue styling details.',
  78.5,
  67.51,
  67,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'effortless', 'cashmere blend', 'purple', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Classic Fine-Knit Sweater · Atelier 280',
  'Fine-gauge knit with a neat rib trim and soft stretch. Available in orange with complementary navy styling details.',
  77.0,
  null,
  8,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'classic', 'linen', 'orange', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Modern Ribbed Tank · Maison 281',
  'Contour rib tank for layering or warm-weather wear. Available in multicolor with complementary red styling details.',
  81.75,
  73.58,
  9,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'modern', 'cotton', 'multicolor', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Relaxed Poplin Shirt · Coastal 282',
  'Crisp poplin shirt tailored for office and weekend outfits. Available in black with complementary green styling details.',
  86.5,
  67.47,
  10,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'relaxed', 'silk', 'black', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Tailored Hoodie · Nordic 283',
  'Brushed-back hoodie with kangaroo pocket and relaxed fit. Available in white with complementary beige styling details.',
  91.25,
  null,
  11,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'tailored', 'satin', 'white', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Essential Wool Blouse · City 284',
  'Lightweight wool blouse with a refined collar and easy drape. Available in blue with complementary pink styling details.',
  96.0,
  78.72,
  12,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'essential', 'wool', 'blue', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Elevated Crewneck Tee · River 285',
  'Everyday cotton crewneck with a soft handfeel and clean hem. Available in navy with complementary grey styling details.',
  94.5,
  79.38,
  13,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'elevated', 'denim', 'navy', 'tops', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Soft Silk Camisole · Trail 286',
  'Bias camisole with adjustable straps — layering essential. Available in red with complementary brown styling details.',
  99.25,
  null,
  14,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'soft', 'poplin', 'red', 'tops', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Structured Oversized Shirt · Lumen 287',
  'Relaxed button-up with dropped shoulders and curved hem. Available in green with complementary yellow styling details.',
  44.5,
  39.16,
  15,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'structured', 'jersey', 'green', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Everyday Fine-Knit Sweater · Soft 288',
  'Fine-gauge knit with a neat rib trim and soft stretch. Available in beige with complementary purple styling details.',
  49.25,
  44.33,
  16,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'twill', 'beige', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Luxe Ribbed Tank · Velvet 289',
  'Contour rib tank for layering or warm-weather wear. Available in pink with complementary orange styling details.',
  54.0,
  null,
  17,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'luxe', 'cashmere blend', 'pink', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Minimal Poplin Shirt · Paper 290',
  'Crisp poplin shirt tailored for office and weekend outfits. Available in grey with complementary multicolor styling details.',
  52.5,
  42.0,
  18,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'minimal', 'linen', 'grey', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Urban Hoodie · Harbor 291',
  'Brushed-back hoodie with kangaroo pocket and relaxed fit. Available in brown with complementary black styling details.',
  57.25,
  46.95,
  19,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'urban', 'cotton', 'brown', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Coastal Silk Blouse · Oak 292',
  'Lightweight silk blouse with a refined collar and easy drape. Available in yellow with complementary white styling details.',
  62.0,
  null,
  20,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'coastal', 'silk', 'yellow', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Studio Crewneck Tee · Studio 293',
  'Everyday cotton crewneck with a soft handfeel and clean hem. Available in purple with complementary blue styling details.',
  66.75,
  57.41,
  21,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'studio', 'satin', 'purple', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Archive Silk Camisole · Quiet 294',
  'Bias camisole with adjustable straps — layering essential. Available in orange with complementary navy styling details.',
  71.5,
  62.92,
  22,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'archive', 'wool', 'orange', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Heritage Oversized Shirt · Atelier 295',
  'Relaxed button-up with dropped shoulders and curved hem. Available in multicolor with complementary red styling details.',
  70.0,
  null,
  23,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'heritage', 'denim', 'multicolor', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Airy Fine-Knit Sweater · Maison 296',
  'Fine-gauge knit with a neat rib trim and soft stretch. Available in black with complementary green styling details.',
  74.75,
  58.3,
  24,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'airy', 'poplin', 'black', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Sculpted Ribbed Tank · Coastal 297',
  'Contour rib tank for layering or warm-weather wear. Available in white with complementary beige styling details.',
  79.5,
  63.6,
  25,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'sculpted', 'jersey', 'white', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Refined Poplin Shirt · Nordic 298',
  'Crisp poplin shirt tailored for office and weekend outfits. Available in blue with complementary pink styling details.',
  84.25,
  null,
  26,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'refined', 'twill', 'blue', 'tops', 'curated', 'styla-seed']::text[],
  true,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Effortless Hoodie · City 299',
  'Brushed-back hoodie with kangaroo pocket and relaxed fit. Available in navy with complementary grey styling details.',
  89.0,
  74.76,
  27,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'effortless', 'cashmere blend', 'navy', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Classic Linen Blouse · River 300',
  'Lightweight linen blouse with a refined collar and easy drape. Available in red with complementary brown styling details.',
  87.5,
  75.25,
  28,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'classic', 'linen', 'red', 'tops', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Modern Crewneck Tee · Trail 301',
  'Everyday cotton crewneck with a soft handfeel and clean hem. Available in green with complementary yellow styling details.',
  92.25,
  null,
  29,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'modern', 'cotton', 'green', 'tops', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Relaxed Silk Camisole · Lumen 302',
  'Bias camisole with adjustable straps — layering essential. Available in beige with complementary purple styling details.',
  97.0,
  87.3,
  30,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'relaxed', 'silk', 'beige', 'tops', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Tailored Oversized Shirt · Soft 303',
  'Relaxed button-up with dropped shoulders and curved hem. Available in pink with complementary orange styling details.',
  101.75,
  79.37,
  31,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'tailored', 'satin', 'pink', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Essential Fine-Knit Sweater · Velvet 304',
  'Fine-gauge knit with a neat rib trim and soft stretch. Available in grey with complementary multicolor styling details.',
  47.0,
  null,
  32,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'essential', 'wool', 'grey', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Elevated Ribbed Tank · Paper 305',
  'Contour rib tank for layering or warm-weather wear. Available in brown with complementary black styling details.',
  45.5,
  37.31,
  33,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'elevated', 'denim', 'brown', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Soft Poplin Shirt · Harbor 306',
  'Crisp poplin shirt tailored for office and weekend outfits. Available in yellow with complementary white styling details.',
  50.25,
  42.21,
  34,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'soft', 'poplin', 'yellow', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Structured Hoodie · Oak 307',
  'Brushed-back hoodie with kangaroo pocket and relaxed fit. Available in purple with complementary blue styling details.',
  55.0,
  null,
  35,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'structured', 'jersey', 'purple', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Everyday Twill Blouse · Studio 308',
  'Lightweight twill blouse with a refined collar and easy drape. Available in orange with complementary navy styling details.',
  59.75,
  52.58,
  36,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'twill', 'orange', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Luxe Crewneck Tee · Quiet 309',
  'Everyday cotton crewneck with a soft handfeel and clean hem. Available in multicolor with complementary red styling details.',
  64.5,
  58.05,
  37,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'luxe', 'cashmere blend', 'multicolor', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Minimal Silk Camisole · Atelier 310',
  'Bias camisole with adjustable straps — layering essential. Available in black with complementary green styling details.',
  63.0,
  null,
  38,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'minimal', 'linen', 'black', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Urban Oversized Shirt · Maison 311',
  'Relaxed button-up with dropped shoulders and curved hem. Available in white with complementary beige styling details.',
  67.75,
  54.2,
  39,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'urban', 'cotton', 'white', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Coastal Fine-Knit Sweater · Coastal 312',
  'Fine-gauge knit with a neat rib trim and soft stretch. Available in blue with complementary pink styling details.',
  72.5,
  59.45,
  40,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'coastal', 'silk', 'blue', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop;

with shop as (
  select id as shop_id from public.shops order by created_at asc limit 1
),
cats as (
  select id, slug from public.categories
)
insert into public.products (
  shop_id, category_id, title, description, price, discount_price,
  stock, brand, images, colors, sizes, tags, featured, rating
)

select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Studio Ribbed Tank · Nordic 313',
  'Contour rib tank for layering or warm-weather wear. Available in navy with complementary grey styling details.',
  77.25,
  null,
  41,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'studio', 'satin', 'navy', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Archive Poplin Shirt · City 314',
  'Crisp poplin shirt tailored for office and weekend outfits. Available in red with complementary brown styling details.',
  82.0,
  70.52,
  42,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'archive', 'wool', 'red', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Heritage Hoodie · River 315',
  'Brushed-back hoodie with kangaroo pocket and relaxed fit. Available in green with complementary yellow styling details.',
  80.5,
  70.84,
  43,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'heritage', 'denim', 'green', 'tops', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Airy Poplin Blouse · Trail 316',
  'Lightweight poplin blouse with a refined collar and easy drape. Available in beige with complementary purple styling details.',
  85.25,
  null,
  44,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'airy', 'poplin', 'beige', 'tops', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Sculpted Crewneck Tee · Lumen 317',
  'Everyday cotton crewneck with a soft handfeel and clean hem. Available in pink with complementary orange styling details.',
  90.0,
  70.2,
  45,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'sculpted', 'jersey', 'pink', 'tops', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Refined Silk Camisole · Soft 318',
  'Bias camisole with adjustable straps — layering essential. Available in grey with complementary multicolor styling details.',
  94.75,
  75.8,
  46,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'refined', 'twill', 'grey', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Effortless Oversized Shirt · Velvet 319',
  'Relaxed button-up with dropped shoulders and curved hem. Available in brown with complementary black styling details.',
  99.5,
  null,
  47,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'effortless', 'cashmere blend', 'brown', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Classic Fine-Knit Sweater · Paper 320',
  'Fine-gauge knit with a neat rib trim and soft stretch. Available in yellow with complementary white styling details.',
  98.0,
  82.32,
  48,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'classic', 'linen', 'yellow', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Modern Ribbed Tank · Harbor 321',
  'Contour rib tank for layering or warm-weather wear. Available in purple with complementary blue styling details.',
  43.25,
  37.2,
  49,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'modern', 'cotton', 'purple', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Relaxed Poplin Shirt · Oak 322',
  'Crisp poplin shirt tailored for office and weekend outfits. Available in orange with complementary navy styling details.',
  48.0,
  null,
  50,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'relaxed', 'silk', 'orange', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Tailored Hoodie · Studio 323',
  'Brushed-back hoodie with kangaroo pocket and relaxed fit. Available in multicolor with complementary red styling details.',
  52.75,
  47.48,
  51,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'tailored', 'satin', 'multicolor', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Essential Wool Blouse · Quiet 324',
  'Lightweight wool blouse with a refined collar and easy drape. Available in black with complementary green styling details.',
  57.5,
  44.85,
  52,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'essential', 'wool', 'black', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Elevated Crewneck Tee · Atelier 325',
  'Everyday cotton crewneck with a soft handfeel and clean hem. Available in white with complementary beige styling details.',
  56.0,
  null,
  53,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'elevated', 'denim', 'white', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Soft Silk Camisole · Maison 326',
  'Bias camisole with adjustable straps — layering essential. Available in blue with complementary pink styling details.',
  60.75,
  49.82,
  54,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'soft', 'poplin', 'blue', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Structured Oversized Shirt · Coastal 327',
  'Relaxed button-up with dropped shoulders and curved hem. Available in navy with complementary grey styling details.',
  65.5,
  55.02,
  55,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'structured', 'jersey', 'navy', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Everyday Fine-Knit Sweater · Nordic 328',
  'Fine-gauge knit with a neat rib trim and soft stretch. Available in red with complementary brown styling details.',
  70.25,
  null,
  56,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'twill', 'red', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Luxe Ribbed Tank · City 329',
  'Contour rib tank for layering or warm-weather wear. Available in green with complementary yellow styling details.',
  75.0,
  66.0,
  57,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'luxe', 'cashmere blend', 'green', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Minimal Poplin Shirt · River 330',
  'Crisp poplin shirt tailored for office and weekend outfits. Available in beige with complementary purple styling details.',
  73.5,
  66.15,
  58,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'minimal', 'linen', 'beige', 'tops', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Urban Hoodie · Trail 331',
  'Brushed-back hoodie with kangaroo pocket and relaxed fit. Available in pink with complementary orange styling details.',
  78.25,
  null,
  59,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'urban', 'cotton', 'pink', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Coastal Silk Blouse · Lumen 332',
  'Lightweight silk blouse with a refined collar and easy drape. Available in grey with complementary multicolor styling details.',
  83.0,
  66.4,
  60,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'coastal', 'silk', 'grey', 'tops', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Studio Crewneck Tee · Soft 333',
  'Everyday cotton crewneck with a soft handfeel and clean hem. Available in brown with complementary black styling details.',
  87.75,
  71.96,
  61,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'studio', 'satin', 'brown', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Archive Silk Camisole · Velvet 334',
  'Bias camisole with adjustable straps — layering essential. Available in yellow with complementary white styling details.',
  92.5,
  null,
  62,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'archive', 'wool', 'yellow', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Heritage Oversized Shirt · Paper 335',
  'Relaxed button-up with dropped shoulders and curved hem. Available in purple with complementary blue styling details.',
  91.0,
  78.26,
  63,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'heritage', 'denim', 'purple', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Airy Fine-Knit Sweater · Harbor 336',
  'Fine-gauge knit with a neat rib trim and soft stretch. Available in orange with complementary navy styling details.',
  95.75,
  84.26,
  64,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'airy', 'poplin', 'orange', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Sculpted Ribbed Tank · Oak 337',
  'Contour rib tank for layering or warm-weather wear. Available in multicolor with complementary red styling details.',
  100.5,
  null,
  65,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'sculpted', 'jersey', 'multicolor', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Refined Poplin Shirt · Studio 338',
  'Crisp poplin shirt tailored for office and weekend outfits. Available in black with complementary green styling details.',
  45.75,
  35.69,
  66,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'refined', 'twill', 'black', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Effortless Hoodie · Quiet 339',
  'Brushed-back hoodie with kangaroo pocket and relaxed fit. Available in white with complementary beige styling details.',
  50.5,
  40.4,
  67,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'effortless', 'cashmere blend', 'white', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Classic Linen Blouse · Atelier 340',
  'Lightweight linen blouse with a refined collar and easy drape. Available in blue with complementary pink styling details.',
  49.0,
  null,
  8,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'classic', 'linen', 'blue', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Modern Crewneck Tee · Maison 341',
  'Everyday cotton crewneck with a soft handfeel and clean hem. Available in navy with complementary grey styling details.',
  53.75,
  45.15,
  9,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'modern', 'cotton', 'navy', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Relaxed Silk Camisole · Coastal 342',
  'Bias camisole with adjustable straps — layering essential. Available in red with complementary brown styling details.',
  58.5,
  50.31,
  10,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'relaxed', 'silk', 'red', 'tops', 'curated', 'styla-seed']::text[],
  true,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Tailored Oversized Shirt · Nordic 343',
  'Relaxed button-up with dropped shoulders and curved hem. Available in green with complementary yellow styling details.',
  63.25,
  null,
  11,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'tailored', 'satin', 'green', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Essential Fine-Knit Sweater · City 344',
  'Fine-gauge knit with a neat rib trim and soft stretch. Available in beige with complementary purple styling details.',
  68.0,
  61.2,
  12,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'essential', 'wool', 'beige', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Elevated Ribbed Tank · River 345',
  'Contour rib tank for layering or warm-weather wear. Available in pink with complementary orange styling details.',
  66.5,
  51.87,
  13,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'elevated', 'denim', 'pink', 'tops', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Soft Poplin Shirt · Trail 346',
  'Crisp poplin shirt tailored for office and weekend outfits. Available in grey with complementary multicolor styling details.',
  71.25,
  null,
  14,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'soft', 'poplin', 'grey', 'tops', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Structured Hoodie · Lumen 347',
  'Brushed-back hoodie with kangaroo pocket and relaxed fit. Available in brown with complementary black styling details.',
  76.0,
  62.32,
  15,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'structured', 'jersey', 'brown', 'tops', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Everyday Twill Blouse · Soft 348',
  'Lightweight twill blouse with a refined collar and easy drape. Available in yellow with complementary white styling details.',
  80.75,
  67.83,
  16,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'twill', 'yellow', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Luxe Crewneck Tee · Velvet 349',
  'Everyday cotton crewneck with a soft handfeel and clean hem. Available in purple with complementary blue styling details.',
  85.5,
  null,
  17,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'luxe', 'cashmere blend', 'purple', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Minimal Silk Camisole · Paper 350',
  'Bias camisole with adjustable straps — layering essential. Available in orange with complementary navy styling details.',
  84.0,
  73.92,
  18,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'minimal', 'linen', 'orange', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Urban Oversized Shirt · Harbor 351',
  'Relaxed button-up with dropped shoulders and curved hem. Available in multicolor with complementary red styling details.',
  88.75,
  79.88,
  19,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'urban', 'cotton', 'multicolor', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Coastal Fine-Knit Sweater · Oak 352',
  'Fine-gauge knit with a neat rib trim and soft stretch. Available in black with complementary green styling details.',
  93.5,
  null,
  20,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'coastal', 'silk', 'black', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Studio Ribbed Tank · Studio 353',
  'Contour rib tank for layering or warm-weather wear. Available in white with complementary beige styling details.',
  98.25,
  78.6,
  21,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'studio', 'satin', 'white', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Archive Poplin Shirt · Quiet 354',
  'Crisp poplin shirt tailored for office and weekend outfits. Available in blue with complementary pink styling details.',
  103.0,
  84.46,
  22,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'archive', 'wool', 'blue', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Heritage Hoodie · Atelier 355',
  'Brushed-back hoodie with kangaroo pocket and relaxed fit. Available in navy with complementary grey styling details.',
  42.0,
  null,
  23,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'heritage', 'denim', 'navy', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Airy Poplin Blouse · Maison 356',
  'Lightweight poplin blouse with a refined collar and easy drape. Available in red with complementary brown styling details.',
  46.75,
  40.2,
  24,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'airy', 'poplin', 'red', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Sculpted Crewneck Tee · Coastal 357',
  'Everyday cotton crewneck with a soft handfeel and clean hem. Available in green with complementary yellow styling details.',
  51.5,
  45.32,
  25,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'sculpted', 'jersey', 'green', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Refined Silk Camisole · Nordic 358',
  'Bias camisole with adjustable straps — layering essential. Available in beige with complementary purple styling details.',
  56.25,
  null,
  26,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'refined', 'twill', 'beige', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Effortless Oversized Shirt · City 359',
  'Relaxed button-up with dropped shoulders and curved hem. Available in pink with complementary orange styling details.',
  61.0,
  47.58,
  27,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'effortless', 'cashmere blend', 'pink', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Classic Fine-Knit Sweater · River 360',
  'Fine-gauge knit with a neat rib trim and soft stretch. Available in grey with complementary multicolor styling details.',
  59.5,
  47.6,
  28,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'classic', 'linen', 'grey', 'tops', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Modern Ribbed Tank · Trail 361',
  'Contour rib tank for layering or warm-weather wear. Available in brown with complementary black styling details.',
  64.25,
  null,
  29,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'modern', 'cotton', 'brown', 'tops', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Relaxed Poplin Shirt · Lumen 362',
  'Crisp poplin shirt tailored for office and weekend outfits. Available in yellow with complementary white styling details.',
  69.0,
  57.96,
  30,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'relaxed', 'silk', 'yellow', 'tops', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Tailored Hoodie · Soft 363',
  'Brushed-back hoodie with kangaroo pocket and relaxed fit. Available in purple with complementary blue styling details.',
  73.75,
  63.42,
  31,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'tailored', 'satin', 'purple', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Essential Wool Blouse · Velvet 364',
  'Lightweight wool blouse with a refined collar and easy drape. Available in orange with complementary navy styling details.',
  78.5,
  null,
  32,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'essential', 'wool', 'orange', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Elevated Crewneck Tee · Paper 365',
  'Everyday cotton crewneck with a soft handfeel and clean hem. Available in multicolor with complementary red styling details.',
  77.0,
  69.3,
  33,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'elevated', 'denim', 'multicolor', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Soft Silk Camisole · Harbor 366',
  'Bias camisole with adjustable straps — layering essential. Available in black with complementary green styling details.',
  81.75,
  63.77,
  34,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'soft', 'poplin', 'black', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Structured Oversized Shirt · Oak 367',
  'Relaxed button-up with dropped shoulders and curved hem. Available in white with complementary beige styling details.',
  86.5,
  null,
  35,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'structured', 'jersey', 'white', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Everyday Fine-Knit Sweater · Studio 368',
  'Fine-gauge knit with a neat rib trim and soft stretch. Available in blue with complementary pink styling details.',
  91.25,
  74.83,
  36,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'twill', 'blue', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Luxe Ribbed Tank · Quiet 369',
  'Contour rib tank for layering or warm-weather wear. Available in navy with complementary grey styling details.',
  96.0,
  80.64,
  37,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'luxe', 'cashmere blend', 'navy', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Minimal Poplin Shirt · Atelier 370',
  'Crisp poplin shirt tailored for office and weekend outfits. Available in red with complementary brown styling details.',
  94.5,
  null,
  38,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'minimal', 'linen', 'red', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Urban Hoodie · Maison 371',
  'Brushed-back hoodie with kangaroo pocket and relaxed fit. Available in green with complementary yellow styling details.',
  99.25,
  87.34,
  39,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'urban', 'cotton', 'green', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Coastal Silk Blouse · Coastal 372',
  'Lightweight silk blouse with a refined collar and easy drape. Available in beige with complementary purple styling details.',
  44.5,
  40.05,
  40,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'coastal', 'silk', 'beige', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Studio Crewneck Tee · Nordic 373',
  'Everyday cotton crewneck with a soft handfeel and clean hem. Available in pink with complementary orange styling details.',
  49.25,
  null,
  41,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'studio', 'satin', 'pink', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Archive Silk Camisole · City 374',
  'Bias camisole with adjustable straps — layering essential. Available in grey with complementary multicolor styling details.',
  54.0,
  43.2,
  42,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'archive', 'wool', 'grey', 'tops', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Heritage Oversized Shirt · River 375',
  'Relaxed button-up with dropped shoulders and curved hem. Available in brown with complementary black styling details.',
  52.5,
  43.05,
  43,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'heritage', 'denim', 'brown', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Airy Fine-Knit Sweater · Trail 376',
  'Fine-gauge knit with a neat rib trim and soft stretch. Available in yellow with complementary white styling details.',
  57.25,
  null,
  44,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'airy', 'poplin', 'yellow', 'tops', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Sculpted Ribbed Tank · Lumen 377',
  'Contour rib tank for layering or warm-weather wear. Available in purple with complementary blue styling details.',
  62.0,
  53.32,
  45,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'sculpted', 'jersey', 'purple', 'tops', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Refined Poplin Shirt · Soft 378',
  'Crisp poplin shirt tailored for office and weekend outfits. Available in orange with complementary navy styling details.',
  66.75,
  58.74,
  46,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'refined', 'twill', 'orange', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Effortless Hoodie · Velvet 379',
  'Brushed-back hoodie with kangaroo pocket and relaxed fit. Available in multicolor with complementary red styling details.',
  71.5,
  null,
  47,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'effortless', 'cashmere blend', 'multicolor', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Classic Linen Blouse · Paper 380',
  'Lightweight linen blouse with a refined collar and easy drape. Available in black with complementary green styling details.',
  70.0,
  54.6,
  48,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'classic', 'linen', 'black', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Modern Crewneck Tee · Harbor 381',
  'Everyday cotton crewneck with a soft handfeel and clean hem. Available in white with complementary beige styling details.',
  74.75,
  59.8,
  49,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'modern', 'cotton', 'white', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'tops'),
  'Relaxed Silk Camisole · Oak 382',
  'Bias camisole with adjustable straps — layering essential. Available in blue with complementary pink styling details.',
  79.5,
  null,
  50,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['top', 'layering', 'everyday', 'relaxed', 'silk', 'blue', 'tops', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Tailored Tailored Skirt · Nordic 103',
  'Knee-length tailored skirt with lined interior and hidden zip. Available in navy with complementary grey styling details.',
  72.25,
  null,
  11,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'tailored', 'satin', 'navy', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Essential Straight Leg Pants · City 104',
  'Straight-leg pants with a polished waistband and easy stretch. Available in red with complementary brown styling details.',
  77.0,
  66.22,
  12,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'essential', 'wool', 'red', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Elevated Cargo Pants · River 105',
  'Utility cargo pants with structured pockets and tapered ankle. Available in green with complementary yellow styling details.',
  75.5,
  66.44,
  13,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'elevated', 'green', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Soft Pleated Trousers · Trail 106',
  'Soft pleated trousers for work-to-weekend dressing. Available in beige with complementary purple styling details.',
  80.25,
  null,
  14,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'soft', 'poplin', 'beige', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Structured Denim Shorts · Lumen 107',
  'Mid-rise denim shorts with a soft break-in wash. Available in pink with complementary orange styling details.',
  85.0,
  66.3,
  15,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'structured', 'jersey', 'pink', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Everyday Wide-Leg Trousers · Soft 108',
  'High-rise wide-leg trousers with a pressed crease and soft stretch. Available in grey with complementary multicolor styling details.',
  89.75,
  71.8,
  16,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'everyday', 'twill', 'grey', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Luxe Slim Jeans · Velvet 109',
  'Classic slim denim with a clean finish and mid rise. Available in brown with complementary black styling details.',
  94.5,
  null,
  17,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'luxe', 'cashmere blend', 'brown', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Minimal Linen Culottes · Paper 110',
  'Breathable linen-blend culottes with side pockets. Available in yellow with complementary white styling details.',
  93.0,
  78.12,
  18,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'minimal', 'linen', 'yellow', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Urban Tailored Skirt · Harbor 111',
  'Knee-length tailored skirt with lined interior and hidden zip. Available in purple with complementary blue styling details.',
  97.75,
  84.06,
  19,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'urban', 'cotton', 'purple', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Coastal Straight Leg Pants · Oak 112',
  'Straight-leg pants with a polished waistband and easy stretch. Available in orange with complementary navy styling details.',
  102.5,
  null,
  20,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'coastal', 'silk', 'orange', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop;

with shop as (
  select id as shop_id from public.shops order by created_at asc limit 1
),
cats as (
  select id, slug from public.categories
)
insert into public.products (
  shop_id, category_id, title, description, price, discount_price,
  stock, brand, images, colors, sizes, tags, featured, rating
)

select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Studio Cargo Pants · Studio 113',
  'Utility cargo pants with structured pockets and tapered ankle. Available in multicolor with complementary red styling details.',
  107.25,
  96.53,
  21,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'studio', 'satin', 'multicolor', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Archive Pleated Trousers · Quiet 114',
  'Soft pleated trousers for work-to-weekend dressing. Available in black with complementary green styling details.',
  112.0,
  87.36,
  22,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'archive', 'wool', 'black', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Heritage Denim Shorts · Atelier 115',
  'Mid-rise denim shorts with a soft break-in wash. Available in white with complementary beige styling details.',
  110.5,
  null,
  23,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'heritage', 'white', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Airy Wide-Leg Trousers · Maison 116',
  'High-rise wide-leg trousers with a pressed crease and soft stretch. Available in blue with complementary pink styling details.',
  115.25,
  94.51,
  24,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'airy', 'poplin', 'blue', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Sculpted Slim Jeans · Coastal 117',
  'Classic slim denim with a clean finish and mid rise. Available in navy with complementary grey styling details.',
  60.5,
  50.82,
  25,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'sculpted', 'jersey', 'navy', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Refined Linen Culottes · Nordic 118',
  'Breathable linen-blend culottes with side pockets. Available in red with complementary brown styling details.',
  65.25,
  null,
  26,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'refined', 'twill', 'red', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Effortless Tailored Skirt · City 119',
  'Knee-length tailored skirt with lined interior and hidden zip. Available in green with complementary yellow styling details.',
  70.0,
  61.6,
  27,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'effortless', 'cashmere blend', 'green', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Classic Straight Leg Pants · River 120',
  'Straight-leg pants with a polished waistband and easy stretch. Available in beige with complementary purple styling details.',
  68.5,
  61.65,
  28,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'classic', 'linen', 'beige', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Modern Cargo Pants · Trail 121',
  'Utility cargo pants with structured pockets and tapered ankle. Available in pink with complementary orange styling details.',
  73.25,
  null,
  29,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'modern', 'cotton', 'pink', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Relaxed Pleated Trousers · Lumen 122',
  'Soft pleated trousers for work-to-weekend dressing. Available in grey with complementary multicolor styling details.',
  78.0,
  62.4,
  30,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'relaxed', 'silk', 'grey', 'curated', 'styla-seed']::text[],
  true,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Tailored Denim Shorts · Soft 123',
  'Mid-rise denim shorts with a soft break-in wash. Available in brown with complementary black styling details.',
  82.75,
  67.86,
  31,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'tailored', 'satin', 'brown', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Essential Wide-Leg Trousers · Velvet 124',
  'High-rise wide-leg trousers with a pressed crease and soft stretch. Available in yellow with complementary white styling details.',
  87.5,
  null,
  32,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'essential', 'wool', 'yellow', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Elevated Slim Jeans · Paper 125',
  'Classic slim denim with a clean finish and mid rise. Available in purple with complementary blue styling details.',
  86.0,
  73.96,
  33,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'elevated', 'purple', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Soft Linen Culottes · Harbor 126',
  'Breathable linen-blend culottes with side pockets. Available in orange with complementary navy styling details.',
  90.75,
  79.86,
  34,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'soft', 'poplin', 'orange', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Structured Tailored Skirt · Oak 127',
  'Knee-length tailored skirt with lined interior and hidden zip. Available in multicolor with complementary red styling details.',
  95.5,
  null,
  35,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'structured', 'jersey', 'multicolor', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Everyday Straight Leg Pants · Studio 128',
  'Straight-leg pants with a polished waistband and easy stretch. Available in black with complementary green styling details.',
  100.25,
  78.2,
  36,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'everyday', 'twill', 'black', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Luxe Cargo Pants · Quiet 129',
  'Utility cargo pants with structured pockets and tapered ankle. Available in white with complementary beige styling details.',
  105.0,
  84.0,
  37,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'luxe', 'cashmere blend', 'white', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Minimal Pleated Trousers · Atelier 130',
  'Soft pleated trousers for work-to-weekend dressing. Available in blue with complementary pink styling details.',
  103.5,
  null,
  38,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'minimal', 'linen', 'blue', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Urban Denim Shorts · Maison 131',
  'Mid-rise denim shorts with a soft break-in wash. Available in navy with complementary grey styling details.',
  108.25,
  90.93,
  39,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'urban', 'cotton', 'navy', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Coastal Wide-Leg Trousers · Coastal 132',
  'High-rise wide-leg trousers with a pressed crease and soft stretch. Available in red with complementary brown styling details.',
  113.0,
  97.18,
  40,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'coastal', 'silk', 'red', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Studio Slim Jeans · Nordic 133',
  'Classic slim denim with a clean finish and mid rise. Available in green with complementary yellow styling details.',
  117.75,
  null,
  41,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'studio', 'satin', 'green', 'curated', 'styla-seed']::text[],
  true,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Archive Linen Culottes · City 134',
  'Breathable linen-blend culottes with side pockets. Available in beige with complementary purple styling details.',
  63.0,
  56.7,
  42,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'archive', 'wool', 'beige', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Heritage Tailored Skirt · River 135',
  'Knee-length tailored skirt with lined interior and hidden zip. Available in pink with complementary orange styling details.',
  61.5,
  47.97,
  43,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'heritage', 'pink', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Airy Straight Leg Pants · Trail 136',
  'Straight-leg pants with a polished waistband and easy stretch. Available in grey with complementary multicolor styling details.',
  66.25,
  null,
  44,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'airy', 'poplin', 'grey', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Sculpted Cargo Pants · Lumen 137',
  'Utility cargo pants with structured pockets and tapered ankle. Available in brown with complementary black styling details.',
  71.0,
  58.22,
  45,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'sculpted', 'jersey', 'brown', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Refined Pleated Trousers · Soft 138',
  'Soft pleated trousers for work-to-weekend dressing. Available in yellow with complementary white styling details.',
  75.75,
  63.63,
  46,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'refined', 'twill', 'yellow', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Effortless Denim Shorts · Velvet 139',
  'Mid-rise denim shorts with a soft break-in wash. Available in purple with complementary blue styling details.',
  80.5,
  null,
  47,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'effortless', 'cashmere blend', 'purple', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Classic Wide-Leg Trousers · Paper 140',
  'High-rise wide-leg trousers with a pressed crease and soft stretch. Available in orange with complementary navy styling details.',
  79.0,
  69.52,
  48,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'classic', 'linen', 'orange', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Modern Slim Jeans · Harbor 141',
  'Classic slim denim with a clean finish and mid rise. Available in multicolor with complementary red styling details.',
  83.75,
  75.38,
  49,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'modern', 'cotton', 'multicolor', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Relaxed Linen Culottes · Oak 142',
  'Breathable linen-blend culottes with side pockets. Available in black with complementary green styling details.',
  88.5,
  null,
  50,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'relaxed', 'silk', 'black', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Tailored Tailored Skirt · Studio 143',
  'Knee-length tailored skirt with lined interior and hidden zip. Available in white with complementary beige styling details.',
  93.25,
  74.6,
  51,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'tailored', 'satin', 'white', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Essential Straight Leg Pants · Quiet 144',
  'Straight-leg pants with a polished waistband and easy stretch. Available in blue with complementary pink styling details.',
  98.0,
  80.36,
  52,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'essential', 'wool', 'blue', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Elevated Cargo Pants · Atelier 145',
  'Utility cargo pants with structured pockets and tapered ankle. Available in navy with complementary grey styling details.',
  96.5,
  null,
  53,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'elevated', 'navy', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Soft Pleated Trousers · Maison 146',
  'Soft pleated trousers for work-to-weekend dressing. Available in red with complementary brown styling details.',
  101.25,
  87.08,
  54,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'soft', 'poplin', 'red', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Structured Denim Shorts · Coastal 147',
  'Mid-rise denim shorts with a soft break-in wash. Available in green with complementary yellow styling details.',
  106.0,
  93.28,
  55,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'structured', 'jersey', 'green', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Everyday Wide-Leg Trousers · Nordic 148',
  'High-rise wide-leg trousers with a pressed crease and soft stretch. Available in beige with complementary purple styling details.',
  110.75,
  null,
  56,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'everyday', 'twill', 'beige', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Luxe Slim Jeans · City 149',
  'Classic slim denim with a clean finish and mid rise. Available in pink with complementary orange styling details.',
  115.5,
  90.09,
  57,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'luxe', 'cashmere blend', 'pink', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Minimal Linen Culottes · River 150',
  'Breathable linen-blend culottes with side pockets. Available in grey with complementary multicolor styling details.',
  114.0,
  91.2,
  58,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'minimal', 'linen', 'grey', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Urban Tailored Skirt · Trail 151',
  'Knee-length tailored skirt with lined interior and hidden zip. Available in brown with complementary black styling details.',
  59.25,
  null,
  59,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'urban', 'cotton', 'brown', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Coastal Straight Leg Pants · Lumen 152',
  'Straight-leg pants with a polished waistband and easy stretch. Available in yellow with complementary white styling details.',
  64.0,
  53.76,
  60,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'coastal', 'silk', 'yellow', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Studio Cargo Pants · Soft 153',
  'Utility cargo pants with structured pockets and tapered ankle. Available in purple with complementary blue styling details.',
  68.75,
  59.12,
  61,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'studio', 'satin', 'purple', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Archive Pleated Trousers · Velvet 154',
  'Soft pleated trousers for work-to-weekend dressing. Available in orange with complementary navy styling details.',
  73.5,
  null,
  62,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'archive', 'wool', 'orange', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Heritage Denim Shorts · Paper 155',
  'Mid-rise denim shorts with a soft break-in wash. Available in multicolor with complementary red styling details.',
  72.0,
  64.8,
  63,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'heritage', 'multicolor', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Airy Wide-Leg Trousers · Harbor 156',
  'High-rise wide-leg trousers with a pressed crease and soft stretch. Available in black with complementary green styling details.',
  76.75,
  59.87,
  64,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'airy', 'poplin', 'black', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Sculpted Slim Jeans · Oak 157',
  'Classic slim denim with a clean finish and mid rise. Available in white with complementary beige styling details.',
  81.5,
  null,
  65,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'sculpted', 'jersey', 'white', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Refined Linen Culottes · Studio 158',
  'Breathable linen-blend culottes with side pockets. Available in blue with complementary pink styling details.',
  86.25,
  70.73,
  66,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'refined', 'twill', 'blue', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Effortless Tailored Skirt · Quiet 159',
  'Knee-length tailored skirt with lined interior and hidden zip. Available in navy with complementary grey styling details.',
  91.0,
  76.44,
  67,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'effortless', 'cashmere blend', 'navy', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Classic Straight Leg Pants · Atelier 160',
  'Straight-leg pants with a polished waistband and easy stretch. Available in red with complementary brown styling details.',
  89.5,
  null,
  8,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'classic', 'linen', 'red', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Modern Cargo Pants · Maison 161',
  'Utility cargo pants with structured pockets and tapered ankle. Available in green with complementary yellow styling details.',
  94.25,
  82.94,
  9,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'modern', 'cotton', 'green', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Relaxed Pleated Trousers · Coastal 162',
  'Soft pleated trousers for work-to-weekend dressing. Available in beige with complementary purple styling details.',
  99.0,
  89.1,
  10,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'relaxed', 'silk', 'beige', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Tailored Denim Shorts · Nordic 163',
  'Mid-rise denim shorts with a soft break-in wash. Available in pink with complementary orange styling details.',
  103.75,
  null,
  11,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'tailored', 'satin', 'pink', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Essential Wide-Leg Trousers · City 164',
  'High-rise wide-leg trousers with a pressed crease and soft stretch. Available in grey with complementary multicolor styling details.',
  108.5,
  86.8,
  12,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'essential', 'wool', 'grey', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Elevated Slim Jeans · River 165',
  'Classic slim denim with a clean finish and mid rise. Available in brown with complementary black styling details.',
  107.0,
  87.74,
  13,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'elevated', 'brown', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Soft Linen Culottes · Trail 166',
  'Breathable linen-blend culottes with side pockets. Available in yellow with complementary white styling details.',
  111.75,
  null,
  14,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'soft', 'poplin', 'yellow', 'curated', 'styla-seed']::text[],
  true,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Structured Tailored Skirt · Lumen 167',
  'Knee-length tailored skirt with lined interior and hidden zip. Available in purple with complementary blue styling details.',
  116.5,
  100.19,
  15,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'structured', 'jersey', 'purple', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Everyday Straight Leg Pants · Soft 168',
  'Straight-leg pants with a polished waistband and easy stretch. Available in orange with complementary navy styling details.',
  61.75,
  54.34,
  16,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'everyday', 'twill', 'orange', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Luxe Cargo Pants · Velvet 169',
  'Utility cargo pants with structured pockets and tapered ankle. Available in multicolor with complementary red styling details.',
  66.5,
  null,
  17,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'luxe', 'cashmere blend', 'multicolor', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Minimal Pleated Trousers · Paper 170',
  'Soft pleated trousers for work-to-weekend dressing. Available in black with complementary green styling details.',
  65.0,
  50.7,
  18,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'minimal', 'linen', 'black', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Urban Denim Shorts · Harbor 171',
  'Mid-rise denim shorts with a soft break-in wash. Available in white with complementary beige styling details.',
  69.75,
  55.8,
  19,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'urban', 'cotton', 'white', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Coastal Wide-Leg Trousers · Oak 172',
  'High-rise wide-leg trousers with a pressed crease and soft stretch. Available in blue with complementary pink styling details.',
  74.5,
  null,
  20,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'coastal', 'silk', 'blue', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Studio Slim Jeans · Studio 173',
  'Classic slim denim with a clean finish and mid rise. Available in navy with complementary grey styling details.',
  79.25,
  66.57,
  21,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'studio', 'satin', 'navy', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Archive Linen Culottes · Quiet 174',
  'Breathable linen-blend culottes with side pockets. Available in red with complementary brown styling details.',
  84.0,
  72.24,
  22,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'archive', 'wool', 'red', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Heritage Tailored Skirt · Atelier 175',
  'Knee-length tailored skirt with lined interior and hidden zip. Available in green with complementary yellow styling details.',
  82.5,
  null,
  23,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'heritage', 'green', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Airy Straight Leg Pants · Maison 176',
  'Straight-leg pants with a polished waistband and easy stretch. Available in beige with complementary purple styling details.',
  87.25,
  78.53,
  24,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'airy', 'poplin', 'beige', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Sculpted Cargo Pants · Coastal 177',
  'Utility cargo pants with structured pockets and tapered ankle. Available in pink with complementary orange styling details.',
  92.0,
  71.76,
  25,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'sculpted', 'jersey', 'pink', 'curated', 'styla-seed']::text[],
  true,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Refined Pleated Trousers · Nordic 178',
  'Soft pleated trousers for work-to-weekend dressing. Available in grey with complementary multicolor styling details.',
  96.75,
  null,
  26,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'refined', 'twill', 'grey', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Effortless Denim Shorts · City 179',
  'Mid-rise denim shorts with a soft break-in wash. Available in brown with complementary black styling details.',
  101.5,
  83.23,
  27,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'effortless', 'cashmere blend', 'brown', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Classic Wide-Leg Trousers · River 180',
  'High-rise wide-leg trousers with a pressed crease and soft stretch. Available in yellow with complementary white styling details.',
  100.0,
  84.0,
  28,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'classic', 'linen', 'yellow', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Modern Slim Jeans · Trail 181',
  'Classic slim denim with a clean finish and mid rise. Available in purple with complementary blue styling details.',
  104.75,
  null,
  29,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'modern', 'cotton', 'purple', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Relaxed Linen Culottes · Lumen 182',
  'Breathable linen-blend culottes with side pockets. Available in orange with complementary navy styling details.',
  109.5,
  96.36,
  30,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'relaxed', 'silk', 'orange', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Tailored Tailored Skirt · Soft 183',
  'Knee-length tailored skirt with lined interior and hidden zip. Available in multicolor with complementary red styling details.',
  114.25,
  102.83,
  31,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'tailored', 'satin', 'multicolor', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Essential Straight Leg Pants · Velvet 184',
  'Straight-leg pants with a polished waistband and easy stretch. Available in black with complementary green styling details.',
  119.0,
  null,
  32,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'essential', 'wool', 'black', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Elevated Cargo Pants · Paper 185',
  'Utility cargo pants with structured pockets and tapered ankle. Available in white with complementary beige styling details.',
  58.0,
  46.4,
  33,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'elevated', 'white', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Soft Pleated Trousers · Harbor 186',
  'Soft pleated trousers for work-to-weekend dressing. Available in blue with complementary pink styling details.',
  62.75,
  51.46,
  34,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'soft', 'poplin', 'blue', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Structured Denim Shorts · Oak 187',
  'Mid-rise denim shorts with a soft break-in wash. Available in navy with complementary grey styling details.',
  67.5,
  null,
  35,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'structured', 'jersey', 'navy', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Everyday Wide-Leg Trousers · Studio 188',
  'High-rise wide-leg trousers with a pressed crease and soft stretch. Available in red with complementary brown styling details.',
  72.25,
  62.13,
  36,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'everyday', 'twill', 'red', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Luxe Slim Jeans · Quiet 189',
  'Classic slim denim with a clean finish and mid rise. Available in green with complementary yellow styling details.',
  77.0,
  67.76,
  37,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'luxe', 'cashmere blend', 'green', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Minimal Linen Culottes · Atelier 190',
  'Breathable linen-blend culottes with side pockets. Available in beige with complementary purple styling details.',
  75.5,
  null,
  38,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'minimal', 'linen', 'beige', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Urban Tailored Skirt · Maison 191',
  'Knee-length tailored skirt with lined interior and hidden zip. Available in pink with complementary orange styling details.',
  80.25,
  62.59,
  39,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'urban', 'cotton', 'pink', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Coastal Straight Leg Pants · Coastal 192',
  'Straight-leg pants with a polished waistband and easy stretch. Available in grey with complementary multicolor styling details.',
  85.0,
  68.0,
  40,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'coastal', 'silk', 'grey', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop;

with shop as (
  select id as shop_id from public.shops order by created_at asc limit 1
),
cats as (
  select id, slug from public.categories
)
insert into public.products (
  shop_id, category_id, title, description, price, discount_price,
  stock, brand, images, colors, sizes, tags, featured, rating
)

select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Studio Cargo Pants · Nordic 193',
  'Utility cargo pants with structured pockets and tapered ankle. Available in brown with complementary black styling details.',
  89.75,
  null,
  41,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'studio', 'satin', 'brown', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Archive Pleated Trousers · City 194',
  'Soft pleated trousers for work-to-weekend dressing. Available in yellow with complementary white styling details.',
  94.5,
  79.38,
  42,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'archive', 'wool', 'yellow', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Heritage Denim Shorts · River 195',
  'Mid-rise denim shorts with a soft break-in wash. Available in purple with complementary blue styling details.',
  93.0,
  79.98,
  43,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'heritage', 'purple', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Airy Wide-Leg Trousers · Trail 196',
  'High-rise wide-leg trousers with a pressed crease and soft stretch. Available in orange with complementary navy styling details.',
  97.75,
  null,
  44,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'airy', 'poplin', 'orange', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Sculpted Slim Jeans · Lumen 197',
  'Classic slim denim with a clean finish and mid rise. Available in multicolor with complementary red styling details.',
  102.5,
  92.25,
  45,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'sculpted', 'jersey', 'multicolor', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Refined Linen Culottes · Soft 198',
  'Breathable linen-blend culottes with side pockets. Available in black with complementary green styling details.',
  107.25,
  83.66,
  46,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'refined', 'twill', 'black', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Effortless Tailored Skirt · Velvet 199',
  'Knee-length tailored skirt with lined interior and hidden zip. Available in white with complementary beige styling details.',
  112.0,
  null,
  47,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'effortless', 'cashmere blend', 'white', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Classic Straight Leg Pants · Paper 200',
  'Straight-leg pants with a polished waistband and easy stretch. Available in blue with complementary pink styling details.',
  110.5,
  90.61,
  48,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'classic', 'linen', 'blue', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Modern Cargo Pants · Harbor 201',
  'Utility cargo pants with structured pockets and tapered ankle. Available in navy with complementary grey styling details.',
  115.25,
  96.81,
  49,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'modern', 'cotton', 'navy', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'bottoms'),
  'Relaxed Pleated Trousers · Oak 202',
  'Soft pleated trousers for work-to-weekend dressing. Available in red with complementary brown styling details.',
  60.5,
  null,
  50,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['bottoms', 'trousers', 'denim', 'relaxed', 'silk', 'red', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Tailored Softshell Blazer · Nordic 103',
  'Unstructured softshell blazer for smart-casual days. Available in navy with complementary grey styling details.',
  132.25,
  null,
  11,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'tailored', 'satin', 'navy', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Essential Bomber Jacket · City 104',
  'Lightweight bomber with rib cuffs and a clean zip front. Available in red with complementary brown styling details.',
  137.0,
  117.82,
  12,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'essential', 'wool', 'red', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Elevated Longline Cardigan · River 105',
  'Open longline cardigan in a soft midweight knit. Available in green with complementary yellow styling details.',
  135.5,
  119.24,
  13,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'elevated', 'denim', 'green', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Soft Field Jacket · Trail 106',
  'Utility field jacket with storm flap and multiple pockets. Available in beige with complementary purple styling details.',
  140.25,
  null,
  14,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'soft', 'poplin', 'beige', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Structured Cropped Jacket · Lumen 107',
  'Cropped jacket with structured shoulders and minimal hardware. Available in pink with complementary orange styling details.',
  145.0,
  113.1,
  15,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'structured', 'jersey', 'pink', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Everyday Wool Coat · Soft 108',
  'Double-faced wool-blend coat with notch lapels and deep pockets. Available in grey with complementary multicolor styling details.',
  149.75,
  119.8,
  16,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'everyday', 'twill', 'grey', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Luxe Quilted Puffer · Velvet 109',
  'Packable quilted puffer with water-repellent shell. Available in brown with complementary black styling details.',
  154.5,
  null,
  17,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'luxe', 'cashmere blend', 'brown', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Minimal Trench Jacket · Paper 110',
  'Cotton gabardine trench with storm flap and belt. Available in yellow with complementary white styling details.',
  153.0,
  128.52,
  18,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'minimal', 'linen', 'yellow', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Urban Softshell Blazer · Harbor 111',
  'Unstructured softshell blazer for smart-casual days. Available in purple with complementary blue styling details.',
  157.75,
  135.66,
  19,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'urban', 'cotton', 'purple', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Coastal Bomber Jacket · Oak 112',
  'Lightweight bomber with rib cuffs and a clean zip front. Available in orange with complementary navy styling details.',
  162.5,
  null,
  20,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'coastal', 'silk', 'orange', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Studio Longline Cardigan · Studio 113',
  'Open longline cardigan in a soft midweight knit. Available in multicolor with complementary red styling details.',
  167.25,
  150.53,
  21,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'studio', 'satin', 'multicolor', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Archive Field Jacket · Quiet 114',
  'Utility field jacket with storm flap and multiple pockets. Available in black with complementary green styling details.',
  172.0,
  134.16,
  22,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'archive', 'wool', 'black', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Heritage Cropped Jacket · Atelier 115',
  'Cropped jacket with structured shoulders and minimal hardware. Available in white with complementary beige styling details.',
  170.5,
  null,
  23,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'heritage', 'denim', 'white', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Airy Wool Coat · Maison 116',
  'Double-faced wool-blend coat with notch lapels and deep pockets. Available in blue with complementary pink styling details.',
  175.25,
  143.71,
  24,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'airy', 'poplin', 'blue', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Sculpted Quilted Puffer · Coastal 117',
  'Packable quilted puffer with water-repellent shell. Available in navy with complementary grey styling details.',
  120.5,
  101.22,
  25,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'sculpted', 'jersey', 'navy', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Refined Trench Jacket · Nordic 118',
  'Cotton gabardine trench with storm flap and belt. Available in red with complementary brown styling details.',
  125.25,
  null,
  26,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'refined', 'twill', 'red', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Effortless Softshell Blazer · City 119',
  'Unstructured softshell blazer for smart-casual days. Available in green with complementary yellow styling details.',
  130.0,
  114.4,
  27,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'effortless', 'cashmere blend', 'green', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Classic Bomber Jacket · River 120',
  'Lightweight bomber with rib cuffs and a clean zip front. Available in beige with complementary purple styling details.',
  128.5,
  115.65,
  28,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'classic', 'linen', 'beige', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Modern Longline Cardigan · Trail 121',
  'Open longline cardigan in a soft midweight knit. Available in pink with complementary orange styling details.',
  133.25,
  null,
  29,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'modern', 'cotton', 'pink', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Relaxed Field Jacket · Lumen 122',
  'Utility field jacket with storm flap and multiple pockets. Available in grey with complementary multicolor styling details.',
  138.0,
  110.4,
  30,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'relaxed', 'silk', 'grey', 'curated', 'styla-seed']::text[],
  true,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Tailored Cropped Jacket · Soft 123',
  'Cropped jacket with structured shoulders and minimal hardware. Available in brown with complementary black styling details.',
  142.75,
  117.06,
  31,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'tailored', 'satin', 'brown', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Essential Wool Coat · Velvet 124',
  'Double-faced wool-blend coat with notch lapels and deep pockets. Available in yellow with complementary white styling details.',
  147.5,
  null,
  32,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'essential', 'wool', 'yellow', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Elevated Quilted Puffer · Paper 125',
  'Packable quilted puffer with water-repellent shell. Available in purple with complementary blue styling details.',
  146.0,
  125.56,
  33,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'elevated', 'denim', 'purple', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Soft Trench Jacket · Harbor 126',
  'Cotton gabardine trench with storm flap and belt. Available in orange with complementary navy styling details.',
  150.75,
  132.66,
  34,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'soft', 'poplin', 'orange', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Structured Softshell Blazer · Oak 127',
  'Unstructured softshell blazer for smart-casual days. Available in multicolor with complementary red styling details.',
  155.5,
  null,
  35,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'structured', 'jersey', 'multicolor', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Everyday Bomber Jacket · Studio 128',
  'Lightweight bomber with rib cuffs and a clean zip front. Available in black with complementary green styling details.',
  160.25,
  125.0,
  36,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'everyday', 'twill', 'black', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Luxe Longline Cardigan · Quiet 129',
  'Open longline cardigan in a soft midweight knit. Available in white with complementary beige styling details.',
  165.0,
  132.0,
  37,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'luxe', 'cashmere blend', 'white', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Minimal Field Jacket · Atelier 130',
  'Utility field jacket with storm flap and multiple pockets. Available in blue with complementary pink styling details.',
  163.5,
  null,
  38,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'minimal', 'linen', 'blue', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Urban Cropped Jacket · Maison 131',
  'Cropped jacket with structured shoulders and minimal hardware. Available in navy with complementary grey styling details.',
  168.25,
  141.33,
  39,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'urban', 'cotton', 'navy', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Coastal Wool Coat · Coastal 132',
  'Double-faced wool-blend coat with notch lapels and deep pockets. Available in red with complementary brown styling details.',
  173.0,
  148.78,
  40,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'coastal', 'silk', 'red', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Studio Quilted Puffer · Nordic 133',
  'Packable quilted puffer with water-repellent shell. Available in green with complementary yellow styling details.',
  177.75,
  null,
  41,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'studio', 'satin', 'green', 'curated', 'styla-seed']::text[],
  true,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Archive Trench Jacket · City 134',
  'Cotton gabardine trench with storm flap and belt. Available in beige with complementary purple styling details.',
  123.0,
  110.7,
  42,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'archive', 'wool', 'beige', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Heritage Softshell Blazer · River 135',
  'Unstructured softshell blazer for smart-casual days. Available in pink with complementary orange styling details.',
  121.5,
  94.77,
  43,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'heritage', 'denim', 'pink', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Airy Bomber Jacket · Trail 136',
  'Lightweight bomber with rib cuffs and a clean zip front. Available in grey with complementary multicolor styling details.',
  126.25,
  null,
  44,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'airy', 'poplin', 'grey', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Sculpted Longline Cardigan · Lumen 137',
  'Open longline cardigan in a soft midweight knit. Available in brown with complementary black styling details.',
  131.0,
  107.42,
  45,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'sculpted', 'jersey', 'brown', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Refined Field Jacket · Soft 138',
  'Utility field jacket with storm flap and multiple pockets. Available in yellow with complementary white styling details.',
  135.75,
  114.03,
  46,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'refined', 'twill', 'yellow', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Effortless Cropped Jacket · Velvet 139',
  'Cropped jacket with structured shoulders and minimal hardware. Available in purple with complementary blue styling details.',
  140.5,
  null,
  47,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'effortless', 'cashmere blend', 'purple', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Classic Wool Coat · Paper 140',
  'Double-faced wool-blend coat with notch lapels and deep pockets. Available in orange with complementary navy styling details.',
  139.0,
  122.32,
  48,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'classic', 'linen', 'orange', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Modern Quilted Puffer · Harbor 141',
  'Packable quilted puffer with water-repellent shell. Available in multicolor with complementary red styling details.',
  143.75,
  129.38,
  49,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'modern', 'cotton', 'multicolor', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Relaxed Trench Jacket · Oak 142',
  'Cotton gabardine trench with storm flap and belt. Available in black with complementary green styling details.',
  148.5,
  null,
  50,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'relaxed', 'silk', 'black', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Tailored Softshell Blazer · Studio 143',
  'Unstructured softshell blazer for smart-casual days. Available in white with complementary beige styling details.',
  153.25,
  122.6,
  51,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'tailored', 'satin', 'white', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Essential Bomber Jacket · Quiet 144',
  'Lightweight bomber with rib cuffs and a clean zip front. Available in blue with complementary pink styling details.',
  158.0,
  129.56,
  52,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'essential', 'wool', 'blue', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Elevated Longline Cardigan · Atelier 145',
  'Open longline cardigan in a soft midweight knit. Available in navy with complementary grey styling details.',
  156.5,
  null,
  53,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'elevated', 'denim', 'navy', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Soft Field Jacket · Maison 146',
  'Utility field jacket with storm flap and multiple pockets. Available in red with complementary brown styling details.',
  161.25,
  138.68,
  54,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'soft', 'poplin', 'red', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Structured Cropped Jacket · Coastal 147',
  'Cropped jacket with structured shoulders and minimal hardware. Available in green with complementary yellow styling details.',
  166.0,
  146.08,
  55,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'structured', 'jersey', 'green', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Everyday Wool Coat · Nordic 148',
  'Double-faced wool-blend coat with notch lapels and deep pockets. Available in beige with complementary purple styling details.',
  170.75,
  null,
  56,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'everyday', 'twill', 'beige', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Luxe Quilted Puffer · City 149',
  'Packable quilted puffer with water-repellent shell. Available in pink with complementary orange styling details.',
  175.5,
  136.89,
  57,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'luxe', 'cashmere blend', 'pink', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Minimal Trench Jacket · River 150',
  'Cotton gabardine trench with storm flap and belt. Available in grey with complementary multicolor styling details.',
  174.0,
  139.2,
  58,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'minimal', 'linen', 'grey', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Urban Softshell Blazer · Trail 151',
  'Unstructured softshell blazer for smart-casual days. Available in brown with complementary black styling details.',
  119.25,
  null,
  59,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'urban', 'cotton', 'brown', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Coastal Bomber Jacket · Lumen 152',
  'Lightweight bomber with rib cuffs and a clean zip front. Available in yellow with complementary white styling details.',
  124.0,
  104.16,
  60,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'coastal', 'silk', 'yellow', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Studio Longline Cardigan · Soft 153',
  'Open longline cardigan in a soft midweight knit. Available in purple with complementary blue styling details.',
  128.75,
  110.72,
  61,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'studio', 'satin', 'purple', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Archive Field Jacket · Velvet 154',
  'Utility field jacket with storm flap and multiple pockets. Available in orange with complementary navy styling details.',
  133.5,
  null,
  62,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'archive', 'wool', 'orange', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Heritage Cropped Jacket · Paper 155',
  'Cropped jacket with structured shoulders and minimal hardware. Available in multicolor with complementary red styling details.',
  132.0,
  118.8,
  63,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'heritage', 'denim', 'multicolor', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Airy Wool Coat · Harbor 156',
  'Double-faced wool-blend coat with notch lapels and deep pockets. Available in black with complementary green styling details.',
  136.75,
  106.67,
  64,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'airy', 'poplin', 'black', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Sculpted Quilted Puffer · Oak 157',
  'Packable quilted puffer with water-repellent shell. Available in white with complementary beige styling details.',
  141.5,
  null,
  65,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'sculpted', 'jersey', 'white', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Refined Trench Jacket · Studio 158',
  'Cotton gabardine trench with storm flap and belt. Available in blue with complementary pink styling details.',
  146.25,
  119.93,
  66,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'refined', 'twill', 'blue', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Effortless Softshell Blazer · Quiet 159',
  'Unstructured softshell blazer for smart-casual days. Available in navy with complementary grey styling details.',
  151.0,
  126.84,
  67,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'effortless', 'cashmere blend', 'navy', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Classic Bomber Jacket · Atelier 160',
  'Lightweight bomber with rib cuffs and a clean zip front. Available in red with complementary brown styling details.',
  149.5,
  null,
  8,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'classic', 'linen', 'red', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Modern Longline Cardigan · Maison 161',
  'Open longline cardigan in a soft midweight knit. Available in green with complementary yellow styling details.',
  154.25,
  135.74,
  9,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'modern', 'cotton', 'green', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Relaxed Field Jacket · Coastal 162',
  'Utility field jacket with storm flap and multiple pockets. Available in beige with complementary purple styling details.',
  159.0,
  143.1,
  10,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'relaxed', 'silk', 'beige', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Tailored Cropped Jacket · Nordic 163',
  'Cropped jacket with structured shoulders and minimal hardware. Available in pink with complementary orange styling details.',
  163.75,
  null,
  11,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'tailored', 'satin', 'pink', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Essential Wool Coat · City 164',
  'Double-faced wool-blend coat with notch lapels and deep pockets. Available in grey with complementary multicolor styling details.',
  168.5,
  134.8,
  12,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'essential', 'wool', 'grey', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Elevated Quilted Puffer · River 165',
  'Packable quilted puffer with water-repellent shell. Available in brown with complementary black styling details.',
  167.0,
  136.94,
  13,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'elevated', 'denim', 'brown', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Soft Trench Jacket · Trail 166',
  'Cotton gabardine trench with storm flap and belt. Available in yellow with complementary white styling details.',
  171.75,
  null,
  14,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'soft', 'poplin', 'yellow', 'curated', 'styla-seed']::text[],
  true,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Structured Softshell Blazer · Lumen 167',
  'Unstructured softshell blazer for smart-casual days. Available in purple with complementary blue styling details.',
  176.5,
  151.79,
  15,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'structured', 'jersey', 'purple', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Everyday Bomber Jacket · Soft 168',
  'Lightweight bomber with rib cuffs and a clean zip front. Available in orange with complementary navy styling details.',
  121.75,
  107.14,
  16,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'everyday', 'twill', 'orange', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Luxe Longline Cardigan · Velvet 169',
  'Open longline cardigan in a soft midweight knit. Available in multicolor with complementary red styling details.',
  126.5,
  null,
  17,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'luxe', 'cashmere blend', 'multicolor', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Minimal Field Jacket · Paper 170',
  'Utility field jacket with storm flap and multiple pockets. Available in black with complementary green styling details.',
  125.0,
  97.5,
  18,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'minimal', 'linen', 'black', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Urban Cropped Jacket · Harbor 171',
  'Cropped jacket with structured shoulders and minimal hardware. Available in white with complementary beige styling details.',
  129.75,
  103.8,
  19,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'urban', 'cotton', 'white', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Coastal Wool Coat · Oak 172',
  'Double-faced wool-blend coat with notch lapels and deep pockets. Available in blue with complementary pink styling details.',
  134.5,
  null,
  20,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'coastal', 'silk', 'blue', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop;

with shop as (
  select id as shop_id from public.shops order by created_at asc limit 1
),
cats as (
  select id, slug from public.categories
)
insert into public.products (
  shop_id, category_id, title, description, price, discount_price,
  stock, brand, images, colors, sizes, tags, featured, rating
)

select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Studio Quilted Puffer · Studio 173',
  'Packable quilted puffer with water-repellent shell. Available in navy with complementary grey styling details.',
  139.25,
  116.97,
  21,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'studio', 'satin', 'navy', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Archive Trench Jacket · Quiet 174',
  'Cotton gabardine trench with storm flap and belt. Available in red with complementary brown styling details.',
  144.0,
  123.84,
  22,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'archive', 'wool', 'red', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Heritage Softshell Blazer · Atelier 175',
  'Unstructured softshell blazer for smart-casual days. Available in green with complementary yellow styling details.',
  142.5,
  null,
  23,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'heritage', 'denim', 'green', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Airy Bomber Jacket · Maison 176',
  'Lightweight bomber with rib cuffs and a clean zip front. Available in beige with complementary purple styling details.',
  147.25,
  132.53,
  24,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'airy', 'poplin', 'beige', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Sculpted Longline Cardigan · Coastal 177',
  'Open longline cardigan in a soft midweight knit. Available in pink with complementary orange styling details.',
  152.0,
  118.56,
  25,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'sculpted', 'jersey', 'pink', 'curated', 'styla-seed']::text[],
  true,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Refined Field Jacket · Nordic 178',
  'Utility field jacket with storm flap and multiple pockets. Available in grey with complementary multicolor styling details.',
  156.75,
  null,
  26,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'refined', 'twill', 'grey', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Effortless Cropped Jacket · City 179',
  'Cropped jacket with structured shoulders and minimal hardware. Available in brown with complementary black styling details.',
  161.5,
  132.43,
  27,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'effortless', 'cashmere blend', 'brown', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Classic Wool Coat · River 180',
  'Double-faced wool-blend coat with notch lapels and deep pockets. Available in yellow with complementary white styling details.',
  160.0,
  134.4,
  28,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'classic', 'linen', 'yellow', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Modern Quilted Puffer · Trail 181',
  'Packable quilted puffer with water-repellent shell. Available in purple with complementary blue styling details.',
  164.75,
  null,
  29,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'modern', 'cotton', 'purple', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Relaxed Trench Jacket · Lumen 182',
  'Cotton gabardine trench with storm flap and belt. Available in orange with complementary navy styling details.',
  169.5,
  149.16,
  30,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'relaxed', 'silk', 'orange', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Tailored Softshell Blazer · Soft 183',
  'Unstructured softshell blazer for smart-casual days. Available in multicolor with complementary red styling details.',
  174.25,
  156.83,
  31,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'tailored', 'satin', 'multicolor', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Essential Bomber Jacket · Velvet 184',
  'Lightweight bomber with rib cuffs and a clean zip front. Available in black with complementary green styling details.',
  179.0,
  null,
  32,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'essential', 'wool', 'black', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Elevated Longline Cardigan · Paper 185',
  'Open longline cardigan in a soft midweight knit. Available in white with complementary beige styling details.',
  118.0,
  94.4,
  33,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'elevated', 'denim', 'white', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Soft Field Jacket · Harbor 186',
  'Utility field jacket with storm flap and multiple pockets. Available in blue with complementary pink styling details.',
  122.75,
  100.66,
  34,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'soft', 'poplin', 'blue', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Structured Cropped Jacket · Oak 187',
  'Cropped jacket with structured shoulders and minimal hardware. Available in navy with complementary grey styling details.',
  127.5,
  null,
  35,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'structured', 'jersey', 'navy', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Everyday Wool Coat · Studio 188',
  'Double-faced wool-blend coat with notch lapels and deep pockets. Available in red with complementary brown styling details.',
  132.25,
  113.73,
  36,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'everyday', 'twill', 'red', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Luxe Quilted Puffer · Quiet 189',
  'Packable quilted puffer with water-repellent shell. Available in green with complementary yellow styling details.',
  137.0,
  120.56,
  37,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'luxe', 'cashmere blend', 'green', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Minimal Trench Jacket · Atelier 190',
  'Cotton gabardine trench with storm flap and belt. Available in beige with complementary purple styling details.',
  135.5,
  null,
  38,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'minimal', 'linen', 'beige', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Urban Softshell Blazer · Maison 191',
  'Unstructured softshell blazer for smart-casual days. Available in pink with complementary orange styling details.',
  140.25,
  109.4,
  39,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'urban', 'cotton', 'pink', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'outerwear'),
  'Coastal Bomber Jacket · Coastal 192',
  'Lightweight bomber with rib cuffs and a clean zip front. Available in grey with complementary multicolor styling details.',
  145.0,
  116.0,
  40,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  ARRAY['outerwear', 'jacket', 'layer', 'coastal', 'silk', 'grey', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Blue Women''s Handbag',
  'The Blue Women''s Handbag is a stylish and spacious accessory for everyday use. With a vibrant blue color and multiple compartments, it combines fashion and functionality.',
  49.99,
  41.05,
  76,
  'Fashionista',
  ARRAY['https://cdn.dummyjson.com/product-images/womens-bags/blue-women''s-handbag/1.webp', 'https://cdn.dummyjson.com/product-images/womens-bags/blue-women''s-handbag/2.webp', 'https://cdn.dummyjson.com/product-images/womens-bags/blue-women''s-handbag/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['fashion accessories', 'handbags', 'accessories', 'dummyjson', 'styla-seed']::text[],
  false,
  3.2
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Heshe Women''s Leather Bag',
  'The Heshe Women''s Leather Bag is a luxurious and high-quality leather bag for the sophisticated woman. With a timeless design and durable craftsmanship, it''s a versatile accessory.',
  129.99,
  null,
  99,
  'Heshe',
  ARRAY['https://cdn.dummyjson.com/product-images/womens-bags/heshe-women''s-leather-bag/1.webp', 'https://cdn.dummyjson.com/product-images/womens-bags/heshe-women''s-leather-bag/2.webp', 'https://cdn.dummyjson.com/product-images/womens-bags/heshe-women''s-leather-bag/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['fashion accessories', 'leather bags', 'accessories', 'dummyjson', 'styla-seed']::text[],
  true,
  4.92
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Prada Women Bag',
  'The Prada Women Bag is an iconic designer bag that exudes elegance and luxury. Crafted with precision and featuring the Prada logo, it''s a statement piece for fashion enthusiasts.',
  599.99,
  515.45,
  75,
  'Prada',
  ARRAY['https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/1.webp', 'https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/2.webp', 'https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['fashion accessories', 'designer bags', 'accessories', 'dummyjson', 'styla-seed']::text[],
  false,
  3.2
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'White Faux Leather Backpack',
  'The White Faux Leather Backpack is a trendy and practical backpack for the modern woman. With a sleek white design and ample storage space, it''s perfect for both casual and on-the-go styles.',
  39.99,
  33.91,
  39,
  'Urban Chic',
  ARRAY['https://cdn.dummyjson.com/product-images/womens-bags/white-faux-leather-backpack/1.webp', 'https://cdn.dummyjson.com/product-images/womens-bags/white-faux-leather-backpack/2.webp', 'https://cdn.dummyjson.com/product-images/womens-bags/white-faux-leather-backpack/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['fashion accessories', 'backpacks', 'accessories', 'dummyjson', 'styla-seed']::text[],
  false,
  3.36
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Women Handbag Black',
  'The Women Handbag in Black is a classic and versatile accessory that complements various outfits. With a timeless black color and functional design, it''s a must-have in every woman''s wardrobe.',
  59.99,
  53.01,
  11,
  'Elegance Collection',
  ARRAY['https://cdn.dummyjson.com/product-images/womens-bags/women-handbag-black/1.webp', 'https://cdn.dummyjson.com/product-images/womens-bags/women-handbag-black/2.webp', 'https://cdn.dummyjson.com/product-images/womens-bags/women-handbag-black/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['fashion accessories', 'handbags', 'accessories', 'dummyjson', 'styla-seed']::text[],
  false,
  3.2
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Green Crystal Earring',
  'The Green Crystal Earring is a dazzling accessory that features a vibrant green crystal. With a classic design, it adds a touch of elegance to your ensemble, perfect for formal or special occasions.',
  29.99,
  25.42,
  54,
  'Styla',
  ARRAY['https://cdn.dummyjson.com/product-images/womens-jewellery/green-crystal-earring/1.webp', 'https://cdn.dummyjson.com/product-images/womens-jewellery/green-crystal-earring/2.webp', 'https://cdn.dummyjson.com/product-images/womens-jewellery/green-crystal-earring/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['fashion accessories', 'earrings', 'accessories', 'dummyjson', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Green Oval Earring',
  'The Green Oval Earring is a stylish and versatile accessory with a unique oval shape. Whether for casual or dressy occasions, its green hue and contemporary design make it a standout piece.',
  24.99,
  21.2,
  73,
  'Styla',
  ARRAY['https://cdn.dummyjson.com/product-images/womens-jewellery/green-oval-earring/1.webp', 'https://cdn.dummyjson.com/product-images/womens-jewellery/green-oval-earring/2.webp', 'https://cdn.dummyjson.com/product-images/womens-jewellery/green-oval-earring/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['fashion accessories', 'earrings', 'accessories', 'dummyjson', 'styla-seed']::text[],
  false,
  3.57
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Tropical Earring',
  'The Tropical Earring is a fun and playful accessory inspired by tropical elements. Featuring vibrant colors and a lively design, it''s perfect for adding a touch of summer to your look.',
  19.99,
  null,
  1,
  'Styla',
  ARRAY['https://cdn.dummyjson.com/product-images/womens-jewellery/tropical-earring/1.webp', 'https://cdn.dummyjson.com/product-images/womens-jewellery/tropical-earring/2.webp', 'https://cdn.dummyjson.com/product-images/womens-jewellery/tropical-earring/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['fashion accessories', 'earrings', 'accessories', 'dummyjson', 'styla-seed']::text[],
  true,
  4.4
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Brown Leather Belt Watch',
  'The Brown Leather Belt Watch is a stylish timepiece with a classic design. Featuring a genuine leather strap and a sleek dial, it adds a touch of sophistication to your look.',
  89.99,
  null,
  32,
  'Fashion Timepieces',
  ARRAY['https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/1.webp', 'https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/2.webp', 'https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['watches', 'leather watches', 'accessories', 'dummyjson', 'styla-seed']::text[],
  false,
  4.19
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Longines Master Collection',
  'The Longines Master Collection is an elegant and refined watch known for its precision and craftsmanship. With a timeless design, it''s a symbol of luxury and sophistication.',
  1499.99,
  1241.39,
  100,
  'Longines',
  ARRAY['https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/1.webp', 'https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/2.webp', 'https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['watches', 'luxury watches', 'accessories', 'dummyjson', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Rolex Cellini Date Black Dial',
  'The Rolex Cellini Date with Black Dial is a classic and prestigious watch. With a black dial and date complication, it exudes sophistication and is a symbol of Rolex''s heritage.',
  8999.99,
  8200.79,
  40,
  'Rolex',
  ARRAY['https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/1.webp', 'https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/2.webp', 'https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['watches', 'luxury watches', 'accessories', 'dummyjson', 'styla-seed']::text[],
  true,
  4.97
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Rolex Cellini Moonphase',
  'The Rolex Cellini Moonphase is a masterpiece of horology, featuring a moon phase complication and exquisite design. It reflects Rolex''s commitment to precision and elegance.',
  12999.99,
  10722.39,
  36,
  'Rolex',
  ARRAY['https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-moonphase/1.webp', 'https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-moonphase/2.webp', 'https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-moonphase/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['watches', 'luxury watches', 'accessories', 'dummyjson', 'styla-seed']::text[],
  false,
  3.2
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Rolex Datejust',
  'The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it''s a symbol of Rolex''s watchmaking excellence.',
  10999.99,
  null,
  86,
  'Rolex',
  ARRAY['https://cdn.dummyjson.com/product-images/mens-watches/rolex-datejust/1.webp', 'https://cdn.dummyjson.com/product-images/mens-watches/rolex-datejust/2.webp', 'https://cdn.dummyjson.com/product-images/mens-watches/rolex-datejust/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['watches', 'luxury watches', 'accessories', 'dummyjson', 'styla-seed']::text[],
  false,
  3.66
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Rolex Submariner Watch',
  'The Rolex Submariner is a legendary dive watch with a rich history. Known for its durability and water resistance, it''s a symbol of adventure and exploration.',
  13999.99,
  null,
  55,
  'Rolex',
  ARRAY['https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/1.webp', 'https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/2.webp', 'https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['watches', 'luxury watches', 'accessories', 'dummyjson', 'styla-seed']::text[],
  false,
  3.2
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'IWC Ingenieur Automatic Steel',
  'The IWC Ingenieur Automatic Steel watch is a durable and sophisticated timepiece. With a stainless steel case and automatic movement, it combines precision and style for watch enthusiasts.',
  4999.99,
  4527.49,
  90,
  'IWC',
  ARRAY['https://cdn.dummyjson.com/product-images/womens-watches/iwc-ingenieur-automatic-steel/1.webp', 'https://cdn.dummyjson.com/product-images/womens-watches/iwc-ingenieur-automatic-steel/2.webp', 'https://cdn.dummyjson.com/product-images/womens-watches/iwc-ingenieur-automatic-steel/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['watches', 'luxury watches', 'accessories', 'dummyjson', 'styla-seed']::text[],
  false,
  3.2
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Rolex Cellini Moonphase',
  'The Rolex Cellini Moonphase watch is a masterpiece of horology. Featuring a moon phase complication, it showcases the craftsmanship and elegance that Rolex is renowned for.',
  15999.99,
  null,
  52,
  'Rolex',
  ARRAY['https://cdn.dummyjson.com/product-images/womens-watches/rolex-cellini-moonphase/1.webp', 'https://cdn.dummyjson.com/product-images/womens-watches/rolex-cellini-moonphase/2.webp', 'https://cdn.dummyjson.com/product-images/womens-watches/rolex-cellini-moonphase/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['watches', 'luxury watches', 'accessories', 'dummyjson', 'styla-seed']::text[],
  false,
  3.83
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Rolex Datejust Women',
  'The Rolex Datejust Women''s watch is an iconic timepiece designed for women. With a timeless design and a date complication, it offers both elegance and functionality.',
  10999.99,
  9246.59,
  4,
  'Rolex',
  ARRAY['https://cdn.dummyjson.com/product-images/womens-watches/rolex-datejust-women/1.webp', 'https://cdn.dummyjson.com/product-images/womens-watches/rolex-datejust-women/2.webp', 'https://cdn.dummyjson.com/product-images/womens-watches/rolex-datejust-women/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['watches', 'luxury watches', 'women''s watches', 'accessories', 'dummyjson', 'styla-seed']::text[],
  false,
  3.2
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Watch Gold for Women',
  'The Gold Women''s Watch is a stunning accessory that combines luxury and style. Featuring a gold-plated case and a chic design, it adds a touch of glamour to any outfit.',
  799.99,
  653.27,
  20,
  'Fashion Gold',
  ARRAY['https://cdn.dummyjson.com/product-images/womens-watches/watch-gold-for-women/1.webp', 'https://cdn.dummyjson.com/product-images/womens-watches/watch-gold-for-women/2.webp', 'https://cdn.dummyjson.com/product-images/womens-watches/watch-gold-for-women/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['watches', 'women''s watches', 'accessories', 'dummyjson', 'styla-seed']::text[],
  true,
  4.24
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Women''s Wrist Watch',
  'The Women''s Wrist Watch is a versatile and fashionable timepiece for everyday wear. With a comfortable strap and a simple yet elegant design, it complements various styles.',
  129.99,
  113.61,
  12,
  'Fashion Co.',
  ARRAY['https://cdn.dummyjson.com/product-images/womens-watches/women''s-wrist-watch/1.webp', 'https://cdn.dummyjson.com/product-images/womens-watches/women''s-wrist-watch/2.webp', 'https://cdn.dummyjson.com/product-images/womens-watches/women''s-wrist-watch/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['watches', 'women''s watches', 'accessories', 'dummyjson', 'styla-seed']::text[],
  false,
  3.52
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Black Sun Glasses',
  'The Black Sun Glasses are a classic and stylish choice, featuring a sleek black frame and tinted lenses. They provide both UV protection and a fashionable look.',
  29.99,
  null,
  60,
  'Fashion Shades',
  ARRAY['https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/1.webp', 'https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/2.webp', 'https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['eyewear', 'sunglasses', 'accessories', 'dummyjson', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Classic Sun Glasses',
  'The Classic Sun Glasses offer a timeless design with a neutral frame and UV-protected lenses. These sunglasses are versatile and suitable for various occasions.',
  24.99,
  null,
  1,
  'Fashion Shades',
  ARRAY['https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/1.webp', 'https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/2.webp', 'https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['eyewear', 'sunglasses', 'accessories', 'dummyjson', 'styla-seed']::text[],
  false,
  3.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Green and Black Glasses',
  'The Green and Black Glasses feature a bold combination of green and black colors, adding a touch of vibrancy to your eyewear collection. They are both stylish and eye-catching.',
  34.99,
  null,
  24,
  'Fashion Shades',
  ARRAY['https://cdn.dummyjson.com/product-images/sunglasses/green-and-black-glasses/1.webp', 'https://cdn.dummyjson.com/product-images/sunglasses/green-and-black-glasses/2.webp', 'https://cdn.dummyjson.com/product-images/sunglasses/green-and-black-glasses/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['eyewear', 'sunglasses', 'accessories', 'dummyjson', 'styla-seed']::text[],
  true,
  4.55
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Party Glasses',
  'The Party Glasses are designed to add flair to your party outfit. With unique shapes or colorful frames, they''re perfect for adding a playful touch to your look during celebrations.',
  19.99,
  17.75,
  86,
  'Fashion Fun',
  ARRAY['https://cdn.dummyjson.com/product-images/sunglasses/party-glasses/1.webp', 'https://cdn.dummyjson.com/product-images/sunglasses/party-glasses/2.webp', 'https://cdn.dummyjson.com/product-images/sunglasses/party-glasses/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['eyewear', 'party glasses', 'accessories', 'dummyjson', 'styla-seed']::text[],
  false,
  3.2
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Sunglasses',
  'The Sunglasses offer a classic and simple design with a focus on functionality. These sunglasses provide essential UV protection while maintaining a timeless look.',
  22.99,
  null,
  27,
  'Fashion Shades',
  ARRAY['https://cdn.dummyjson.com/product-images/sunglasses/sunglasses/1.webp', 'https://cdn.dummyjson.com/product-images/sunglasses/sunglasses/2.webp', 'https://cdn.dummyjson.com/product-images/sunglasses/sunglasses/3.webp']::text[],
  ARRAY['black', 'white', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['eyewear', 'sunglasses', 'accessories', 'dummyjson', 'styla-seed']::text[],
  false,
  3.2
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Urban Minimal Watch · Trail 511',
  'Slim-profile watch with a clean dial and soft strap. Available in green with complementary yellow styling details.',
  47.75,
  null,
  59,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'urban', 'cotton', 'green', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Coastal Hoop Earrings · Lumen 512',
  'Lightweight hoops with a polished finish. Available in beige with complementary purple styling details.',
  52.5,
  47.25,
  60,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'coastal', 'silk', 'beige', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Studio Sunglasses · Soft 513',
  'UV-protective frames with a timeless silhouette. Available in pink with complementary orange styling details.',
  57.25,
  44.66,
  61,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'studio', 'satin', 'pink', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Archive Leather Belt · Velvet 514',
  'Full-grain leather belt with a brushed buckle. Available in grey with complementary multicolor styling details.',
  62.0,
  null,
  62,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'archive', 'wool', 'grey', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Heritage Beanie · Paper 515',
  'Soft rib beanie for cool mornings and travel days. Available in brown with complementary black styling details.',
  60.5,
  49.61,
  63,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'heritage', 'denim', 'brown', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Airy Leather Crossbody · Harbor 516',
  'Compact crossbody in smooth leather with an adjustable strap. Available in yellow with complementary white styling details.',
  65.25,
  54.81,
  64,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'airy', 'poplin', 'yellow', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Sculpted Structured Tote · Oak 517',
  'Everyday tote with interior pockets and a structured base. Available in purple with complementary blue styling details.',
  70.0,
  null,
  65,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'sculpted', 'jersey', 'purple', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Refined Silk Scarf · Studio 518',
  'Printed silk scarf — knot at the neck or style on a bag. Available in orange with complementary navy styling details.',
  74.75,
  65.78,
  66,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'refined', 'twill', 'orange', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Effortless Minimal Watch · Quiet 519',
  'Slim-profile watch with a clean dial and soft strap. Available in multicolor with complementary red styling details.',
  79.5,
  71.55,
  67,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'effortless', 'cashmere blend', 'multicolor', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Classic Hoop Earrings · Atelier 520',
  'Lightweight hoops with a polished finish. Available in black with complementary green styling details.',
  78.0,
  null,
  8,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'classic', 'linen', 'black', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Modern Sunglasses · Maison 521',
  'UV-protective frames with a timeless silhouette. Available in white with complementary beige styling details.',
  82.75,
  66.2,
  9,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1623609163859-ca93c959b98a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'modern', 'cotton', 'white', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Relaxed Leather Belt · Coastal 522',
  'Full-grain leather belt with a brushed buckle. Available in blue with complementary pink styling details.',
  87.5,
  71.75,
  10,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'relaxed', 'silk', 'blue', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Tailored Beanie · Nordic 523',
  'Soft rib beanie for cool mornings and travel days. Available in navy with complementary grey styling details.',
  92.25,
  null,
  11,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'tailored', 'satin', 'navy', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Essential Leather Crossbody · City 524',
  'Compact crossbody in smooth leather with an adjustable strap. Available in red with complementary brown styling details.',
  97.0,
  83.42,
  12,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'essential', 'wool', 'red', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Elevated Structured Tote · River 525',
  'Everyday tote with interior pockets and a structured base. Available in green with complementary yellow styling details.',
  36.0,
  31.68,
  13,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1623609163859-ca93c959b98a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'elevated', 'denim', 'green', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Soft Silk Scarf · Trail 526',
  'Printed silk scarf — knot at the neck or style on a bag. Available in beige with complementary purple styling details.',
  40.75,
  null,
  14,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'soft', 'poplin', 'beige', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Structured Minimal Watch · Lumen 527',
  'Slim-profile watch with a clean dial and soft strap. Available in pink with complementary orange styling details.',
  45.5,
  35.49,
  15,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'structured', 'jersey', 'pink', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Everyday Hoop Earrings · Soft 528',
  'Lightweight hoops with a polished finish. Available in grey with complementary multicolor styling details.',
  50.25,
  40.2,
  16,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1623609163859-ca93c959b98a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'everyday', 'twill', 'grey', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Luxe Sunglasses · Velvet 529',
  'UV-protective frames with a timeless silhouette. Available in brown with complementary black styling details.',
  55.0,
  null,
  17,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'luxe', 'cashmere blend', 'brown', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Minimal Leather Belt · Paper 530',
  'Full-grain leather belt with a brushed buckle. Available in yellow with complementary white styling details.',
  53.5,
  44.94,
  18,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'minimal', 'linen', 'yellow', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Urban Beanie · Harbor 531',
  'Soft rib beanie for cool mornings and travel days. Available in purple with complementary blue styling details.',
  58.25,
  50.09,
  19,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'urban', 'cotton', 'purple', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Coastal Leather Crossbody · Oak 532',
  'Compact crossbody in smooth leather with an adjustable strap. Available in orange with complementary navy styling details.',
  63.0,
  null,
  20,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'coastal', 'silk', 'orange', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Studio Structured Tote · Studio 533',
  'Everyday tote with interior pockets and a structured base. Available in multicolor with complementary red styling details.',
  67.75,
  60.98,
  21,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'studio', 'satin', 'multicolor', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Archive Silk Scarf · Quiet 534',
  'Printed silk scarf — knot at the neck or style on a bag. Available in black with complementary green styling details.',
  72.5,
  56.55,
  22,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'archive', 'wool', 'black', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Heritage Minimal Watch · Atelier 535',
  'Slim-profile watch with a clean dial and soft strap. Available in white with complementary beige styling details.',
  71.0,
  null,
  23,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'heritage', 'denim', 'white', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Airy Hoop Earrings · Maison 536',
  'Lightweight hoops with a polished finish. Available in blue with complementary pink styling details.',
  75.75,
  62.12,
  24,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'airy', 'poplin', 'blue', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Sculpted Sunglasses · Coastal 537',
  'UV-protective frames with a timeless silhouette. Available in navy with complementary grey styling details.',
  80.5,
  67.62,
  25,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'sculpted', 'jersey', 'navy', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Refined Leather Belt · Nordic 538',
  'Full-grain leather belt with a brushed buckle. Available in red with complementary brown styling details.',
  85.25,
  null,
  26,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'refined', 'twill', 'red', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Effortless Beanie · City 539',
  'Soft rib beanie for cool mornings and travel days. Available in green with complementary yellow styling details.',
  90.0,
  79.2,
  27,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'effortless', 'cashmere blend', 'green', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Classic Leather Crossbody · River 540',
  'Compact crossbody in smooth leather with an adjustable strap. Available in beige with complementary purple styling details.',
  88.5,
  79.65,
  28,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'classic', 'linen', 'beige', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Modern Structured Tote · Trail 541',
  'Everyday tote with interior pockets and a structured base. Available in pink with complementary orange styling details.',
  93.25,
  null,
  29,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1623609163859-ca93c959b98a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'modern', 'cotton', 'pink', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Relaxed Silk Scarf · Lumen 542',
  'Printed silk scarf — knot at the neck or style on a bag. Available in grey with complementary multicolor styling details.',
  38.5,
  30.8,
  30,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'relaxed', 'silk', 'grey', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Tailored Minimal Watch · Soft 543',
  'Slim-profile watch with a clean dial and soft strap. Available in brown with complementary black styling details.',
  43.25,
  35.47,
  31,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'tailored', 'satin', 'brown', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Essential Hoop Earrings · Velvet 544',
  'Lightweight hoops with a polished finish. Available in yellow with complementary white styling details.',
  48.0,
  null,
  32,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'essential', 'wool', 'yellow', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Elevated Sunglasses · Paper 545',
  'UV-protective frames with a timeless silhouette. Available in purple with complementary blue styling details.',
  46.5,
  39.99,
  33,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1623609163859-ca93c959b98a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'elevated', 'denim', 'purple', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Soft Leather Belt · Harbor 546',
  'Full-grain leather belt with a brushed buckle. Available in orange with complementary navy styling details.',
  51.25,
  45.1,
  34,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'soft', 'poplin', 'orange', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop;

with shop as (
  select id as shop_id from public.shops order by created_at asc limit 1
),
cats as (
  select id, slug from public.categories
)
insert into public.products (
  shop_id, category_id, title, description, price, discount_price,
  stock, brand, images, colors, sizes, tags, featured, rating
)

select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Structured Beanie · Oak 547',
  'Soft rib beanie for cool mornings and travel days. Available in multicolor with complementary red styling details.',
  56.0,
  null,
  35,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'structured', 'jersey', 'multicolor', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Everyday Leather Crossbody · Studio 548',
  'Compact crossbody in smooth leather with an adjustable strap. Available in black with complementary green styling details.',
  60.75,
  47.39,
  36,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1623609163859-ca93c959b98a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'everyday', 'twill', 'black', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Luxe Structured Tote · Quiet 549',
  'Everyday tote with interior pockets and a structured base. Available in white with complementary beige styling details.',
  65.5,
  52.4,
  37,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'luxe', 'cashmere blend', 'white', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Minimal Silk Scarf · Atelier 550',
  'Printed silk scarf — knot at the neck or style on a bag. Available in blue with complementary pink styling details.',
  64.0,
  null,
  38,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'minimal', 'linen', 'blue', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Urban Minimal Watch · Maison 551',
  'Slim-profile watch with a clean dial and soft strap. Available in navy with complementary grey styling details.',
  68.75,
  57.75,
  39,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'urban', 'cotton', 'navy', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Coastal Hoop Earrings · Coastal 552',
  'Lightweight hoops with a polished finish. Available in red with complementary brown styling details.',
  73.5,
  63.21,
  40,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'coastal', 'silk', 'red', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Studio Sunglasses · Nordic 553',
  'UV-protective frames with a timeless silhouette. Available in green with complementary yellow styling details.',
  78.25,
  null,
  41,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'studio', 'satin', 'green', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Archive Leather Belt · City 554',
  'Full-grain leather belt with a brushed buckle. Available in beige with complementary purple styling details.',
  83.0,
  74.7,
  42,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'archive', 'wool', 'beige', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Heritage Beanie · River 555',
  'Soft rib beanie for cool mornings and travel days. Available in pink with complementary orange styling details.',
  81.5,
  63.57,
  43,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'heritage', 'denim', 'pink', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Airy Leather Crossbody · Trail 556',
  'Compact crossbody in smooth leather with an adjustable strap. Available in grey with complementary multicolor styling details.',
  86.25,
  null,
  44,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'airy', 'poplin', 'grey', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Sculpted Structured Tote · Lumen 557',
  'Everyday tote with interior pockets and a structured base. Available in brown with complementary black styling details.',
  91.0,
  74.62,
  45,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'sculpted', 'jersey', 'brown', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Refined Silk Scarf · Soft 558',
  'Printed silk scarf — knot at the neck or style on a bag. Available in yellow with complementary white styling details.',
  95.75,
  80.43,
  46,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'refined', 'twill', 'yellow', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Effortless Minimal Watch · Velvet 559',
  'Slim-profile watch with a clean dial and soft strap. Available in purple with complementary blue styling details.',
  41.0,
  null,
  47,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'effortless', 'cashmere blend', 'purple', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Classic Hoop Earrings · Paper 560',
  'Lightweight hoops with a polished finish. Available in orange with complementary navy styling details.',
  39.5,
  34.76,
  48,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'classic', 'linen', 'orange', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Modern Sunglasses · Harbor 561',
  'UV-protective frames with a timeless silhouette. Available in multicolor with complementary red styling details.',
  44.25,
  39.83,
  49,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1623609163859-ca93c959b98a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'modern', 'cotton', 'multicolor', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Relaxed Leather Belt · Oak 562',
  'Full-grain leather belt with a brushed buckle. Available in black with complementary green styling details.',
  49.0,
  null,
  50,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'relaxed', 'silk', 'black', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Tailored Beanie · Studio 563',
  'Soft rib beanie for cool mornings and travel days. Available in white with complementary beige styling details.',
  53.75,
  43.0,
  51,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'tailored', 'satin', 'white', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Essential Leather Crossbody · Quiet 564',
  'Compact crossbody in smooth leather with an adjustable strap. Available in blue with complementary pink styling details.',
  58.5,
  47.97,
  52,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'essential', 'wool', 'blue', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Elevated Structured Tote · Atelier 565',
  'Everyday tote with interior pockets and a structured base. Available in navy with complementary grey styling details.',
  57.0,
  null,
  53,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1623609163859-ca93c959b98a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'elevated', 'denim', 'navy', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Soft Silk Scarf · Maison 566',
  'Printed silk scarf — knot at the neck or style on a bag. Available in red with complementary brown styling details.',
  61.75,
  53.1,
  54,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'soft', 'poplin', 'red', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Structured Minimal Watch · Coastal 567',
  'Slim-profile watch with a clean dial and soft strap. Available in green with complementary yellow styling details.',
  66.5,
  58.52,
  55,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'structured', 'jersey', 'green', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Everyday Hoop Earrings · Nordic 568',
  'Lightweight hoops with a polished finish. Available in beige with complementary purple styling details.',
  71.25,
  null,
  56,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1623609163859-ca93c959b98a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'everyday', 'twill', 'beige', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Luxe Sunglasses · City 569',
  'UV-protective frames with a timeless silhouette. Available in pink with complementary orange styling details.',
  76.0,
  59.28,
  57,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'luxe', 'cashmere blend', 'pink', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Minimal Leather Belt · River 570',
  'Full-grain leather belt with a brushed buckle. Available in grey with complementary multicolor styling details.',
  74.5,
  59.6,
  58,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'minimal', 'linen', 'grey', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Urban Beanie · Trail 571',
  'Soft rib beanie for cool mornings and travel days. Available in brown with complementary black styling details.',
  79.25,
  null,
  59,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'urban', 'cotton', 'brown', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Coastal Leather Crossbody · Lumen 572',
  'Compact crossbody in smooth leather with an adjustable strap. Available in yellow with complementary white styling details.',
  84.0,
  70.56,
  60,
  'Lumen Cloth',
  ARRAY['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'coastal', 'silk', 'yellow', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  4.23
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Studio Structured Tote · Soft 573',
  'Everyday tote with interior pockets and a structured base. Available in purple with complementary blue styling details.',
  88.75,
  76.33,
  61,
  'Soft Arc',
  ARRAY['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['purple', 'blue', 'multicolor']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'studio', 'satin', 'purple', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.32
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Archive Silk Scarf · Velvet 574',
  'Printed silk scarf — knot at the neck or style on a bag. Available in orange with complementary navy styling details.',
  93.5,
  null,
  62,
  'Velvet Row',
  ARRAY['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['orange', 'navy', 'black']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'archive', 'wool', 'orange', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.41
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Heritage Minimal Watch · Paper 575',
  'Slim-profile watch with a clean dial and soft strap. Available in multicolor with complementary red styling details.',
  92.0,
  82.8,
  63,
  'Paper & Thread',
  ARRAY['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['multicolor', 'red', 'white']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'heritage', 'denim', 'multicolor', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.5
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Airy Hoop Earrings · Harbor 576',
  'Lightweight hoops with a polished finish. Available in black with complementary green styling details.',
  37.25,
  29.05,
  64,
  'Harbor Knit',
  ARRAY['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['black', 'green', 'blue']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'airy', 'poplin', 'black', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.59
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Sculpted Sunglasses · Oak 577',
  'UV-protective frames with a timeless silhouette. Available in white with complementary beige styling details.',
  42.0,
  null,
  65,
  'Oak & Linen',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['white', 'beige', 'navy']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'sculpted', 'jersey', 'white', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.68
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Refined Leather Belt · Studio 578',
  'Full-grain leather belt with a brushed buckle. Available in blue with complementary pink styling details.',
  46.75,
  38.34,
  66,
  'Studio Meridian',
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['blue', 'pink', 'red']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'refined', 'twill', 'blue', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.77
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Effortless Beanie · Quiet 579',
  'Soft rib beanie for cool mornings and travel days. Available in navy with complementary grey styling details.',
  51.5,
  43.26,
  67,
  'Quiet Luxury Co',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['navy', 'grey', 'green']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'effortless', 'cashmere blend', 'navy', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  4.86
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Classic Leather Crossbody · Atelier 580',
  'Compact crossbody in smooth leather with an adjustable strap. Available in red with complementary brown styling details.',
  50.0,
  null,
  8,
  'Atelier North',
  ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['red', 'brown', 'beige']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'classic', 'linen', 'red', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.6
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Modern Structured Tote · Maison 581',
  'Everyday tote with interior pockets and a structured base. Available in green with complementary yellow styling details.',
  54.75,
  48.18,
  9,
  'Maison Line',
  ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1623609163859-ca93c959b98a?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['green', 'yellow', 'pink']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'modern', 'cotton', 'green', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.69
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Relaxed Silk Scarf · Coastal 582',
  'Printed silk scarf — knot at the neck or style on a bag. Available in beige with complementary purple styling details.',
  59.5,
  53.55,
  10,
  'Coastal Loom',
  ARRAY['https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['beige', 'purple', 'grey']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'relaxed', 'silk', 'beige', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.78
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Tailored Minimal Watch · Nordic 583',
  'Slim-profile watch with a clean dial and soft strap. Available in pink with complementary orange styling details.',
  64.25,
  null,
  11,
  'Nordic Form',
  ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['pink', 'orange', 'brown']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'tailored', 'satin', 'pink', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  3.87
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Essential Hoop Earrings · City 584',
  'Lightweight hoops with a polished finish. Available in grey with complementary multicolor styling details.',
  69.0,
  55.2,
  12,
  'City Frame',
  ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['grey', 'multicolor', 'yellow']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'essential', 'wool', 'grey', 'accessories', 'curated', 'styla-seed']::text[],
  true,
  3.96
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Elevated Sunglasses · River 585',
  'UV-protective frames with a timeless silhouette. Available in brown with complementary black styling details.',
  67.5,
  55.35,
  13,
  'River & Denim',
  ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1623609163859-ca93c959b98a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['brown', 'black', 'purple']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'elevated', 'denim', 'brown', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  4.05
from shop
union all
select
  shop.shop_id,
  (select id from cats where slug = 'accessories'),
  'Soft Leather Belt · Trail 586',
  'Full-grain leather belt with a brushed buckle. Available in yellow with complementary white styling details.',
  72.25,
  null,
  14,
  'Trail Form',
  ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80']::text[],
  ARRAY['yellow', 'white', 'orange']::text[],
  ARRAY['One Size']::text[],
  ARRAY['accessory', 'finish', 'style', 'soft', 'poplin', 'yellow', 'accessories', 'curated', 'styla-seed']::text[],
  false,
  4.14
from shop;

commit;

-- Verify: select c.slug, count(*) from products p join categories c on c.id=p.category_id where 'styla-seed'=any(p.tags) group by 1 order by 1;