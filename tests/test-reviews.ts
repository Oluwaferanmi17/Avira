/**
 * Test script for Review system
 * Run this with: npx ts-node --compiler-options '{"module":"CommonJS"}' tests/test-reviews.ts
 * (Note: This is a conceptual test script, you might need to adjust based on your environment)
 */

async function testReviewSystem() {
    const baseUrl = 'http://localhost:3000/api';

    console.log('--- Testing Review System ---');

    // 1. Test fetching reviews for a specific stay
    try {
        const stayId = 1; // Adjust based on your DB
        const res = await fetch(`${baseUrl}/review?stayId=${stayId}`);
        if (res.ok) {
            const reviews = await res.json();
            console.log(`✅ Successfully fetched ${reviews.length} reviews for stay ${stayId}`);
        } else {
            console.error(`❌ Failed to fetch reviews for stay ${stayId}: ${res.statusText}`);
        }
    } catch (error) {
        console.error('❌ Error testing fetch reviews:', error);
    }

    // 2. Test fetching detailed stay data with reviews
    try {
        const stayId = 1; // Adjust
        const res = await fetch(`${baseUrl}/stays/${stayId}`);
        if (res.ok) {
            const stay = await res.json();
            if (stay.reviews) {
                console.log(`✅ Stay ${stayId} data includes ${stay.reviews.length} reviews`);
            } else {
                console.error(`❌ Stay ${stayId} data missing reviews field`);
            }
        } else {
            console.error(`❌ Failed to fetch stay ${stayId}: ${res.statusText}`);
        }
    } catch (error) {
        console.error('❌ Error testing stay detail reviews:', error);
    }
}

// testReviewSystem();
console.log("Ready to test. Please ensure the server is running.");
