/**
 * Migration Script: Mock Data to Supabase
 *
 * This script migrates the mock data from data/mockData.ts to your Supabase database.
 *
 * Usage:
 * 1. Ensure your .env.local is configured with Supabase credentials
 * 2. Run: npx tsx scripts/migrate-mock-data.ts
 *
 * Note: Install tsx if needed: npm install -D tsx
 */

import { supabase } from '../lib/supabase';
import { mockEbooks, mockProducts } from '../data/mockData';

async function migrateEbooks() {
  console.log('Starting ebook migration...');

  for (const ebook of mockEbooks) {
    const { data, error } = await supabase
      .from('ebooks')
      .insert({
        title: ebook.title,
        author: ebook.author,
        description: ebook.description,
        cover_image_url: ebook.coverImage,
        file_url: ebook.downloadUrl,
        genre: ebook.genre,
        publication_year: ebook.publicationYear,
        page_count: ebook.pageCount,
      })
      .select()
      .single();

    if (error) {
      console.error(`Error inserting ebook "${ebook.title}":`, error);
    } else {
      console.log(`✓ Inserted ebook: ${ebook.title}`);
    }
  }

  console.log('Ebook migration complete!\n');
}

async function migrateProducts() {
  console.log('Starting product migration...');

  for (const product of mockProducts) {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image,
        category: product.category,
        in_stock: product.inStock,
        // Note: You'll need to add stripe_price_id manually after creating products in Stripe
        stripe_price_id: null,
      })
      .select()
      .single();

    if (error) {
      console.error(`Error inserting product "${product.name}":`, error);
    } else {
      console.log(`✓ Inserted product: ${product.name}`);
    }
  }

  console.log('Product migration complete!\n');
}

async function main() {
  console.log('=== BriansBookcase Data Migration ===\n');

  // Check Supabase connection
  const { data, error } = await supabase.from('ebooks').select('count').single();

  if (error) {
    console.error('Error connecting to Supabase:', error);
    console.log('\nMake sure:');
    console.log('1. Your .env.local file has valid Supabase credentials');
    console.log('2. You have created the database tables (see SETUP.md)');
    process.exit(1);
  }

  console.log('✓ Connected to Supabase\n');

  try {
    await migrateEbooks();
    await migrateProducts();

    console.log('=== Migration Complete! ===');
    console.log('\nNext steps:');
    console.log('1. Update product stripe_price_id values in Supabase after creating Stripe products');
    console.log('2. Upload actual ebook files and update file_url');
    console.log('3. Upload images and update cover_image_url and image_url');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();
